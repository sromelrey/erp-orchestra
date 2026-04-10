import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, EntityManager } from 'typeorm';
import {
  StockBalance,
  StockLedger,
  GoodsReceiptItem,
  GoodsReceipt,
  GoodsReceiptStatus,
} from '@/entities';
import { StockMovementType } from '@/types/enums';
import {
  CreateGoodsReceiptDto,
  CreateGoodsReceiptItemDto,
} from './dto/create-goods-receipt.dto';
import { UpdateGoodsReceiptDto } from './dto/update-goods-receipt.dto';
import { ConfirmGoodsReceiptDto } from './dto/confirm-goods-receipt.dto';

export interface GoodsReceiptFilters {
  page?: number;
  limit?: number;
  status?: string;
  receiptType?: string;
}

@Injectable()
export class GoodsReceiptService {
  constructor(
    @InjectRepository(GoodsReceipt)
    private readonly goodsReceiptRepository: Repository<GoodsReceipt>,
    @InjectRepository(GoodsReceiptItem)
    private readonly goodsReceiptItemRepository: Repository<GoodsReceiptItem>,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Creates a new goods receipt in DRAFT status
   */
  async create(
    createGoodsReceiptDto: CreateGoodsReceiptDto,
    actor?: { userId: number; tenantId: number },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generate receipt number
      const receiptNumber = await this.generateReceiptNumber(
        actor?.tenantId || 1,
        queryRunner.manager,
      );

      // Create goods receipt (exclude items to prevent cascade double-insertion)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { items: _, ...receiptData } = createGoodsReceiptDto;
      const goodsReceipt = queryRunner.manager.create(GoodsReceipt, {
        ...receiptData,
        receiptNumber,
        status: GoodsReceiptStatus.DRAFT,
        tenantId: actor?.tenantId || 1,
        createdBy: actor?.userId,
        receiptDate: createGoodsReceiptDto.receiptDate || new Date(),
        totalQuantity: createGoodsReceiptDto.items.reduce(
          (sum, item) => sum + item.quantityOrdered,
          0,
        ),
        totalValue: createGoodsReceiptDto.items.reduce(
          (sum, item) => sum + (item.totalPrice || 0),
          0,
        ),
      });

      const savedReceipt = await queryRunner.manager.save(goodsReceipt);

      // Create goods receipt items with duplicate prevention
      const uniqueItems = new Map<
        string,
        (typeof createGoodsReceiptDto.items)[0]
      >();
      createGoodsReceiptDto.items.forEach((item) => {
        const key = `${item.itemId}-${item.uomId}`;
        if (!uniqueItems.has(key)) {
          uniqueItems.set(key, item);
        }
      });

      // Save items one by one to prevent TypeORM duplication
      const savedItems: GoodsReceiptItem[] = [];
      for (const itemData of uniqueItems.values()) {
        const item = queryRunner.manager.create(GoodsReceiptItem, {
          ...itemData,
          goodsReceiptId: savedReceipt.id,
          quantityReceived: itemData.quantityReceived || 0,
          totalPrice:
            itemData.totalPrice ||
            (itemData.unitPrice
              ? itemData.unitPrice * itemData.quantityOrdered
              : 0),
        });
        const savedItem = await queryRunner.manager.save(item);
        savedItems.push(savedItem);
      }

      await queryRunner.commitTransaction();

      // Return with relations
      return this.findOne(savedReceipt.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Lists all goods receipts with filtering and pagination
   */
  async findAll(filters: GoodsReceiptFilters) {
    const { page = 1, limit = 20, status, receiptType } = filters;
    const skip = (page - 1) * limit;

    const queryBuilder = this.goodsReceiptRepository
      .createQueryBuilder('gr')
      .leftJoinAndSelect('gr.items', 'items')
      .leftJoinAndSelect('items.item', 'item')
      .leftJoinAndSelect('items.uom', 'uom')
      .leftJoinAndSelect('gr.warehouse', 'warehouse')
      .leftJoinAndSelect('gr.location', 'location')
      .where('gr.deletedAt IS NULL')
      .distinct(true);

    if (status) {
      queryBuilder.andWhere('gr.status = :status', { status });
    }

    if (receiptType) {
      queryBuilder.andWhere('gr.receiptType = :receiptType', { receiptType });
    }

    const [items, total] = await queryBuilder
      .orderBy('gr.createdAt', 'DESC')
      .skip(skip)
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

  /**
   * Finds a goods receipt by ID
   */
  async findOne(id: number) {
    const goodsReceipts = await this.goodsReceiptRepository
      .createQueryBuilder('gr')
      .leftJoinAndSelect('gr.items', 'items')
      .leftJoinAndSelect('items.item', 'item')
      .leftJoinAndSelect('items.uom', 'uom')
      .leftJoinAndSelect('gr.warehouse', 'warehouse')
      .leftJoinAndSelect('gr.location', 'location')
      .where('gr.id = :id AND gr.deletedAt IS NULL', { id })
      .getMany();

    if (!goodsReceipts || goodsReceipts.length === 0) {
      throw new NotFoundException(`Goods receipt with ID ${id} not found`);
    }

    const goodsReceipt = goodsReceipts[0];

    // Manually deduplicate items array (distinct(true) doesn't work with multiple joins)
    if (goodsReceipt.items && goodsReceipt.items.length > 0) {
      const uniqueItems = new Map<number, GoodsReceiptItem>();
      goodsReceipt.items.forEach((item) => {
        if (!uniqueItems.has(item.id)) {
          uniqueItems.set(item.id, item);
        }
      });
      goodsReceipt.items = Array.from(uniqueItems.values());
    }

    return goodsReceipt;
  }

  /**
   * Finds a goods receipt by receipt number
   */
  async findByReceiptNumber(receiptNumber: string) {
    const goodsReceipt = await this.goodsReceiptRepository
      .createQueryBuilder('gr')
      .leftJoinAndSelect('gr.items', 'items')
      .leftJoinAndSelect('items.item', 'item')
      .leftJoinAndSelect('items.uom', 'uom')
      .leftJoinAndSelect('gr.warehouse', 'warehouse')
      .leftJoinAndSelect('gr.location', 'location')
      .where('gr.receiptNumber = :receiptNumber AND gr.deletedAt IS NULL', {
        receiptNumber,
      })
      .getOne();

    if (!goodsReceipt) {
      throw new NotFoundException(
        `Goods receipt with receipt number ${receiptNumber} not found`,
      );
    }

    // Manually deduplicate items array (distinct(true) doesn't work with multiple joins)
    if (goodsReceipt.items && goodsReceipt.items.length > 0) {
      const uniqueItems = new Map<number, GoodsReceiptItem>();
      goodsReceipt.items.forEach((item) => {
        if (!uniqueItems.has(item.id)) {
          uniqueItems.set(item.id, item);
        }
      });
      goodsReceipt.items = Array.from(uniqueItems.values());
    }

    return goodsReceipt;
  }

  /**
   * Updates a goods receipt (only DRAFT status)
   */
  async update(
    id: number,
    updateGoodsReceiptDto: UpdateGoodsReceiptDto,
    actor?: { userId: number; tenantId: number },
  ) {
    const goodsReceipt = await this.findOne(id);

    if (goodsReceipt.status !== GoodsReceiptStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT receipts can be updated');
    }

    // Update totals if items are provided
    let calculatedTotalQuantity = 0;
    let calculatedTotalValue = 0;

    if (updateGoodsReceiptDto.items) {
      calculatedTotalQuantity = updateGoodsReceiptDto.items.reduce(
        (sum: number, item: CreateGoodsReceiptItemDto) =>
          sum + item.quantityOrdered,
        0,
      );
      calculatedTotalValue = updateGoodsReceiptDto.items.reduce(
        (sum: number, item: CreateGoodsReceiptItemDto) =>
          sum + (item.totalPrice || 0),
        0,
      );
    }

    // Create a proper type for update data
    type UpdateGoodsReceiptData = UpdateGoodsReceiptDto & {
      totalQuantity?: number;
      totalValue?: number;
      updatedBy?: number;
    };

    // Extract only the goods receipt properties, not the items
    const goodsReceiptData = { ...updateGoodsReceiptDto };
    delete goodsReceiptData.items;

    const updateData: UpdateGoodsReceiptData = {
      ...goodsReceiptData,
      updatedBy: actor?.userId,
    };

    // Only include calculated totals if items were updated
    if (updateGoodsReceiptDto.items) {
      updateData.totalQuantity = calculatedTotalQuantity;
      updateData.totalValue = calculatedTotalValue;
    }

    await this.goodsReceiptRepository.update(id, updateData);

    // Handle item updates
    if (updateGoodsReceiptDto.items) {
      await this.goodsReceiptItemRepository.delete({ goodsReceiptId: id });

      const items = updateGoodsReceiptDto.items.map(
        (item: CreateGoodsReceiptItemDto) =>
          this.goodsReceiptItemRepository.create({
            ...item,
            goodsReceiptId: id,
            quantityReceived: item.quantityReceived || 0,
            totalPrice:
              item.totalPrice ||
              (item.unitPrice ? item.unitPrice * item.quantityOrdered : 0),
          }),
      );

      await this.goodsReceiptItemRepository.save(items);
    }

    return this.findOne(id);
  }

  /**
   * Confirms a goods receipt and creates stock movements
   */
  async confirm(
    id: number,
    confirmDto: ConfirmGoodsReceiptDto,
    actor?: { userId: number; tenantId: number },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const goodsReceipt = await queryRunner.manager.findOne(GoodsReceipt, {
        where: { id },
        relations: ['items', 'items.item', 'items.uom'],
      });

      if (!goodsReceipt) {
        throw new NotFoundException(`Goods receipt with ID ${id} not found`);
      }

      if (goodsReceipt.status !== GoodsReceiptStatus.DRAFT) {
        throw new BadRequestException('Only DRAFT receipts can be confirmed');
      }

      // Validate all items have received quantity
      for (const item of goodsReceipt.items) {
        if (!item.quantityReceived || item.quantityReceived <= 0) {
          throw new BadRequestException(
            `Item ${item.item.name} must have received quantity`,
          );
        }
      }

      // Update receipt status
      await queryRunner.manager.update(GoodsReceipt, id, {
        status: GoodsReceiptStatus.CONFIRMED,
        notes: confirmDto.notes
          ? `${goodsReceipt.notes || ''}\n\nConfirmation: ${confirmDto.notes}`.trim()
          : goodsReceipt.notes,
        updatedBy: actor?.userId,
      });

      // Create stock movements
      for (const item of goodsReceipt.items) {
        const stockMovement = queryRunner.manager.create(StockLedger, {
          tenantId: actor?.tenantId || 1,
          warehouseId: goodsReceipt.warehouseId,
          locationId: goodsReceipt.locationId,
          itemId: item.itemId,
          uomId: item.uomId,
          quantity: item.quantityReceived.toString(),
          movementType: StockMovementType.RECEIPT,
          referenceType: goodsReceipt.receiptType,
          referenceCode: goodsReceipt.receiptNumber,
          memo: `Goods receipt: ${goodsReceipt.receiptNumber}`,
          documentDate: goodsReceipt.receiptDate,
          createdBy: actor?.userId,
        });

        await queryRunner.manager.save(stockMovement);

        // Update stock balance
        await this.updateStockBalance(
          queryRunner.manager,
          goodsReceipt.warehouseId,
          goodsReceipt.locationId,
          item.itemId,
          item.uomId,
          item.quantityReceived,
          actor?.tenantId || 1,
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

  /**
   * Cancels a goods receipt (only DRAFT status)
   */
  async cancel(id: number, actor?: { userId: number; tenantId: number }) {
    const goodsReceipt = await this.findOne(id);

    if (goodsReceipt.status !== GoodsReceiptStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT receipts can be cancelled');
    }

    await this.goodsReceiptRepository.update(id, {
      status: GoodsReceiptStatus.CANCELLED,
      updatedBy: actor?.userId,
    });

    return this.findOne(id);
  }

  /**
   * Generates a unique receipt number
   */
  private async generateReceiptNumber(
    tenantId: number,
    queryRunner: EntityManager,
  ): Promise<string> {
    const prefix = 'GR';
    const date = new Date();
    const yearMonth =
      date.getFullYear().toString().slice(-2) +
      (date.getMonth() + 1).toString().padStart(2, '0');

    // Find the last receipt number for this month
    const lastReceipt = await queryRunner
      .createQueryBuilder(GoodsReceipt, 'gr')
      .where('gr.receiptNumber LIKE :pattern', {
        pattern: `${prefix}${yearMonth}%`,
      })
      .orderBy('gr.receiptNumber', 'DESC')
      .getOne();

    let sequence = '0001';
    if (lastReceipt) {
      const lastSequence = parseInt(lastReceipt.receiptNumber.slice(-4));
      sequence = (lastSequence + 1).toString().padStart(4, '0');
    }

    return `${prefix}${yearMonth}${sequence}`;
  }

  /**
   * Updates stock balance for a warehouse/location/item combination
   */
  private async updateStockBalance(
    manager: EntityManager,
    warehouseId: number,
    locationId: number | undefined,
    itemId: number,
    uomId: number,
    quantity: number,
    tenantId: number,
  ) {
    const balance = await manager.findOne(StockBalance, {
      where: {
        tenantId,
        warehouseId,
        locationId,
        itemId,
        uomId,
      },
    });

    if (balance) {
      // Update existing balance
      await manager.increment(
        StockBalance,
        {
          tenantId,
          warehouseId,
          locationId,
          itemId,
          uomId,
        },
        'onHandQty',
        quantity,
      );
    } else {
      // Create new balance
      const newBalance = manager.create(StockBalance, {
        tenantId,
        warehouseId,
        locationId,
        itemId,
        uomId,
        onHandQty: quantity.toString(),
      });
      await manager.save(newBalance);
    }
  }
}
