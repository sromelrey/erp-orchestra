import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bom } from '../../../entities/operations/bom.entity';
import { BomItem } from '../../../entities/operations/bom-item.entity';
import { BomRepository } from './repositories/bom.repository';
import { BomValidationService } from './bom-validation.service';
import { BomCostingService } from './services/bom-costing.service';
import { CreateBomDto } from './dto/create-bom.dto';
import { UpdateBomDto } from './dto/update-bom.dto';
import { UpdateBomStatusDto } from './dto/update-bom-status.dto';
import { CalculateBomCostDto } from './dto/calculate-bom-cost.dto';
import { DataSource, QueryFailedError, Repository } from 'typeorm';
import { PaginatedResult } from '@/types';
import { ListBomDto } from './dto/list-bom.dto';
import { CostingMethod } from '@/types/enums';

interface ActorContext {
  tenantId: number;
  userId: number;
}

@Injectable()
export class BillOfMaterialsService {
  constructor(
    @InjectRepository(BomItem)
    private bomItemRepo: Repository<BomItem>,
    private bomRepository: BomRepository,
    private bomValidationService: BomValidationService,
    private bomCostingService: BomCostingService,
    private dataSource: DataSource,
  ) {}

  private sortBomItems(items?: BomItem[]): BomItem[] {
    if (!items?.length) {
      return [];
    }

    return [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));
  }

  async create(createBomDto: CreateBomDto, actor: ActorContext): Promise<Bom> {
    try {
      // Check for existing BOM with same version
      const existingBom = await this.bomRepository.findOne(actor.tenantId, {
        where: {
          parentMaterialId: createBomDto.parentMaterialId,
          version: createBomDto.version,
          isActive: true,
        },
      });

      if (existingBom) {
        throw new BadRequestException(
          `Version ${createBomDto.version} already exists for material ID ${createBomDto.parentMaterialId}`,
        );
      }

      // Validate version uniqueness
      await this.bomValidationService.validateVersionUniqueness(
        actor.tenantId,
        createBomDto.parentMaterialId,
        createBomDto.version,
      );

      // Detect cycles
      await this.bomValidationService.detectCyclesByComponents(
        actor.tenantId,
        createBomDto.parentMaterialId,
        createBomDto.lines.map((l) => l.componentMaterialId),
      );
      return await this.dataSource.transaction(async (manager) => {
        // Create BOM header
        const bom = manager.create(Bom);
        bom.tenantId = actor.tenantId;
        bom.code = createBomDto.code;
        bom.name = createBomDto.name;
        bom.parentMaterialId = createBomDto.parentMaterialId;
        bom.version = createBomDto.version;
        bom.effectiveDate = createBomDto.effectiveDate
          ? new Date(createBomDto.effectiveDate)
          : undefined;
        bom.expiryDate = createBomDto.expiryDate
          ? new Date(createBomDto.expiryDate)
          : undefined;
        bom.isActive = true;
        bom.createdBy = actor.userId;

        const savedBom = await manager.save(bom);

        // Create BOM lines
        for (let i = 0; i < createBomDto.lines.length; i++) {
          const line = createBomDto.lines[i];
          const bomLine = manager.create(BomItem, {
            bomId: savedBom.id,
            componentMaterialId: line.componentMaterialId,
            quantity: line.quantity,
            uom: line.uom,
            scrapPercentage: line.scrapPercentage ?? 0,
            sortOrder: line.sortOrder ?? i + 1,
            createdBy: actor.userId,
          });
          await manager.save(bomLine);
        }

        // Query within the same transaction to get relations
        const bomWithItems = await manager.findOne(Bom, {
          where: { id: savedBom.id },
          relations: ['items'],
        });

        if (!bomWithItems) {
          throw new Error('Failed to retrieve created BOM');
        }

        // Sort items by sortOrder
        bomWithItems.items = this.sortBomItems(bomWithItems.items as BomItem[]);

        return bomWithItems;
      });
    } catch (error: unknown) {
      // Handle unique constraint violation
      if (error instanceof QueryFailedError) {
        const driverError = error.driverError as
          | { code?: string; constraint?: string }
          | undefined;

        if (
          driverError?.code === '23505' &&
          driverError?.constraint === 'UQ_boms_tenant_material_version'
        ) {
          throw new BadRequestException(
            `Version ${createBomDto.version} already exists for material ID ${createBomDto.parentMaterialId}`,
          );
        }
      }
      // Re-throw other errors
      throw error;
    }
  }

  async findAll(
    query: ListBomDto,
    tenantId: number,
  ): Promise<PaginatedResult<Bom>> {
    const {
      cursor,
      limit = 10,
      search,
      parentMaterialId,
      status,
      isActive,
    } = query;

    const queryBuilder = this.bomRepository
      .getRepository()
      .createQueryBuilder('bom')
      .leftJoinAndSelect('bom.items', 'items')
      .where('bom.tenantId = :tenantId', { tenantId });

    if (search) {
      queryBuilder.andWhere(
        '(bom.code ILIKE :search OR bom.name ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    if (parentMaterialId) {
      queryBuilder.andWhere('bom.parentMaterialId = :parentMaterialId', {
        parentMaterialId,
      });
    }

    if (status) {
      queryBuilder.andWhere('bom.status = :status', { status });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('bom.isActive = :isActive', { isActive });
    }

    // Apply cursor-based pagination
    if (cursor) {
      queryBuilder.andWhere('bom.id > :cursor', { cursor });
    }

    const data = await queryBuilder
      .orderBy('bom.id', 'ASC')
      .take(limit + 1) // Take one extra to determine if there's a next page
      .getMany();

    const hasNextPage = data.length > limit;
    const items = hasNextPage ? data.slice(0, limit) : data;
    const nextCursor = hasNextPage ? items[items.length - 1].id : null;

    // Sort items in each BOM
    items.forEach((bom) => {
      if (bom.items) {
        bom.items = this.sortBomItems(bom.items as BomItem[]);
      }
    });

    return {
      data: items,
      meta: {
        nextCursor,
      },
    };
  }

  async findOne(id: number, tenantId: number): Promise<Bom> {
    const bom = await this.bomRepository.getRepository().findOne({
      where: { id, tenantId },
      relations: ['items'],
    });

    if (!bom) {
      throw new NotFoundException('BOM not found');
    }

    // Sort items by sortOrder
    bom.items = this.sortBomItems(bom.items as BomItem[]);

    return bom;
  }

  async update(
    id: number,
    updateBomDto: UpdateBomDto,
    actor: ActorContext,
  ): Promise<Bom> {
    const existingBom = await this.findOne(id, actor.tenantId);

    return await this.dataSource.transaction(async (manager) => {
      // If version is provided, create new version
      if (
        updateBomDto.version &&
        updateBomDto.version !== existingBom.version
      ) {
        // Deactivate old version
        await manager.update(Bom, id, {
          isActive: false,
          updatedBy: actor.userId,
        });

        // Validate new version uniqueness
        await this.bomValidationService.validateVersionUniqueness(
          actor.tenantId,
          existingBom.parentMaterialId,
          updateBomDto.version,
          existingBom.id,
        );

        // Create new version
        const newBom = manager.create(Bom);
        newBom.tenantId = existingBom.tenantId;
        newBom.code = existingBom.code;
        newBom.name = updateBomDto.name ?? existingBom.name;
        newBom.parentMaterialId = existingBom.parentMaterialId;
        newBom.version = updateBomDto.version;
        newBom.effectiveDate = updateBomDto.effectiveDate
          ? new Date(updateBomDto.effectiveDate)
          : existingBom.effectiveDate;
        newBom.expiryDate = updateBomDto.expiryDate
          ? new Date(updateBomDto.expiryDate)
          : existingBom.expiryDate;
        newBom.status = existingBom.status;
        newBom.isActive = true;
        newBom.createdBy = actor.userId;

        const savedBom = await manager.save(newBom);

        // Copy or update lines
        if (updateBomDto.lines) {
          for (let i = 0; i < updateBomDto.lines.length; i++) {
            const line = updateBomDto.lines[i];
            const bomLine = manager.create(BomItem, {
              bomId: savedBom.id,
              componentMaterialId: line.componentMaterialId,
              quantity: line.quantity,
              uom: line.uom,
              scrapPercentage: line.scrapPercentage ?? 0,
              sortOrder: line.sortOrder ?? i + 1,
              createdBy: actor.userId,
            });
            await manager.save(bomLine);
          }
        }

        // Query within the same transaction to get relations
        const bomWithItems = await manager.findOne(Bom, {
          where: { id: savedBom.id },
          relations: ['items'],
        });

        if (!bomWithItems) {
          throw new Error('Failed to retrieve created BOM');
        }

        // Sort items by sortOrder
        bomWithItems.items = this.sortBomItems(bomWithItems.items as BomItem[]);

        return bomWithItems;
      } else {
        // Update existing BOM
        Object.assign(existingBom, updateBomDto, {
          updatedBy: actor.userId,
          updatedAt: new Date(),
        });

        await manager.save(existingBom);

        // Update lines if provided
        if (updateBomDto.lines) {
          // Delete existing lines
          await manager.delete(BomItem, { bomId: id });

          // Create new lines
          for (let i = 0; i < updateBomDto.lines?.length; i++) {
            const line = updateBomDto.lines[i];
            const bomLine = manager.create(BomItem, {
              bomId: id,
              componentMaterialId: line.componentMaterialId,
              quantity: line.quantity,
              uom: line.uom,
              scrapPercentage: line.scrapPercentage ?? 0,
              sortOrder: line.sortOrder ?? i + 1,
              createdBy: actor.userId,
            });
            await manager.save(bomLine);
          }
        }

        // Query within the same transaction to get relations
        const bomWithItems = await manager.findOne(Bom, {
          where: { id },
          relations: ['items'],
        });

        if (!bomWithItems) {
          throw new Error('Failed to retrieve updated BOM');
        }

        // Sort items by sortOrder
        bomWithItems.items = this.sortBomItems(bomWithItems.items as BomItem[]);

        return bomWithItems;
      }
    });
  }

  async updateStatus(
    id: number,
    updateStatusDto: UpdateBomStatusDto,
    actor: ActorContext,
  ): Promise<Bom> {
    const bom = await this.findOne(id, actor.tenantId);

    if (updateStatusDto.isActive === false) {
      await this.bomValidationService.canDeactivate(actor.tenantId, id);
    }

    Object.assign(bom, updateStatusDto, {
      updatedBy: actor.userId,
      updatedAt: new Date(),
    });

    return await this.bomRepository.save(bom);
  }

  async remove(id: number, actor: ActorContext): Promise<void> {
    await this.findOne(id, actor.tenantId);

    // Soft delete
    await this.bomRepository.update(actor.tenantId, id, {
      deletedAt: new Date(),
      deletedBy: actor.userId,
    });
  }

  async getActiveForItem(
    parentMaterialId: number,
    tenantId: number,
  ): Promise<Bom> {
    const bom = await this.bomRepository.getRepository().findOne({
      where: {
        parentMaterialId,
        tenantId,
        isActive: true,
      },
      relations: ['items'],
    });

    if (!bom) {
      throw new NotFoundException('No active BOM found for this item');
    }

    bom.items = this.sortBomItems(bom.items as BomItem[]);
    return bom;
  }

  async calculateCost(
    bomId: number,
    tenantId: number,
    options?: Partial<CalculateBomCostDto>,
  ): Promise<{
    bomId: number;
    totalCost: number;
    componentCosts: {
      componentMaterialId: number;
      quantity: number;
      unitCost: number;
      totalCost: number;
    }[];
  }> {
    const calculateOptions: CalculateBomCostDto = {
      bomId,
      costingMethod: options?.costingMethod || CostingMethod.STANDARD,
      outputQuantity: options?.outputQuantity || 1,
      costUom: options?.costUom || 'EA',
      costDate: options?.costDate
        ? new Date(options.costDate).toISOString()
        : new Date().toISOString(),
      includeScrap: options?.includeScrap ?? true,
      includeLabor: options?.includeLabor ?? true,
      includeOverhead: options?.includeOverhead ?? true,
      notes: options?.notes,
    };

    const costingResult = await this.bomCostingService.calculateBomCost(
      bomId,
      tenantId,
      calculateOptions,
      0, // userId - not used for calculation
    );

    // Transform to legacy format
    return {
      bomId,
      totalCost: costingResult.totalCost,
      componentCosts: costingResult.components.map((comp) => ({
        componentMaterialId: comp.componentMaterialId,
        quantity: comp.requiredQuantity,
        unitCost: comp.unitCost,
        totalCost: comp.totalCost,
      })),
    };
  }

  async getWhereUsed(
    componentMaterialId: number,
    tenantId: number,
  ): Promise<Bom[]> {
    return await this.bomRepository
      .getRepository()
      .createQueryBuilder('bom')
      .leftJoinAndSelect('bom.items', 'item')
      .leftJoinAndSelect('bom.parentMaterial', 'parentMaterial')
      .where('bom.tenantId = :tenantId', { tenantId })
      .andWhere('item.componentMaterialId = :componentMaterialId', {
        componentMaterialId,
      })
      .andWhere('bom.isActive = :isActive', { isActive: true })
      .getMany();
  }
}
