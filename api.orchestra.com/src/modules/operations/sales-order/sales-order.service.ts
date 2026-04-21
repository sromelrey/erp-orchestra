import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Like } from 'typeorm';
import {
  SalesOrder,
  SalesOrderItem,
  SalesOrderStatus,
  Item,
  UnitOfMeasure,
  Warehouse,
  WarehouseLocation,
  StockLedger,
} from '@/entities';
import { StockMovementType } from '@/types/enums';
import {
  CreateSalesOrderDto,
  UpdateSalesOrderDto,
  ConfirmSalesOrderDto,
  ShipSalesOrderDto,
  DeliverSalesOrderDto,
  CancelSalesOrderDto,
} from './dto';
import { ServiceConfigService } from '@/modules/service-config/services/service-config.service';

export interface SalesOrderFilters {
  page?: number;
  limit?: number;
  status?: SalesOrderStatus;
  customerName?: string;
  orderNo?: string;
  orderDateFrom?: Date;
  orderDateTo?: Date;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class SalesOrderService {
  constructor(
    @InjectRepository(SalesOrder)
    private readonly salesOrderRepository: Repository<SalesOrder>,
    @InjectRepository(SalesOrderItem)
    private readonly salesOrderItemRepository: Repository<SalesOrderItem>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(UnitOfMeasure)
    private readonly unitOfMeasureRepository: Repository<UnitOfMeasure>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(WarehouseLocation)
    private readonly warehouseLocationRepository: Repository<WarehouseLocation>,
    private readonly dataSource: DataSource,
    private readonly serviceConfigService: ServiceConfigService,
  ) {}

  /**
   * Creates a new sales order in DRAFT status
   */
  async create(
    createSalesOrderDto: CreateSalesOrderDto,
    actor?: { userId: number; tenantId: number },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Generate order number
      const orderNo = await this.generateOrderNumber(actor?.tenantId);

      // Create sales order
      const salesOrder = queryRunner.manager.create(SalesOrder, {
        tenantId: actor?.tenantId,
        orderNo,
        customerName: createSalesOrderDto.customerName,
        orderDate: createSalesOrderDto.orderDate,
        deliveryDate: createSalesOrderDto.deliveryDate,
        status: SalesOrderStatus.DRAFT,
        notes: createSalesOrderDto.notes,
        totalAmount: 0,
        discountAmount: 0,
        taxAmount: 0,
        finalAmount: 0,
      });

      const savedOrder = await queryRunner.manager.save(salesOrder);

      // Process order items
      let totalAmount = 0;
      const items: SalesOrderItem[] = [];

      for (const itemDto of createSalesOrderDto.items) {
        // Validate item exists
        const item = await this.itemRepository.findOne({
          where: { id: itemDto.itemId },
        });
        if (!item) {
          throw new BadRequestException(
            `Item with ID ${itemDto.itemId} not found`,
          );
        }

        // Validate UOM
        const uom = await this.unitOfMeasureRepository.findOne({
          where: { id: itemDto.unitOfMeasureId },
        });
        if (!uom) {
          throw new BadRequestException(
            `Unit of Measure with ID ${itemDto.unitOfMeasureId} not found`,
          );
        }

        // Validate warehouse
        const warehouse = await this.warehouseRepository.findOne({
          where: { id: itemDto.warehouseId },
        });
        if (!warehouse) {
          throw new BadRequestException(
            `Warehouse with ID ${itemDto.warehouseId} not found`,
          );
        }

        // Validate location
        const location = await this.warehouseLocationRepository.findOne({
          where: { id: itemDto.locationId },
        });
        if (!location) {
          throw new BadRequestException(
            `Location with ID ${itemDto.locationId} not found`,
          );
        }

        // Handle service configuration for pricing and BOM lookup
        let unitPrice = itemDto.unitPrice;

        if (itemDto.serviceTypeId && itemDto.serviceOptionId) {
          // Build conditions array
          const conditions: { key: string; value: string }[] = [];
          if (itemDto.labelSource) {
            conditions.push({
              key: 'LABEL_SOURCE',
              value: itemDto.labelSource,
            });
          }

          // Get configuration details
          const configDetails =
            await this.serviceConfigService.getConfigurationDetails(
              actor?.tenantId || 0,
              itemDto.serviceTypeId,
              itemDto.serviceOptionId,
              conditions,
            );

          if (configDetails) {
            // Use configuration price if available
            unitPrice = configDetails.price;
            // TODO: Store bomId for future use in production planning
          }
        }

        // Calculate line totals
        const lineTotal = itemDto.quantity * unitPrice;
        const discountAmount =
          (lineTotal * (itemDto.discountPercent || 0)) / 100;
        const afterDiscount = lineTotal - discountAmount;
        const taxAmount = (afterDiscount * (itemDto.taxPercent || 0)) / 100;
        const finalLineTotal = afterDiscount + taxAmount;

        const salesOrderItem = queryRunner.manager.create(SalesOrderItem, {
          salesOrderId: savedOrder.id,
          itemId: itemDto.itemId,
          itemCode: item.code,
          itemName: item.name,
          quantity: itemDto.quantity,
          unitOfMeasureId: itemDto.unitOfMeasureId,
          unitOfMeasureCode: uom.code,
          unitPrice,
          discountPercent: itemDto.discountPercent || 0,
          discountAmount,
          taxPercent: itemDto.taxPercent || 0,
          taxAmount,
          lineTotal: finalLineTotal,
          warehouseId: itemDto.warehouseId,
          warehouseName: warehouse.name,
          locationId: itemDto.locationId,
          locationName: location.name,
          notes: itemDto.notes,
          serviceTypeId: itemDto.serviceTypeId,
          serviceOptionId: itemDto.serviceOptionId,
          labelSource: itemDto.labelSource,
        });

        items.push(salesOrderItem);
        totalAmount += finalLineTotal;
      }

      // Save items
      await queryRunner.manager.save(items);

      // Update order totals
      savedOrder.totalAmount = totalAmount;
      savedOrder.finalAmount = totalAmount;
      await queryRunner.manager.save(savedOrder);

      await queryRunner.commitTransaction();

      // Return order with items
      return this.findOne(savedOrder.id, actor?.tenantId);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Finds all sales orders with filtering
   */
  async findAll(filters: SalesOrderFilters, tenantId?: number) {
    const {
      page = 1,
      limit = 20,
      status,
      customerName,
      orderNo,
      orderDateFrom,
      orderDateTo,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = filters;

    const queryBuilder = this.salesOrderRepository
      .createQueryBuilder('so')
      .leftJoinAndSelect('so.items', 'soi')
      .where('so.deletedAt IS NULL');

    if (tenantId) {
      queryBuilder.andWhere('so.tenantId = :tenantId', { tenantId });
    }

    if (status) {
      queryBuilder.andWhere('so.status = :status', { status });
    }

    if (customerName) {
      queryBuilder.andWhere('so.customerName ILIKE :customerName', {
        customerName: `%${customerName}%`,
      });
    }

    if (orderNo) {
      queryBuilder.andWhere('so.orderNo ILIKE :orderNo', {
        orderNo: `%${orderNo}%`,
      });
    }

    if (orderDateFrom) {
      queryBuilder.andWhere('so.orderDate >= :orderDateFrom', {
        orderDateFrom,
      });
    }

    if (orderDateTo) {
      queryBuilder.andWhere('so.orderDate <= :orderDateTo', { orderDateTo });
    }

    // Apply sorting
    queryBuilder.orderBy(`so.${sortBy}`, sortOrder);

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [orders, total] = await queryBuilder.getManyAndCount();

    return {
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Finds a sales order by ID
   */
  async findOne(id: number, tenantId?: number) {
    const order = await this.salesOrderRepository.findOne({
      where: { id, ...(tenantId && { tenantId }) },
      relations: ['items'],
    });

    if (!order) {
      throw new NotFoundException(`Sales Order with ID ${id} not found`);
    }

    return order;
  }

  /**
   * Updates a sales order
   */
  async update(
    id: number,
    updateSalesOrderDto: UpdateSalesOrderDto,
    actor?: { userId: number; tenantId: number },
  ) {
    const order = await this.findOne(id, actor?.tenantId);

    if (order.status !== SalesOrderStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT orders can be updated');
    }

    // Update order fields
    Object.assign(order, updateSalesOrderDto);

    // Recalculate totals if discount or tax changed
    if (
      updateSalesOrderDto.discountAmount !== undefined ||
      updateSalesOrderDto.taxAmount !== undefined
    ) {
      order.finalAmount =
        order.totalAmount -
        (order.discountAmount || 0) +
        (order.taxAmount || 0);
    }

    return this.salesOrderRepository.save(order);
  }

  /**
   * Confirms a sales order
   */
  async confirm(
    id: number,
    confirmDto: ConfirmSalesOrderDto,
    actor?: { userId: number; tenantId: number },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(SalesOrder, {
        where: { id, ...(actor?.tenantId && { tenantId: actor.tenantId }) },
        relations: ['items'],
      });

      if (!order) {
        throw new NotFoundException(`Sales Order with ID ${id} not found`);
      }

      if (order.status !== SalesOrderStatus.DRAFT) {
        throw new BadRequestException('Only DRAFT orders can be confirmed');
      }

      // Create stock ledger entries for each item
      for (const item of order.items) {
        const ledgerEntry = queryRunner.manager.create(StockLedger, {
          tenantId: actor?.tenantId || order.tenantId,
          warehouseId: item.warehouseId,
          locationId: item.locationId,
          itemId: item.itemId,
          uomId: item.unitOfMeasureId,
          quantity: item.quantity.toString(),
          movementType: StockMovementType.ISSUE,
          referenceCode: order.orderNo,
          documentDate: new Date(),
          memo: `Sales order confirmation for ${item.itemName}`,
        });

        await queryRunner.manager.save(ledgerEntry);

        // Update allocated quantity in order item
        item.allocatedQuantity = item.quantity;
        await queryRunner.manager.save(item);
      }

      // Update order status
      order.status = SalesOrderStatus.CONFIRMED;
      order.approvedBy = confirmDto.approvedBy || actor?.userId;
      order.approvedAt = new Date();
      if (confirmDto.notes) {
        order.notes =
          (order.notes || '') + '\n\nConfirmation: ' + confirmDto.notes;
      }

      await queryRunner.manager.save(order);

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
   * Ships a sales order
   */
  async ship(
    id: number,
    shipDto: ShipSalesOrderDto,
    actor?: { userId: number; tenantId: number },
  ) {
    const order = await this.findOne(id, actor?.tenantId);

    if (order.status !== SalesOrderStatus.CONFIRMED) {
      throw new BadRequestException('Only CONFIRMED orders can be shipped');
    }

    // Update order status
    order.status = SalesOrderStatus.SHIPPED;
    order.shippedBy = shipDto.shippedBy || actor?.userId;
    order.shippedAt = new Date();
    if (shipDto.notes) {
      order.notes = (order.notes || '') + '\n\nShipping: ' + shipDto.notes;
    }

    return this.salesOrderRepository.save(order);
  }

  /**
   * Delivers items for a sales order
   */
  async deliver(
    id: number,
    deliverDto: DeliverSalesOrderDto,
    actor?: { userId: number; tenantId: number },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(SalesOrder, {
        where: { id, ...(actor?.tenantId && { tenantId: actor.tenantId }) },
        relations: ['items'],
      });

      if (!order) {
        throw new NotFoundException(`Sales Order with ID ${id} not found`);
      }

      if (order.status !== SalesOrderStatus.SHIPPED) {
        throw new BadRequestException('Only SHIPPED orders can be delivered');
      }

      // Process delivered items
      let allDelivered = true;
      for (const deliveredItem of deliverDto.deliveredItems) {
        const orderItem = order.items.find(
          (item) => item.id === deliveredItem.orderItemId,
        );
        if (!orderItem) {
          throw new BadRequestException(
            `Order item with ID ${deliveredItem.orderItemId} not found`,
          );
        }

        const currentDelivered = Number(orderItem.deliveredQuantity);
        const newDelivered = currentDelivered + deliveredItem.deliveredQuantity;
        const orderedQuantity = Number(orderItem.quantity);

        if (newDelivered > orderedQuantity) {
          throw new BadRequestException(
            `Delivered quantity exceeds ordered quantity for item ${orderItem.itemName}`,
          );
        }

        // Update delivered quantity
        orderItem.deliveredQuantity = newDelivered;
        await queryRunner.manager.save(orderItem);

        // Create stock ledger entry
        const ledgerEntry = queryRunner.manager.create(StockLedger, {
          tenantId: actor?.tenantId || order.tenantId,
          warehouseId: orderItem.warehouseId,
          locationId: orderItem.locationId,
          itemId: orderItem.itemId,
          uomId: orderItem.unitOfMeasureId,
          quantity: deliveredItem.deliveredQuantity.toString(),
          movementType: StockMovementType.ISSUE,
          referenceCode: order.orderNo,
          documentDate: new Date(),
          memo: `Sales order delivery for ${orderItem.itemName}`,
        });

        await queryRunner.manager.save(ledgerEntry);

        // Check if all items are delivered
        if (Number(orderItem.deliveredQuantity) < Number(orderItem.quantity)) {
          allDelivered = false;
        }
      }

      // Update order status
      if (allDelivered) {
        order.status = SalesOrderStatus.DELIVERED;
        order.deliveredBy = deliverDto.deliveredBy || actor?.userId;
        order.deliveredAt = new Date();
      }

      if (deliverDto.notes) {
        order.notes = (order.notes || '') + '\n\nDelivery: ' + deliverDto.notes;
      }

      await queryRunner.manager.save(order);

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
   * Cancels a sales order
   */
  async cancel(
    id: number,
    cancelDto: CancelSalesOrderDto,
    actor?: { userId: number; tenantId: number },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const order = await queryRunner.manager.findOne(SalesOrder, {
        where: { id, ...(actor?.tenantId && { tenantId: actor.tenantId }) },
        relations: ['items'],
      });

      if (!order) {
        throw new NotFoundException(`Sales Order with ID ${id} not found`);
      }

      if (order.status === SalesOrderStatus.DELIVERED) {
        throw new BadRequestException('DELIVERED orders cannot be cancelled');
      }

      if (order.status === SalesOrderStatus.SHIPPED) {
        throw new BadRequestException('SHIPPED orders cannot be cancelled');
      }

      // Create stock ledger entry for cancellation if confirmed
      if (order.status === SalesOrderStatus.CONFIRMED) {
        for (const item of order.items) {
          if (item.allocatedQuantity > 0) {
            // Create stock ledger entry for release
            const ledgerEntry = queryRunner.manager.create(StockLedger, {
              tenantId: actor?.tenantId || order.tenantId,
              warehouseId: item.warehouseId,
              locationId: item.locationId,
              itemId: item.itemId,
              uomId: item.unitOfMeasureId,
              quantity: item.allocatedQuantity.toString(),
              movementType: StockMovementType.ADJUSTMENT,
              referenceCode: order.orderNo,
              documentDate: new Date(),
              memo: 'Stock release due to order cancellation',
            });

            await queryRunner.manager.save(ledgerEntry);
          }
        }
      }

      // Update order status
      order.status = SalesOrderStatus.CANCELLED;
      order.notes = (order.notes || '') + `\n\nCancelled: ${cancelDto.reason}`;
      if (cancelDto.notes) {
        order.notes += '\n\n' + cancelDto.notes;
      }

      await queryRunner.manager.save(order);

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
   * Removes a sales order (soft delete)
   */
  async remove(id: number, tenantId?: number) {
    const order = await this.findOne(id, tenantId);

    if (order.status !== SalesOrderStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT orders can be deleted');
    }

    return this.salesOrderRepository.softRemove(order);
  }

  /**
   * Generates a unique order number
   */
  private async generateOrderNumber(tenantId?: number): Promise<string> {
    const year = new Date().getFullYear();
    const prefix = `SO-${year}`;

    // Get the last order number for this year
    const lastOrder = await this.salesOrderRepository.findOne({
      where: {
        orderNo: Like(`${prefix}-%`),
        ...(tenantId && { tenantId }),
      },
      order: { orderNo: 'DESC' },
    });

    let sequence = 1;
    if (lastOrder) {
      const lastSequence = parseInt(lastOrder.orderNo.split('-')[2]);
      sequence = lastSequence + 1;
    }

    return `${prefix}-${sequence.toString().padStart(4, '0')}`;
  }
}
