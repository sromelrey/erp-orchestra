import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  CreateGoodsIssuanceDto,
  CreateGoodsIssuanceItemDto,
} from './dto/create-goods-issuance.dto';
import { UpdateGoodsIssuanceDto } from './dto/update-goods-issuance.dto';
import { ApproveGoodsIssuanceDto } from './dto/approve-goods-issuance.dto';
import { FindGoodsIssuanceDto } from './dto/find-goods-issuance.dto';
import {
  GoodsIssuance,
  GoodsIssuanceStatus,
} from '@/entities/operations/goods-issuance.entity';
import { GoodsIssuanceItem } from '@/entities/operations/goods-issuance-item.entity';
// TODO: Uncomment when services are implemented:
// import { StockLedgerService } from '../stock-ledger/stock-ledger.service';
// import { StockMovementService } from '@/modules/stock-movement/stock-movement.service';
import { StockBalance } from '@/entities/operations/stock-balance.entity';
import { User } from '@/entities/system/user.entity';

@Injectable()
export class GoodsIssuanceService {
  constructor(
    @InjectRepository(GoodsIssuance)
    private readonly goodsIssuanceRepository: Repository<GoodsIssuance>,
    @InjectRepository(GoodsIssuanceItem)
    private readonly goodsIssuanceItemRepository: Repository<GoodsIssuanceItem>,
    @InjectRepository(StockBalance)
    private readonly stockBalanceRepository: Repository<StockBalance>,
    // private readonly stockLedgerService: StockLedgerService, // TODO: Implement when service is available
    // private readonly stockMovementService: StockMovementService, // TODO: Implement when service is available
    private readonly dataSource: DataSource,
  ) {}
  /**
   * Creates a new goods issuance record
   */
  async create(
    createGoodsIssuanceDto: CreateGoodsIssuanceDto,
    actor?: User,
  ): Promise<GoodsIssuance> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generate issuance number
      const issuanceNumber = await this.generateIssuanceNumber();

      // Calculate totals
      const calculatedTotalQuantity = createGoodsIssuanceDto.items.reduce(
        (sum: number, item: CreateGoodsIssuanceItemDto) =>
          sum + item.quantityIssued,
        0,
      );
      const calculatedTotalValue = createGoodsIssuanceDto.items.reduce(
        (sum: number, item: CreateGoodsIssuanceItemDto) =>
          sum + (item.totalPrice || 0),
        0,
      );

      // Create goods issuance
      const goodsIssuance = queryRunner.manager.create(GoodsIssuance, {
        ...createGoodsIssuanceDto,
        issuanceNumber,
        totalQuantity: calculatedTotalQuantity,
        totalValue: calculatedTotalValue,
        status: GoodsIssuanceStatus.DRAFT,
        tenantId: actor?.tenantId || 1, // Default to tenant 1 if not provided
        createdBy: actor?.id || undefined,
        updatedBy: actor?.id || undefined,
        items: undefined, // Ensure items is not set to avoid cascade issues
      });

      // Save goods issuance first without items
      const savedIssuance = await queryRunner.manager.save(goodsIssuance);

      // Now create and save items separately
      const items = createGoodsIssuanceDto.items.map(
        (item: CreateGoodsIssuanceItemDto) => {
          const goodsIssuanceItem = this.goodsIssuanceItemRepository.create({
            goodsIssuanceId: savedIssuance.id,
            itemId: item.itemId,
            uomId: item.uomId,
            quantityIssued: item.quantityIssued,
            unitPrice: item.unitPrice,
            totalPrice:
              item.totalPrice ||
              (item.unitPrice ? item.unitPrice * item.quantityIssued : 0),
            batchNumber: item.batchNumber,
            expiryDate: item.expiryDate ? new Date(item.expiryDate) : undefined,
            notes: item.notes,
            tenantId: actor?.tenantId || 1,
            createdBy: actor?.id || undefined,
            updatedBy: actor?.id || undefined,
          });
          return goodsIssuanceItem;
        },
      );

      await queryRunner.manager.insert(GoodsIssuanceItem, items);

      await queryRunner.commitTransaction();
      return this.findOne(savedIssuance.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Retrieves all goods issuances with pagination
   */
  async findAll(
    page: number = 1,
    limit: number = 20,
    filters?: FindGoodsIssuanceDto,
  ): Promise<[GoodsIssuance[], number]> {
    const queryBuilder = this.goodsIssuanceRepository
      .createQueryBuilder('gi')
      .leftJoinAndSelect('gi.items', 'items')
      .leftJoinAndSelect('items.item', 'item')
      .leftJoinAndSelect('items.uom', 'uom')
      .leftJoinAndSelect('gi.warehouse', 'warehouse')
      .leftJoinAndSelect('gi.location', 'location')
      .where('gi.deletedAt IS NULL');

    // Apply filters
    if (filters?.status) {
      queryBuilder.andWhere('gi.status = :status', {
        status: filters.status as string,
      });
    }
    if (filters?.issuanceType) {
      queryBuilder.andWhere('gi.issuanceType = :issuanceType', {
        issuanceType: filters.issuanceType as string,
      });
    }
    if (filters?.warehouseId) {
      queryBuilder.andWhere('gi.warehouseId = :warehouseId', {
        warehouseId: Number(filters.warehouseId),
      });
    }
    if (filters?.dateFrom) {
      queryBuilder.andWhere('gi.issuanceDate >= :dateFrom', {
        dateFrom: filters.dateFrom,
      });
    }
    if (filters?.dateTo) {
      queryBuilder.andWhere('gi.issuanceDate <= :dateTo', {
        dateTo: filters.dateTo,
      });
    }

    queryBuilder
      .orderBy('gi.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    return queryBuilder.getManyAndCount();
  }

  /**
   * Retrieves a goods issuance by ID
   */
  async findOne(id: number): Promise<GoodsIssuance> {
    const goodsIssuance = await this.goodsIssuanceRepository
      .createQueryBuilder('gi')
      .leftJoinAndSelect('gi.items', 'items')
      .leftJoinAndSelect('items.item', 'item')
      .leftJoinAndSelect('items.uom', 'uom')
      .leftJoinAndSelect('gi.warehouse', 'warehouse')
      .leftJoinAndSelect('gi.location', 'location')
      .where('gi.id = :id AND gi.deletedAt IS NULL', { id })
      .getOne();

    if (!goodsIssuance) {
      throw new NotFoundException(`Goods issuance with ID ${id} not found`);
    }

    // Ensure items property is always an array to match the entity type
    goodsIssuance.items = goodsIssuance.items || [];

    return goodsIssuance;
  }

  /**
   * Updates a goods issuance (only DRAFT status can be updated)
   */
  async update(
    id: number,
    updateGoodsIssuanceDto: UpdateGoodsIssuanceDto,
    actor?: User,
  ): Promise<GoodsIssuance> {
    const goodsIssuance = await this.findOne(id);

    if (goodsIssuance.status !== GoodsIssuanceStatus.DRAFT) {
      throw new BadRequestException(
        'Only goods issuances in DRAFT status can be updated',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Calculate totals if items are updated
      let calculatedTotalQuantity = goodsIssuance.totalQuantity;
      let calculatedTotalValue = goodsIssuance.totalValue;

      if (updateGoodsIssuanceDto.items) {
        calculatedTotalQuantity = updateGoodsIssuanceDto.items.reduce(
          (sum: number, item: CreateGoodsIssuanceItemDto) =>
            sum + item.quantityIssued,
          0,
        );
        calculatedTotalValue = updateGoodsIssuanceDto.items.reduce(
          (sum: number, item: CreateGoodsIssuanceItemDto) =>
            sum + (item.totalPrice || 0),
          0,
        );
      }

      // Extract only the goods issuance properties, not the items
      const goodsIssuanceData = { ...updateGoodsIssuanceDto };
      delete goodsIssuanceData.items;

      const updateData = {
        ...goodsIssuanceData,
        updatedBy: actor?.id || undefined,
      };

      // Only include calculated totals if items were updated
      if (updateGoodsIssuanceDto.items) {
        // Spread operator to add computed properties
        const updateWithTotals = {
          ...updateData,
          totalQuantity: calculatedTotalQuantity,
          totalValue: calculatedTotalValue,
        };
        await queryRunner.manager.update(GoodsIssuance, id, updateWithTotals);
      } else {
        await queryRunner.manager.update(GoodsIssuance, id, updateData);
      }

      // Handle item updates
      if (updateGoodsIssuanceDto.items) {
        await queryRunner.manager.delete(GoodsIssuanceItem, {
          goodsIssuanceId: id,
        });

        const items = updateGoodsIssuanceDto.items.map(
          (item: CreateGoodsIssuanceItemDto) =>
            queryRunner.manager.create(GoodsIssuanceItem, {
              ...item,
              goodsIssuanceId: id,
              totalPrice:
                item.totalPrice ||
                (item.unitPrice ? item.unitPrice * item.quantityIssued : 0),
              createdBy: actor?.id || undefined,
              updatedBy: actor?.id || undefined,
            }),
        );
        await queryRunner.manager.save(items);
      }

      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Soft deletes a goods issuance
   */
  async remove(id: number, actor?: User): Promise<void> {
    const goodsIssuance = await this.findOne(id);

    if (goodsIssuance.status !== GoodsIssuanceStatus.DRAFT) {
      throw new BadRequestException(
        'Only goods issuances in DRAFT status can be deleted',
      );
    }

    await this.goodsIssuanceRepository.update(id, {
      deletedAt: new Date(),
      deletedBy: actor?.id || undefined,
    });
  }

  /**
   * Retrieves a goods issuance by number
   */
  async findByNumber(issuanceNumber: string): Promise<GoodsIssuance> {
    const goodsIssuance = await this.goodsIssuanceRepository
      .createQueryBuilder('gi')
      .leftJoinAndSelect('gi.items', 'items')
      .leftJoinAndSelect('items.item', 'item')
      .leftJoinAndSelect('items.uom', 'uom')
      .leftJoinAndSelect('gi.warehouse', 'warehouse')
      .leftJoinAndSelect('gi.location', 'location')
      .where('gi.issuanceNumber = :issuanceNumber AND gi.deletedAt IS NULL', {
        issuanceNumber,
      })
      .getOne();

    if (!goodsIssuance) {
      throw new NotFoundException(
        `Goods issuance with number ${issuanceNumber} not found`,
      );
    }

    // Ensure items property is always an array to match the entity type
    goodsIssuance.items = goodsIssuance.items || [];

    return goodsIssuance;
  }

  /**
   * Approves a goods issuance and updates stock
   */
  async approve(
    id: number,
    approveDto: ApproveGoodsIssuanceDto,
    actor?: User,
  ): Promise<GoodsIssuance> {
    const goodsIssuance = await this.findOne(id);

    if (goodsIssuance.status !== GoodsIssuanceStatus.DRAFT) {
      throw new BadRequestException(
        'Only goods issuances in DRAFT status can be approved',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Check stock availability
      for (const item of goodsIssuance.items) {
        const stockBalance = await queryRunner.manager.findOne(StockBalance, {
          where: {
            itemId: item.itemId,
            warehouseId: goodsIssuance.warehouseId,
            locationId: goodsIssuance.locationId,
          },
        });

        if (
          !stockBalance ||
          Number(stockBalance.onHandQty) < item.quantityIssued
        ) {
          throw new ConflictException(
            `Insufficient stock for item ${item.item.name}. Available: ${stockBalance?.onHandQty || 0}, Required: ${item.quantityIssued}`,
          );
        }
      }

      // Update status to APPROVED
      await queryRunner.manager.update(GoodsIssuance, id, {
        status: GoodsIssuanceStatus.APPROVED,
        approvedBy: actor?.id || undefined,
        approvedAt: new Date(),
        updatedBy: actor?.id || undefined,
      });

      // Create stock ledger entries for each item
      // TODO: Implement stock ledger service
      // for (const item of goodsIssuance.items) {
      //   await this.stockLedgerService.createStockMovement(
      //     {
      //       itemId: item.itemId,
      //       warehouseId: goodsIssuance.warehouseId,
      //       locationId: goodsIssuance.locationId,
      //       transactionType: 'ISSUANCE',
      //       referenceNumber: goodsIssuance.issuanceNumber,
      //       quantity: -item.quantityIssued, // Negative for issuance
      //       unitPrice: item.unitPrice,
      //       notes:
      //         approveDto.notes || `Issuance: ${goodsIssuance.issuanceNumber}`,
      //     },
      //     queryRunner,
      //   );
      // }

      // Update status to ISSUED
      await queryRunner.manager.update(GoodsIssuance, id, {
        status: GoodsIssuanceStatus.ISSUED,
        updatedBy: actor?.id || undefined,
      });

      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Cancels a goods issuance
   */
  async cancel(id: number, actor?: User): Promise<GoodsIssuance> {
    const goodsIssuance = await this.findOne(id);

    if (goodsIssuance.status === GoodsIssuanceStatus.CANCELLED) {
      throw new BadRequestException('Goods issuance is already cancelled');
    }

    if (goodsIssuance.status === GoodsIssuanceStatus.ISSUED) {
      throw new BadRequestException(
        'Cannot cancel an already issued goods issuance',
      );
    }

    await this.goodsIssuanceRepository.update(id, {
      status: GoodsIssuanceStatus.CANCELLED,
      updatedBy: actor?.id || undefined,
    });

    return this.findOne(id);
  }

  /**
   * Generates a unique issuance number
   */
  private async generateIssuanceNumber(): Promise<string> {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const prefix = `GI${year}${month}`;

    const lastIssuance = await this.goodsIssuanceRepository
      .createQueryBuilder('gi')
      .where('gi.issuanceNumber LIKE :prefix', { prefix: `${prefix}%` })
      .orderBy('gi.issuanceNumber', 'DESC')
      .getOne();

    let sequence = '001';
    if (lastIssuance) {
      const lastSequence = parseInt(lastIssuance.issuanceNumber.slice(-3));
      sequence = String(lastSequence + 1).padStart(3, '0');
    }

    return `${prefix}${sequence}`;
  }
}
