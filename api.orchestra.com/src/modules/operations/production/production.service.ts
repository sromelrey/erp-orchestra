import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like } from 'typeorm';
import {
  ProductionBatch,
  ProductionWorkOrder,
  ProductionConsumption,
  ProductionStatus,
  Bom,
  BomItem,
  Item,
  StockLedger,
} from '@/entities';
import { StockMovementType } from '@/types/enums';
import { CreateProductionBatchDto, UpdateProductionBatchDto } from './dto';

export interface ProductionBatchFilters {
  page?: number;
  limit?: number;
  status?: ProductionStatus;
  batchNo?: string;
  startDateFrom?: Date;
  startDateTo?: Date;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class ProductionService {
  constructor(
    @InjectRepository(ProductionBatch)
    private readonly productionBatchRepository: Repository<ProductionBatch>,
    @InjectRepository(ProductionWorkOrder)
    private readonly productionWorkOrderRepository: Repository<ProductionWorkOrder>,
    @InjectRepository(ProductionConsumption)
    private readonly productionConsumptionRepository: Repository<ProductionConsumption>,
    @InjectRepository(Bom)
    private readonly bomRepository: Repository<Bom>,
    @InjectRepository(BomItem)
    private readonly bomItemRepository: Repository<BomItem>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(StockLedger)
    private readonly stockLedgerRepository: Repository<StockLedger>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Creates a new production batch in PLANNED status
   */
  async create(
    createProductionBatchDto: CreateProductionBatchDto,
    actor?: { userId: number; tenantId: number },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generate batch number
      const batchNo = await this.generateBatchNumber(actor?.tenantId);

      // Validate BOM exists
      const bom = await this.bomRepository.findOne({
        where: { id: createProductionBatchDto.bomId },
      });
      if (!bom) {
        throw new BadRequestException(
          `BOM with ID ${createProductionBatchDto.bomId} not found`,
        );
      }

      // Create production batch
      const productionBatch = queryRunner.manager.create(ProductionBatch, {
        tenantId: actor?.tenantId,
        batchNo,
        bomId: createProductionBatchDto.bomId,
        plannedQuantity: createProductionBatchDto.plannedQuantity,
        status: ProductionStatus.PLANNED,
        startDate: createProductionBatchDto.startDate
          ? new Date(createProductionBatchDto.startDate)
          : undefined,
        endDate: createProductionBatchDto.endDate
          ? new Date(createProductionBatchDto.endDate)
          : undefined,
        notes: createProductionBatchDto.notes,
      });

      const savedBatch = await queryRunner.manager.save(productionBatch);

      // Create work orders if provided
      if (createProductionBatchDto.workOrders) {
        const workOrders: ProductionWorkOrder[] = [];
        for (const workOrderDto of createProductionBatchDto.workOrders) {
          const workOrder = queryRunner.manager.create(ProductionWorkOrder, {
            batchId: savedBatch.id,
            stepName: workOrderDto.stepName,
            status: ProductionStatus.PLANNED,
            notes: workOrderDto.notes,
          });
          workOrders.push(workOrder);
        }
        await queryRunner.manager.save(workOrders);
      }

      // Create consumption records based on BOM
      const bomItems = await this.bomItemRepository.find({
        where: { bomId: createProductionBatchDto.bomId },
        relations: ['componentMaterial'],
      });

      const consumptions: ProductionConsumption[] = [];
      for (const bomItem of bomItems) {
        const plannedQuantity =
          bomItem.quantity *
          createProductionBatchDto.plannedQuantity *
          (1 + bomItem.scrapPercentage / 100);

        const consumption = queryRunner.manager.create(ProductionConsumption, {
          batchId: savedBatch.id,
          itemId: bomItem.componentMaterialId,
          plannedQuantity,
          tenantId: actor?.tenantId,
        });
        consumptions.push(consumption);
      }
      await queryRunner.manager.save(consumptions);

      await queryRunner.commitTransaction();

      // Return batch with relations
      return this.findOne(savedBatch.id, actor?.tenantId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Finds all production batches with filtering
   */
  async findAll(filters: ProductionBatchFilters, tenantId?: number) {
    const {
      page = 1,
      limit = 20,
      status,
      batchNo,
      startDateFrom,
      startDateTo,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filters;

    const queryBuilder = this.productionBatchRepository
      .createQueryBuilder('pb')
      .leftJoinAndSelect('pb.bom', 'bom')
      .leftJoinAndSelect('pb.workOrders', 'wo')
      .leftJoinAndSelect('pb.consumptions', 'pc')
      .leftJoinAndSelect('pc.item', 'item')
      .where('pb.deletedAt IS NULL');

    if (tenantId) {
      queryBuilder.andWhere('pb.tenantId = :tenantId', { tenantId });
    }

    if (status) {
      queryBuilder.andWhere('pb.status = :status', { status });
    }

    if (batchNo) {
      queryBuilder.andWhere('pb.batchNo ILIKE :batchNo', {
        batchNo: `%${batchNo}%`,
      });
    }

    if (startDateFrom) {
      queryBuilder.andWhere('pb.startDate >= :startDateFrom', {
        startDateFrom,
      });
    }

    if (startDateTo) {
      queryBuilder.andWhere('pb.startDate <= :startDateTo', { startDateTo });
    }

    // Apply sorting
    queryBuilder.orderBy(`pb.${sortBy}`, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [batches, total] = await queryBuilder.getManyAndCount();

    return {
      batches,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Finds a production batch by ID
   */
  async findOne(id: number, tenantId?: number) {
    const batch = await this.productionBatchRepository.findOne({
      where: { id, ...(tenantId && { tenantId }) },
      relations: ['bom', 'workOrders', 'consumptions', 'consumptions.item'],
    });

    if (!batch) {
      throw new NotFoundException(`Production Batch with ID ${id} not found`);
    }

    return batch;
  }

  /**
   * Updates a production batch
   */
  async update(
    id: number,
    updateProductionBatchDto: UpdateProductionBatchDto,
    actor?: { userId: number; tenantId: number },
  ) {
    const batch = await this.findOne(id, actor?.tenantId);

    if (batch.status !== ProductionStatus.PLANNED) {
      throw new BadRequestException('Only PLANNED batches can be updated');
    }

    // Update batch fields
    Object.assign(batch, updateProductionBatchDto);

    return this.productionBatchRepository.save(batch);
  }

  /**
   * Starts a production batch (moves to IN_PROGRESS and consumes materials)
   */
  async start(id: number, actor?: { userId: number; tenantId: number }) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const batch = await queryRunner.manager.findOne(ProductionBatch, {
        where: { id, ...(actor?.tenantId && { tenantId: actor.tenantId }) },
        relations: ['consumptions', 'consumptions.item'],
      });

      if (!batch) {
        throw new NotFoundException(`Production Batch with ID ${id} not found`);
      }

      if (batch.status !== ProductionStatus.PLANNED) {
        throw new BadRequestException('Only PLANNED batches can be started');
      }

      // Create stock ledger entries for material consumption
      for (const consumption of batch.consumptions) {
        const ledgerEntry = queryRunner.manager.create(StockLedger, {
          tenantId: actor?.tenantId || batch.tenantId,
          warehouseId: 1, // TODO: Get from BOM or batch
          locationId: 1, // TODO: Get from BOM or batch
          itemId: consumption.itemId,
          uomId: consumption.item?.baseUomId || 1, // TODO: Get from item
          quantity: consumption.plannedQuantity.toString(),
          movementType: StockMovementType.ISSUE,
          referenceCode: batch.batchNo,
          documentDate: new Date(),
          memo: `Material consumption for production batch ${batch.batchNo}`,
        });

        await queryRunner.manager.save(ledgerEntry);
      }

      // Update batch status
      batch.status = ProductionStatus.IN_PROGRESS;
      batch.startDate = new Date();

      await queryRunner.manager.save(batch);

      await queryRunner.commitTransaction();

      return this.findOne(id, actor?.tenantId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Completes a production batch (receives finished goods)
   */
  async complete(
    id: number,
    actualQuantity: number,
    actor?: { userId: number; tenantId: number },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const batch = await queryRunner.manager.findOne(ProductionBatch, {
        where: { id, ...(actor?.tenantId && { tenantId: actor.tenantId }) },
        relations: ['bom'],
      });

      if (!batch) {
        throw new NotFoundException(`Production Batch with ID ${id} not found`);
      }

      if (batch.status !== ProductionStatus.IN_PROGRESS) {
        throw new BadRequestException(
          'Only IN_PROGRESS batches can be completed',
        );
      }

      // For now, we'll use the parent material as the finished good
      // TODO: Add finishedGoodId to BOM entity if needed
      const finishedGoodId = batch.bom?.parentMaterialId;
      if (!finishedGoodId) {
        throw new BadRequestException('BOM has no parent material defined');
      }

      // Create stock ledger entry for finished goods receipt
      const ledgerEntry = queryRunner.manager.create(StockLedger, {
        tenantId: actor?.tenantId || batch.tenantId,
        warehouseId: 1, // TODO: Get from batch or config
        locationId: 1, // TODO: Get from batch or config
        itemId: finishedGoodId,
        uomId: 1, // TODO: Get from BOM relation
        quantity: actualQuantity.toString(),
        movementType: StockMovementType.RECEIPT,
        referenceCode: batch.batchNo,
        documentDate: new Date(),
        memo: `Finished goods receipt from production batch ${batch.batchNo}`,
      });

      await queryRunner.manager.save(ledgerEntry);

      // Update batch
      batch.status = ProductionStatus.COMPLETED;
      batch.actualQuantity = actualQuantity;
      batch.endDate = new Date();

      await queryRunner.manager.save(batch);

      await queryRunner.commitTransaction();

      return this.findOne(id, actor?.tenantId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Cancels a production batch
   */
  async cancel(
    id: number,
    reason: string,
    actor?: { userId: number; tenantId: number },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const batch = await queryRunner.manager.findOne(ProductionBatch, {
        where: { id, ...(actor?.tenantId && { tenantId: actor.tenantId }) },
      });

      if (!batch) {
        throw new NotFoundException(`Production Batch with ID ${id} not found`);
      }

      if (batch.status === ProductionStatus.COMPLETED) {
        throw new BadRequestException('COMPLETED batches cannot be cancelled');
      }

      if (batch.status === ProductionStatus.IN_PROGRESS) {
        // Create stock ledger entry to return consumed materials
        const consumptions = await queryRunner.manager.find(
          ProductionConsumption,
          {
            where: { batchId: id },
            relations: ['item'],
          },
        );

        for (const consumption of consumptions) {
          const ledgerEntry = queryRunner.manager.create(StockLedger, {
            tenantId: actor?.tenantId || batch.tenantId,
            warehouseId: 1, // TODO: Get from consumption
            locationId: 1, // TODO: Get from consumption
            itemId: consumption.itemId,
            uomId: consumption.item?.baseUomId || 1, // TODO: Get from item
            quantity: (
              consumption.actualQuantity || consumption.plannedQuantity
            ).toString(),
            movementType: StockMovementType.ADJUSTMENT,
            referenceCode: batch.batchNo,
            documentDate: new Date(),
            memo: `Material return from cancelled production batch ${batch.batchNo}`,
          });

          await queryRunner.manager.save(ledgerEntry);
        }
      }

      // Update batch status
      batch.status = ProductionStatus.CANCELLED;
      batch.notes = (batch.notes || '') + `\n\nCancelled: ${reason}`;

      await queryRunner.manager.save(batch);

      await queryRunner.commitTransaction();

      return this.findOne(id, actor?.tenantId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Removes a production batch (soft delete)
   */
  async remove(id: number, tenantId?: number) {
    const batch = await this.findOne(id, tenantId);

    if (batch.status !== ProductionStatus.PLANNED) {
      throw new BadRequestException('Only PLANNED batches can be deleted');
    }

    return this.productionBatchRepository.softRemove(batch);
  }

  /**
   * Generates a unique batch number
   */
  private async generateBatchNumber(tenantId?: number): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `PB-${year}`;

    // Get the last batch number for this year
    const lastBatch = await this.productionBatchRepository.findOne({
      where: {
        batchNo: Like(`${prefix}-%`),
        ...(tenantId && { tenantId }),
      },
      order: { batchNo: 'DESC' },
    });

    let sequence = 1;
    if (lastBatch) {
      const lastSequence = parseInt(lastBatch.batchNo.split('-')[2]);
      sequence = lastSequence + 1;
    }

    return `${prefix}-${sequence.toString().padStart(4, '0')}`;
  }
}
