import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, QueryRunner, IsNull } from 'typeorm';
import { StockTransfer, StockTransferItem } from '@/entities';
import {
  CreateStockTransferDto,
  UpdateStockTransferDto,
  ReceiveStockTransferDto,
} from './dto';
import { FindStockTransferDto } from './dto/find-stock-transfer.dto';
import { StockMovementService } from '../stock-movement.service';
import { StockMovementType } from '@/types/enums';
import { generateDocumentNumber } from '@/utils/document-number';

@Injectable()
export class InventoryTransferService {
  constructor(
    @InjectRepository(StockTransfer)
    private readonly stockTransferRepository: Repository<StockTransfer>,
    @InjectRepository(StockTransferItem)
    private readonly stockTransferItemRepository: Repository<StockTransferItem>,
    private readonly stockMovementService: StockMovementService,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    createStockTransferDto: CreateStockTransferDto,
    actor?: { id: number; tenantId: number },
  ) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Validate source and destination are different
      if (
        createStockTransferDto.sourceWarehouseId ===
        createStockTransferDto.destinationWarehouseId
      ) {
        throw new BadRequestException(
          'Source and destination warehouses must be different',
        );
      }

      // Generate transfer number
      let transferNumber: string;
      try {
        transferNumber = await generateDocumentNumber(
          'ST',
          'stock_transfers',
          queryRunner,
          'transfer_number',
        );
      } catch (error) {
        throw new Error(
          `Failed to generate transfer number: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }

      // Calculate totals
      const calculatedTotalQuantity = createStockTransferDto.items.reduce(
        (sum, item) => sum + item.quantityTransferred,
        0,
      );

      const calculatedTotalValue = createStockTransferDto.items.reduce(
        (sum, item) => sum + (item.totalCost || 0),
        0,
      );

      // Create stock transfer
      const stockTransfer = queryRunner.manager.create(StockTransfer, {
        ...createStockTransferDto,
        transferNumber,
        totalQuantity: calculatedTotalQuantity,
        totalValue: calculatedTotalValue,
        status: 'PENDING',
        tenantId: actor?.tenantId || 1,
        createdBy: actor?.id,
        updatedBy: actor?.id,
        items: undefined,
      });

      // Save stock transfer first
      const savedTransfer = await queryRunner.manager.save(stockTransfer);

      // Create items
      const items = createStockTransferDto.items.map((item) =>
        this.stockTransferItemRepository.create({
          ...item,
          stockTransferId: savedTransfer.id,
          tenantId: actor?.tenantId || 1,
          createdBy: actor?.id,
        }),
      );

      await queryRunner.manager.insert(StockTransferItem, items);

      await queryRunner.commitTransaction();
      return this.findOne(savedTransfer.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(findStockTransferDto: FindStockTransferDto) {
    const {
      page = 1,
      limit = 10,
      transferNumber,
      sourceWarehouseId,
      destinationWarehouseId,
      status,
      transferDateFrom,
      transferDateTo,
      expectedDateFrom,
      expectedDateTo,
    } = findStockTransferDto;

    const queryBuilder = this.stockTransferRepository
      .createQueryBuilder('st')
      .where('st.deleted_at IS NULL');

    if (transferNumber) {
      queryBuilder.andWhere('st.transfer_number ILIKE :transferNumber', {
        transferNumber: `%${transferNumber}%`,
      });
    }

    if (sourceWarehouseId) {
      queryBuilder.andWhere('st.source_warehouse_id = :sourceWarehouseId', {
        sourceWarehouseId,
      });
    }

    if (destinationWarehouseId) {
      queryBuilder.andWhere(
        'st.destination_warehouse_id = :destinationWarehouseId',
        { destinationWarehouseId },
      );
    }

    if (status) {
      queryBuilder.andWhere('st.status = :status', { status });
    }

    if (transferDateFrom) {
      queryBuilder.andWhere('st.transfer_date >= :transferDateFrom', {
        transferDateFrom,
      });
    }

    if (transferDateTo) {
      queryBuilder.andWhere('st.transfer_date <= :transferDateTo', {
        transferDateTo,
      });
    }

    if (expectedDateFrom) {
      queryBuilder.andWhere('st.expected_date >= :expectedDateFrom', {
        expectedDateFrom,
      });
    }

    if (expectedDateTo) {
      queryBuilder.andWhere('st.expected_date <= :expectedDateTo', {
        expectedDateTo,
      });
    }

    const [items, total] = await queryBuilder
      .orderBy('st.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number) {
    const stockTransfer = await this.stockTransferRepository
      .createQueryBuilder('st')
      .leftJoinAndSelect('st.sourceWarehouse', 'sourceWarehouse')
      .leftJoinAndSelect('st.sourceLocation', 'sourceLocation')
      .leftJoinAndSelect('st.destinationWarehouse', 'destinationWarehouse')
      .leftJoinAndSelect('st.destinationLocation', 'destinationLocation')
      .leftJoinAndSelect('st.items', 'items')
      .leftJoinAndSelect('items.item', 'item')
      .where('st.id = :id', { id })
      .andWhere('st.deleted_at IS NULL')
      .getOne();

    if (!stockTransfer) {
      throw new NotFoundException(`Stock transfer with ID ${id} not found`);
    }

    return stockTransfer;
  }

  async update(
    id: number,
    updateStockTransferDto: UpdateStockTransferDto,
    actor?: { id: number },
  ) {
    const stockTransfer = await this.stockTransferRepository.findOne({
      where: { id, deletedAt: IsNull() },
      relations: [
        'sourceWarehouse',
        'sourceLocation',
        'destinationWarehouse',
        'destinationLocation',
      ],
    });

    if (!stockTransfer) {
      throw new NotFoundException(`Stock transfer with ID ${id} not found`);
    }

    if (stockTransfer.status !== 'PENDING') {
      throw new BadRequestException('Only pending transfers can be updated');
    }

    // Update basic fields (exclude items from Object.assign)
    const { items, ...updateData } = updateStockTransferDto;
    Object.assign(stockTransfer, updateData);
    stockTransfer.updatedBy = actor?.id;

    // Recalculate totals if items are provided
    if (items) {
      const calculatedTotalQuantity = items.reduce(
        (sum, item) => sum + item.quantityTransferred,
        0,
      );

      const calculatedTotalValue = items.reduce(
        (sum, item) => sum + (item.totalCost || 0),
        0,
      );

      stockTransfer.totalQuantity = calculatedTotalQuantity;
      stockTransfer.totalValue = calculatedTotalValue;

      // Delete existing items
      await this.stockTransferItemRepository.delete({
        stockTransferId: stockTransfer.id,
      });

      // Create new items
      const newItems = items.map((item) =>
        this.stockTransferItemRepository.create({
          ...item,
          stockTransferId: stockTransfer.id,
          tenantId: stockTransfer.tenantId,
          createdBy: stockTransfer.createdBy,
          updatedBy: actor?.id,
        }),
      );

      await this.stockTransferItemRepository.save(newItems);
    }

    return this.stockTransferRepository.save(stockTransfer);
  }

  async approve(id: number, actor?: { id: number; tenantId: number }) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const stockTransfer = await queryRunner.manager.findOne(StockTransfer, {
        where: { id },
        relations: ['items', 'items.item'],
      });

      if (!stockTransfer) {
        throw new NotFoundException(`Stock transfer with ID ${id} not found`);
      }

      if (stockTransfer.status !== 'PENDING') {
        throw new BadRequestException('Only pending transfers can be approved');
      }

      // Update status
      stockTransfer.status = 'APPROVED';
      stockTransfer.approvedBy = actor?.id;
      stockTransfer.approvedAt = new Date();
      stockTransfer.updatedBy = actor?.id;

      await queryRunner.manager.save(stockTransfer);

      // Create stock movements for transfer out
      for (const item of stockTransfer.items) {
        await this.stockMovementService.createMovement(
          {
            itemId: item.itemId,
            warehouseId: stockTransfer.sourceWarehouseId,
            locationId: stockTransfer.sourceLocationId,
            movementType: StockMovementType.TRANSFER_OUT,
            quantity: -item.quantityTransferred,
            unitCost: item.unitCost ?? undefined,
            referenceType: 'STOCK_TRANSFER',
            referenceId: stockTransfer.id,
            batchNumber: item.batchNumber,
            expiryDate: item.expiryDate,
            notes: stockTransfer.notes,
            tenantId: stockTransfer.tenantId,
          },
          queryRunner,
        );
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

  async ship(id: number, actor?: { id: number }) {
    const stockTransfer = await this.findOne(id);

    if (stockTransfer.status !== 'APPROVED') {
      throw new BadRequestException('Only approved transfers can be shipped');
    }

    stockTransfer.status = 'IN_TRANSIT';
    stockTransfer.shippedAt = new Date();
    stockTransfer.updatedBy = actor?.id;

    return this.stockTransferRepository.save(stockTransfer);
  }

  async receive(
    id: number,
    receiveStockTransferDto: ReceiveStockTransferDto,
    actor?: { id: number; tenantId: number },
  ) {
    const queryRunner: QueryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const stockTransfer = await queryRunner.manager.findOne(StockTransfer, {
        where: { id },
        relations: ['items', 'items.item'],
      });

      if (!stockTransfer) {
        throw new NotFoundException(`Stock transfer with ID ${id} not found`);
      }

      if (stockTransfer.status !== 'IN_TRANSIT') {
        throw new BadRequestException(
          'Only in-transit transfers can be received',
        );
      }

      // Update items with received quantities
      for (const itemDto of receiveStockTransferDto.items) {
        const item = stockTransfer.items.find(
          (i) => i.id === itemDto.stockTransferItemId,
        );
        if (!item) {
          throw new NotFoundException(
            `Transfer item with ID ${itemDto.stockTransferItemId} not found`,
          );
        }

        item.quantityReceived = itemDto.quantityReceived;
        await queryRunner.manager.save(item);

        // Create stock movement for transfer in
        await this.stockMovementService.createMovement(
          {
            itemId: item.itemId,
            warehouseId: stockTransfer.destinationWarehouseId,
            locationId: stockTransfer.destinationLocationId,
            movementType: StockMovementType.TRANSFER_IN,
            quantity: itemDto.quantityReceived,
            unitCost: item.unitCost ?? undefined,
            referenceType: 'STOCK_TRANSFER',
            referenceId: stockTransfer.id,
            batchNumber: item.batchNumber,
            expiryDate: item.expiryDate,
            notes: receiveStockTransferDto.notes || stockTransfer.notes,
            tenantId: stockTransfer.tenantId,
          },
          queryRunner,
        );
      }

      // Update transfer status
      stockTransfer.status = 'RECEIVED';
      stockTransfer.receivedAt = new Date();
      stockTransfer.receivedBy = actor?.id;
      stockTransfer.updatedBy = actor?.id;

      if (receiveStockTransferDto.notes) {
        stockTransfer.notes = receiveStockTransferDto.notes;
      }

      await queryRunner.manager.save(stockTransfer);

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
    const stockTransfer = await this.findOne(id);

    if (stockTransfer.status === 'CANCELLED') {
      throw new BadRequestException('Transfer is already cancelled');
    }

    if (['RECEIVED', 'IN_TRANSIT'].includes(stockTransfer.status)) {
      throw new BadRequestException(
        'Cannot cancel a received or in-transit transfer',
      );
    }

    stockTransfer.status = 'CANCELLED';
    stockTransfer.updatedBy = actor?.id;

    return this.stockTransferRepository.save(stockTransfer);
  }

  async remove(id: number, actor?: { id: number }) {
    const stockTransfer = await this.findOne(id);

    if (stockTransfer.status !== 'PENDING') {
      throw new BadRequestException('Only pending transfers can be deleted');
    }

    stockTransfer.deletedBy = actor?.id;
    stockTransfer.deletedAt = new Date();

    return this.stockTransferRepository.save(stockTransfer);
  }
}
