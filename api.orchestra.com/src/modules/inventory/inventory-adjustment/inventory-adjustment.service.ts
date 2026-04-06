import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  DataSource,
  FindOptionsWhere,
  FindOperator,
} from 'typeorm';
import { StockAdjustment, StockAdjustmentItem } from '@/entities';
import {
  IsNull,
  Like,
  Between,
  MoreThanOrEqual,
  LessThanOrEqual,
} from 'typeorm';
import {
  CreateStockAdjustmentDto,
  ApproveStockAdjustmentDto,
  UpdateStockAdjustmentDto,
  FindStockAdjustmentDto,
} from './dto';
import { generateDocumentNumber } from '../../../utils/document-number';

@Injectable()
export class InventoryAdjustmentService {
  constructor(
    @InjectRepository(StockAdjustment)
    private readonly stockAdjustmentRepository: Repository<StockAdjustment>,
    @InjectRepository(StockAdjustmentItem)
    private readonly stockAdjustmentItemRepository: Repository<StockAdjustmentItem>,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createStockAdjustmentDto: CreateStockAdjustmentDto,
    actor?: { id: number; tenantId: number },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generate adjustment number
      let adjustmentNumber: string;
      try {
        adjustmentNumber = await generateDocumentNumber(
          'SA',
          'stock_adjustments',
          queryRunner,
        );
      } catch (error) {
        throw new Error(
          `Failed to generate adjustment number: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        );
      }

      // Calculate totals
      const calculatedTotalQuantity = createStockAdjustmentDto.items.reduce(
        (sum, item) => sum + item.quantityAdjusted,
        0,
      );

      const calculatedTotalValue = createStockAdjustmentDto.items.reduce(
        (sum, item) => sum + (item.totalCost || 0),
        0,
      );

      // Create stock adjustment
      const stockAdjustment = queryRunner.manager.create(StockAdjustment, {
        ...createStockAdjustmentDto,
        adjustmentNumber,
        totalQuantity: calculatedTotalQuantity,
        totalValue: calculatedTotalValue,
        status: 'DRAFT',
        tenantId: actor?.tenantId || 1,
        createdBy: actor?.id,
        updatedBy: actor?.id,
        items: undefined,
      });

      // Save stock adjustment first
      const savedAdjustment = await queryRunner.manager.save(stockAdjustment);

      // Create items
      const items = createStockAdjustmentDto.items.map((item) =>
        this.stockAdjustmentItemRepository.create({
          ...item,
          totalCost: item.unitCost ? item.quantityAdjusted * item.unitCost : 0,
          stockAdjustmentId: savedAdjustment.id,
          tenantId: actor?.tenantId || 1,
          createdBy: actor?.id,
          updatedBy: actor?.id,
        }),
      );

      await queryRunner.manager.insert(StockAdjustmentItem, items);

      await queryRunner.commitTransaction();
      return this.findOne(savedAdjustment.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(findStockAdjustmentDto: FindStockAdjustmentDto) {
    const {
      page = 1,
      limit = 10,
      adjustmentNumber,
      adjustmentType,
      warehouseId,
      locationId,
      status,
      adjustmentDateFrom,
      adjustmentDateTo,
      referenceType,
      referenceId,
    } = findStockAdjustmentDto || {};

    // Build where condition
    const where: FindOptionsWhere<StockAdjustment> & {
      adjustmentDate?: any;
    } = {
      deletedAt: IsNull(),
    };

    // Initialize adjustmentDate filter if needed
    let dateFilter: FindOperator<Date> | undefined = undefined;

    if (adjustmentNumber) {
      where.adjustmentNumber = Like(`%${adjustmentNumber}%`);
    }

    if (adjustmentType) {
      where.adjustmentType = adjustmentType;
    }

    if (warehouseId) {
      where.warehouseId = warehouseId;
    }

    if (locationId) {
      where.locationId = locationId;
    }

    if (status) {
      where.status = status;
    }

    if (adjustmentDateFrom || adjustmentDateTo) {
      if (adjustmentDateFrom && adjustmentDateTo) {
        dateFilter = Between(
          new Date(adjustmentDateFrom),
          new Date(adjustmentDateTo),
        );
      } else if (adjustmentDateFrom) {
        dateFilter = MoreThanOrEqual(new Date(adjustmentDateFrom));
      } else if (adjustmentDateTo) {
        dateFilter = LessThanOrEqual(new Date(adjustmentDateTo));
      }

      if (dateFilter) {
        where.adjustmentDate = dateFilter;
      }
    }

    if (referenceType) {
      where.referenceType = referenceType;
    }

    if (referenceId) {
      where.referenceId = referenceId;
    }

    const [items, total] = await this.stockAdjustmentRepository.findAndCount({
      where,
      relations: ['warehouse', 'location', 'items', 'items.item'],
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const stockAdjustment = await this.stockAdjustmentRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: ['warehouse', 'location', 'items', 'items.item'],
    });

    if (!stockAdjustment) {
      throw new NotFoundException(`Stock adjustment with ID ${id} not found`);
    }

    return stockAdjustment;
  }

  async update(
    id: number,
    updateStockAdjustmentDto: UpdateStockAdjustmentDto,
    actor?: { id: number },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const stockAdjustment = await queryRunner.manager.findOne(
        StockAdjustment,
        {
          where: { id, deletedAt: IsNull() },
          relations: ['warehouse', 'location'], // Don't load items to avoid tracking issues
        },
      );

      if (!stockAdjustment) {
        throw new NotFoundException(`Stock adjustment with ID ${id} not found`);
      }

      if (stockAdjustment.status !== 'DRAFT') {
        throw new BadRequestException('Only draft adjustments can be updated');
      }

      // Update basic fields (exclude items from Object.assign)
      const { items, ...updateData } = updateStockAdjustmentDto;
      Object.assign(stockAdjustment, updateData);
      stockAdjustment.updatedBy = actor?.id;

      // Recalculate totals if items are provided
      if (items) {
        const calculatedTotalQuantity = items.reduce(
          (sum, item) => sum + item.quantityAdjusted,
          0,
        );

        const calculatedTotalValue = items.reduce(
          (sum, item) => sum + (item.totalCost || 0),
          0,
        );

        stockAdjustment.totalQuantity = calculatedTotalQuantity;
        stockAdjustment.totalValue = calculatedTotalValue;

        // Delete existing items using raw query to avoid TypeORM tracking issues
        await queryRunner.manager.delete(StockAdjustmentItem, {
          stockAdjustmentId: stockAdjustment.id,
        });

        // Create new items
        const newItems = items.map((item) => {
          return queryRunner.manager.create(StockAdjustmentItem, {
            ...item,
            totalCost: item.unitCost
              ? item.quantityAdjusted * item.unitCost
              : 0,
            stockAdjustmentId: stockAdjustment.id,
            tenantId: stockAdjustment.tenantId,
            createdBy: stockAdjustment.createdBy,
            updatedBy: actor?.id,
          });
        });

        await queryRunner.manager.save(StockAdjustmentItem, newItems);
      }

      const result = await queryRunner.manager.save(stockAdjustment);
      await queryRunner.commitTransaction();
      return result;
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  async approve(
    id: number,
    approveStockAdjustmentDto: ApproveStockAdjustmentDto,
    actor?: { id: number; tenantId: number },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const stockAdjustment = await queryRunner.manager.findOne(
        StockAdjustment,
        {
          where: { id },
          relations: ['items', 'items.item'],
        },
      );

      if (!stockAdjustment) {
        throw new NotFoundException(`Stock adjustment with ID ${id} not found`);
      }

      if (stockAdjustment.status !== 'DRAFT') {
        throw new BadRequestException('Only draft adjustments can be approved');
      }

      // Update status
      stockAdjustment.status = 'APPROVED';
      stockAdjustment.approvedBy = actor?.id;
      stockAdjustment.approvedAt = new Date();
      stockAdjustment.updatedBy = actor?.id;

      if (approveStockAdjustmentDto.notes != null) {
        stockAdjustment.notes = approveStockAdjustmentDto.notes;
      }

      await queryRunner.manager.save(stockAdjustment);

      // Create stock movements
      // await this.stockMovementService.createMovement(
      //   {
      //     itemId: item.itemId,
      //     warehouseId: stockAdjustment.warehouseId,
      //     locationId: stockAdjustment.locationId,
      //     movementType: StockMovementType.ADJUSTMENT,
      //     quantity: item.quantityAdjusted,
      //     unitCost: item.unitCost,
      //     referenceType: 'STOCK_ADJUSTMENT',
      //     referenceId: stockAdjustment.id,
      //     batchNumber: item.batchNumber,
      //     expiryDate: item.expiryDate,
      //     notes: stockAdjustment.notes,
      //     tenantId: stockAdjustment.tenantId,
      //   },
      //   queryRunner,
      // );

      await queryRunner.commitTransaction();
      return this.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async cancel(id: number, actor?: { id: number }) {
    const stockAdjustment = await this.findOne(id);

    if (stockAdjustment.status === 'CANCELLED') {
      throw new BadRequestException('Adjustment is already cancelled');
    }

    if (stockAdjustment.status === 'APPROVED') {
      throw new BadRequestException('Cannot cancel an approved adjustment');
    }

    stockAdjustment.status = 'CANCELLED';
    stockAdjustment.updatedBy = actor?.id;

    return this.stockAdjustmentRepository.save(stockAdjustment);
  }

  async remove(id: number, actor?: { id: number }) {
    const stockAdjustment = await this.findOne(id);

    if (stockAdjustment.status !== 'DRAFT') {
      throw new BadRequestException('Only draft adjustments can be deleted');
    }

    stockAdjustment.deletedBy = actor?.id;
    stockAdjustment.deletedAt = new Date();

    return this.stockAdjustmentRepository.save(stockAdjustment);
  }
}
