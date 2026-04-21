import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import {
  SalesOrder,
  SalesOrderItem,
  SalesOrderStatus,
  Item,
  UnitOfMeasure,
  Warehouse,
  WarehouseLocation,
} from '@/entities';
import {
  ImportSalesOrderRowDto,
  ImportSalesOrdersDto,
  ImportSalesOrderResult,
  ImportSalesOrderError,
} from './dto/import-sales-order.dto';

const DEFAULT_CUSTOMER = 'DEFAULT CUSTOMER';

// Normalize item code: trim, uppercase, replace spaces with hyphens
function normalizeItemCode(value: string): string {
  return value.trim().toUpperCase().replace(/\s+/g, '-');
}

interface GroupedOrder {
  order_no: string;
  customer_name: string;
  order_date: string;
  rows: ImportSalesOrderRowDto[];
}

@Injectable()
export class SalesOrderImportService {
  constructor(
    @InjectRepository(SalesOrder)
    private readonly salesOrderRepository: Repository<SalesOrder>,
    @InjectRepository(SalesOrderItem)
    private readonly salesOrderItemRepository: Repository<SalesOrderItem>,
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    @InjectRepository(UnitOfMeasure)
    private readonly uomRepository: Repository<UnitOfMeasure>,
    @InjectRepository(Warehouse)
    private readonly warehouseRepository: Repository<Warehouse>,
    @InjectRepository(WarehouseLocation)
    private readonly locationRepository: Repository<WarehouseLocation>,
    private readonly dataSource: DataSource,
  ) {}

  async import(
    dto: ImportSalesOrdersDto,
    actor: { userId: number; tenantId: number },
  ): Promise<ImportSalesOrderResult> {
    const {
      rows,
      autoConfirm = false,
      autoComplete = false,
      autoCreateItems = false,
      skipExisting = true,
      groupByCustomerDate = false,
      groupByOrderNo = true,
      validateOnly = false,
    } = dto;

    const errors: ImportSalesOrderError[] = [];
    let success = 0;
    let failed = 0;
    let skipped = 0;
    let itemsCreated = 0;
    let valid = 0;
    let invalid = 0;
    const rowsProcessed = rows.length;

    // Step 1: Normalize rows — apply customer fallback and normalize item_code
    const normalizedRows = rows.map((r, index) => {
      const normalizedItemCode = normalizeItemCode(r.item_code);
      return {
        ...r,
        customer_name: r.customer_name?.trim() || DEFAULT_CUSTOMER,
        item_code: normalizedItemCode,
        _original_item_code: r.item_code,
        _rowIndex: index + 1,
      };
    });

    // Step 2: Validate normalized item codes (check for empty after normalization)
    const invalidItemCodeErrors =
      this.validateNormalizedItemCodes(normalizedRows);
    if (invalidItemCodeErrors.length > 0) {
      errors.push(...invalidItemCodeErrors);
      return {
        totalOrders: 0,
        success,
        failed: invalidItemCodeErrors.length,
        skipped,
        itemsCreated,
        rowsProcessed,
        groupedOrders: 0,
        valid,
        invalid: invalidItemCodeErrors.length,
        errors,
      };
    }

    // Step 3: Group rows with priority
    const groups = this.groupRows(
      normalizedRows,
      groupByOrderNo,
      groupByCustomerDate,
    );
    const groupedOrders = groups.size;
    const totalOrders = groupedOrders;

    // Step 3: Validate grouping consistency (same order_no must have same customer/date)
    const groupingValidationErrors = this.validateGroupingConsistency(groups);
    if (groupingValidationErrors.length > 0) {
      errors.push(...groupingValidationErrors);
      return {
        totalOrders,
        success,
        failed,
        skipped,
        itemsCreated,
        rowsProcessed,
        groupedOrders,
        valid,
        invalid: groupingValidationErrors.length,
        errors,
      };
    }

    // Step 4: Pre-cache lookups
    const itemCodes = [
      ...new Set(normalizedRows.map((r) => r.item_code.trim().toUpperCase())),
    ];
    const uomCodes = [
      ...new Set(normalizedRows.map((r) => r.uom_code.trim().toUpperCase())),
    ];
    const warehouseCodes = [
      ...new Set(
        normalizedRows.map((r) => r.warehouse_code.trim().toUpperCase()),
      ),
    ];
    const locationCodes = [
      ...new Set(
        normalizedRows
          .filter((r) => r.location_code)
          .map((r) => r.location_code!.trim().toUpperCase()),
      ),
    ];

    const [itemMap, uomMap, warehouseMap, locationMap] = await Promise.all([
      this.buildItemMap(itemCodes, actor.tenantId),
      this.buildUomMap(uomCodes, actor.tenantId),
      this.buildWarehouseMap(warehouseCodes, actor.tenantId),
      this.buildLocationMap(locationCodes, actor.tenantId),
    ]);

    // Step 5: Auto-create missing items if enabled (skip in validateOnly mode)
    if (autoCreateItems && !validateOnly) {
      const defaultUom = uomMap.values().next().value as
        | UnitOfMeasure
        | undefined;
      if (!defaultUom) {
        errors.push({
          orderNo: 'GLOBAL',
          message: 'No UOM found — cannot auto-create items. Seed UOMs first.',
        });
        return {
          totalOrders,
          success,
          failed,
          skipped,
          itemsCreated,
          rowsProcessed,
          groupedOrders,
          valid,
          invalid: errors.length,
          errors,
        };
      }

      for (const code of itemCodes) {
        if (!itemMap.has(code)) {
          const created = await this.autoCreateItem(
            code,
            defaultUom.id,
            actor.tenantId,
          );
          itemMap.set(code, created);
          itemsCreated++;
        }
      }
    }

    // Step 6: Process each order group
    for (const [orderNo, group] of groups) {
      try {
        // Validate group
        const validationErrors = this.validateGroup(
          group,
          itemMap,
          uomMap,
          warehouseMap,
          locationMap,
        );

        if (validationErrors.length > 0) {
          failed++;
          invalid++;
          errors.push(...validationErrors);
          continue;
        }

        valid++;

        // Skip all inserts in validateOnly mode
        if (validateOnly) {
          continue;
        }

        // Skip duplicate order_no
        if (skipExisting) {
          const existing = await this.salesOrderRepository.findOne({
            where: { orderNo, tenantId: actor.tenantId },
          });
          if (existing) {
            skipped++;
            continue;
          }
        }

        // Create order in transaction
        const savedOrderId = await this.createOrder(
          group,
          itemMap,
          uomMap,
          warehouseMap,
          locationMap,
          actor,
          autoConfirm || autoComplete,
        );

        // Auto-complete workflow: confirm → ship → deliver
        if (autoComplete) {
          await this.runAutoCompleteWorkflow(savedOrderId, actor);
        }

        success++;
      } catch (err) {
        failed++;
        invalid++;
        errors.push({
          orderNo,
          message: err instanceof Error ? err.message : 'Unknown error',
        });
      }
    }

    return {
      totalOrders,
      success,
      failed,
      skipped,
      itemsCreated,
      rowsProcessed,
      groupedOrders,
      valid,
      invalid,
      errors,
    };
  }

  // Group rows with priority: order_no > customer+date > per-row
  private groupRows(
    rows: ImportSalesOrderRowDto[],
    groupByOrderNo: boolean,
    groupByCustomerDate: boolean,
  ): Map<string, GroupedOrder> {
    if (groupByOrderNo) {
      return this.groupByOrderNo(rows);
    }
    if (groupByCustomerDate) {
      return this.groupByCustomerDate(rows);
    }
    // Treat each row as separate order
    return this.groupByRow(rows);
  }

  // Validate that same order_no has consistent customer and date
  private validateGroupingConsistency(
    groups: Map<string, GroupedOrder>,
  ): ImportSalesOrderError[] {
    const errors: ImportSalesOrderError[] = [];

    for (const [orderNo, group] of groups) {
      const firstCustomer = group.customer_name;
      const firstDate = group.order_date;

      for (const row of group.rows) {
        const rowCustomer = row.customer_name?.trim() || DEFAULT_CUSTOMER;
        if (rowCustomer !== firstCustomer) {
          errors.push({
            orderNo,
            field: 'customer_name',
            message: `Inconsistent customer for order_no "${orderNo}": expected "${firstCustomer}", got "${rowCustomer}"`,
          });
        }

        if (row.order_date !== firstDate) {
          errors.push({
            orderNo,
            field: 'order_date',
            message: `Inconsistent order_date for order_no "${orderNo}": expected "${firstDate}", got "${row.order_date}"`,
          });
        }
      }
    }

    return errors;
  }

  // Validate normalized item codes - check for empty or invalid codes after normalization
  private validateNormalizedItemCodes(
    rows: (ImportSalesOrderRowDto & {
      _original_item_code: string;
      _rowIndex: number;
    })[],
  ): ImportSalesOrderError[] {
    const errors: ImportSalesOrderError[] = [];

    for (const row of rows) {
      const normalized = row.item_code;
      const original = row._original_item_code;

      // Check if empty after normalization
      if (!normalized || normalized === '') {
        errors.push({
          orderNo: row.order_no,
          row: row._rowIndex,
          field: 'item_code',
          message: 'Item code is empty after normalization',
          original,
          normalized,
        });
        continue;
      }

      // Check for invalid characters (only allow letters, numbers, hyphens, underscores)
      if (!/^[A-Z0-9_-]+$/.test(normalized)) {
        errors.push({
          orderNo: row.order_no,
          row: row._rowIndex,
          field: 'item_code',
          message: `Item code contains invalid characters after normalization: "${normalized}". Only letters, numbers, hyphens, and underscores are allowed.`,
          original,
          normalized,
        });
      }
    }

    return errors;
  }

  // Treat each row as a separate order (generates synthetic order_no)
  private groupByRow(
    rows: ImportSalesOrderRowDto[],
  ): Map<string, GroupedOrder> {
    const groups = new Map<string, GroupedOrder>();

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const key = `IMPORT-ROW-${i + 1}`;

      groups.set(key, {
        order_no: key,
        customer_name: row.customer_name.trim(),
        order_date: row.order_date,
        rows: [row],
      });
    }

    return groups;
  }

  // Group by order_no (default)
  private groupByOrderNo(
    rows: ImportSalesOrderRowDto[],
  ): Map<string, GroupedOrder> {
    const groups = new Map<string, GroupedOrder>();

    for (const row of rows) {
      const key = row.order_no.trim().toUpperCase();

      if (!groups.has(key)) {
        groups.set(key, {
          order_no: key,
          customer_name: row.customer_name.trim(),
          order_date: row.order_date,
          rows: [],
        });
      }

      groups.get(key)!.rows.push(row);
    }

    return groups;
  }

  // Group by customer_name + order_date (generates synthetic order_no)
  private groupByCustomerDate(
    rows: ImportSalesOrderRowDto[],
  ): Map<string, GroupedOrder> {
    const groups = new Map<string, GroupedOrder>();

    for (const row of rows) {
      const customerKey = row.customer_name
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '-');
      const dateKey = row.order_date.substring(0, 10);
      const key = `IMPORT-${customerKey}-${dateKey}`;

      if (!groups.has(key)) {
        groups.set(key, {
          order_no: key,
          customer_name: row.customer_name.trim(),
          order_date: row.order_date,
          rows: [],
        });
      }

      groups.get(key)!.rows.push(row);
    }

    return groups;
  }

  private validateGroup(
    group: GroupedOrder,
    itemMap: Map<string, Item>,
    uomMap: Map<string, UnitOfMeasure>,
    warehouseMap: Map<string, Warehouse>,
    locationMap: Map<string, WarehouseLocation>,
  ): ImportSalesOrderError[] {
    const errors: ImportSalesOrderError[] = [];

    for (const row of group.rows as (ImportSalesOrderRowDto & {
      _original_item_code?: string;
    })[]) {
      const itemCode = row.item_code.trim().toUpperCase();
      const uomCode = row.uom_code.trim().toUpperCase();
      const warehouseCode = row.warehouse_code.trim().toUpperCase();

      if (!itemMap.has(itemCode)) {
        const originalCode = row._original_item_code || row.item_code;
        errors.push({
          orderNo: group.order_no,
          field: 'item_code',
          message: `Item "${row.item_code}" not found. Enable autoCreateItems to auto-create.`,
          original: originalCode,
          normalized: row.item_code,
        });
      }

      if (!uomMap.has(uomCode)) {
        errors.push({
          orderNo: group.order_no,
          field: 'uom_code',
          message: `UOM code "${row.uom_code}" not found`,
        });
      }

      if (!warehouseMap.has(warehouseCode)) {
        errors.push({
          orderNo: group.order_no,
          field: 'warehouse_code',
          message: `Warehouse code "${row.warehouse_code}" not found`,
        });
      }

      if (row.location_code) {
        const locationCode = row.location_code.trim().toUpperCase();
        if (!locationMap.has(locationCode)) {
          errors.push({
            orderNo: group.order_no,
            field: 'location_code',
            message: `Location code "${row.location_code}" not found`,
          });
        }
      }

      if (!row.quantity || row.quantity <= 0) {
        errors.push({
          orderNo: group.order_no,
          field: 'quantity',
          message: `Quantity must be greater than 0`,
        });
      }
    }

    return errors;
  }

  private async createOrder(
    group: GroupedOrder,
    itemMap: Map<string, Item>,
    uomMap: Map<string, UnitOfMeasure>,
    warehouseMap: Map<string, Warehouse>,
    locationMap: Map<string, WarehouseLocation>,
    actor: { userId: number; tenantId: number },
    autoConfirm: boolean,
  ): Promise<number> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const status = autoConfirm
        ? SalesOrderStatus.CONFIRMED
        : SalesOrderStatus.DRAFT;

      const salesOrder = queryRunner.manager.create(SalesOrder, {
        tenantId: actor.tenantId,
        orderNo: group.order_no,
        customerName: group.customer_name,
        orderDate: new Date(group.order_date),
        status,
        totalAmount: 0,
        discountAmount: 0,
        taxAmount: 0,
        finalAmount: 0,
      });

      const savedOrder = await queryRunner.manager.save(salesOrder);

      let totalAmount = 0;
      const orderItems: SalesOrderItem[] = [];

      for (const row of group.rows) {
        const item = itemMap.get(row.item_code.trim().toUpperCase())!;
        const uom = uomMap.get(row.uom_code.trim().toUpperCase())!;
        const warehouse = warehouseMap.get(
          row.warehouse_code.trim().toUpperCase(),
        )!;

        let location: WarehouseLocation | undefined;
        if (row.location_code) {
          location = locationMap.get(row.location_code.trim().toUpperCase());
        }

        if (!location) {
          const fallback = await this.locationRepository.findOne({
            where: { warehouseId: warehouse.id },
          });
          if (!fallback) {
            throw new BadRequestException(
              `No location found for warehouse "${row.warehouse_code}"`,
            );
          }
          location = fallback;
        }

        const unitPrice = row.unit_price ?? 0;
        const lineTotal = row.quantity * unitPrice;

        const orderItem = queryRunner.manager.create(SalesOrderItem, {
          salesOrderId: savedOrder.id,
          itemId: item.id,
          itemCode: item.code,
          itemName: item.name,
          quantity: row.quantity,
          unitOfMeasureId: uom.id,
          unitOfMeasureCode: uom.code,
          unitPrice,
          discountPercent: 0,
          discountAmount: 0,
          taxPercent: 0,
          taxAmount: 0,
          lineTotal,
          warehouseId: warehouse.id,
          warehouseName: warehouse.name,
          locationId: location.id,
          locationName: location.name,
        });

        orderItems.push(orderItem);
        totalAmount += lineTotal;
      }

      await queryRunner.manager.save(orderItems);

      savedOrder.totalAmount = totalAmount;
      savedOrder.finalAmount = totalAmount;
      await queryRunner.manager.save(savedOrder);

      await queryRunner.commitTransaction();

      return savedOrder.id;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  // Runs confirm → ship → deliver on an already-created order
  private async runAutoCompleteWorkflow(
    orderId: number,
    actor: { userId: number; tenantId: number },
  ): Promise<void> {
    const order = await this.salesOrderRepository.findOne({
      where: { id: orderId },
      relations: ['items'],
    });

    if (!order) return;

    // Confirm
    if (order.status === SalesOrderStatus.DRAFT) {
      order.status = SalesOrderStatus.CONFIRMED;
      order.approvedBy = actor.userId;
      order.approvedAt = new Date();
      await this.salesOrderRepository.save(order);
    }

    // Ship
    if (order.status === SalesOrderStatus.CONFIRMED) {
      order.status = SalesOrderStatus.SHIPPED;
      order.shippedBy = actor.userId;
      order.shippedAt = new Date();
      await this.salesOrderRepository.save(order);
    }

    // Deliver — mark all items as fully delivered
    if (order.status === SalesOrderStatus.SHIPPED) {
      for (const item of order.items ?? []) {
        item.deliveredQuantity = item.quantity;
        await this.salesOrderItemRepository.save(item);
      }

      order.status = SalesOrderStatus.DELIVERED;
      order.deliveredBy = actor.userId;
      order.deliveredAt = new Date();
      await this.salesOrderRepository.save(order);
    }
  }

  private async autoCreateItem(
    code: string,
    baseUomId: number,
    tenantId: number,
  ): Promise<Item> {
    const item = this.itemRepository.create({
      tenantId,
      code,
      name: code,
      baseUomId,
      isActive: true,
    });

    return await this.itemRepository.save(item);
  }

  private async buildItemMap(
    codes: string[],
    tenantId: number,
  ): Promise<Map<string, Item>> {
    if (codes.length === 0) return new Map();
    const items = await this.itemRepository
      .createQueryBuilder('i')
      .where('UPPER(i.code) IN (:...codes)', { codes })
      .andWhere('i.tenantId = :tenantId', { tenantId })
      .andWhere('i.deletedAt IS NULL')
      .getMany();

    return new Map(items.map((i) => [i.code.toUpperCase(), i]));
  }

  private async buildUomMap(
    codes: string[],
    tenantId: number,
  ): Promise<Map<string, UnitOfMeasure>> {
    if (codes.length === 0) return new Map();
    const uoms = await this.uomRepository
      .createQueryBuilder('u')
      .where('UPPER(u.code) IN (:...codes)', { codes })
      .andWhere('u.tenantId = :tenantId', { tenantId })
      .andWhere('u.deletedAt IS NULL')
      .getMany();

    return new Map(uoms.map((u) => [u.code.toUpperCase(), u]));
  }

  private async buildWarehouseMap(
    codes: string[],
    tenantId: number,
  ): Promise<Map<string, Warehouse>> {
    if (codes.length === 0) return new Map();
    const warehouses = await this.warehouseRepository
      .createQueryBuilder('w')
      .where('UPPER(w.code) IN (:...codes)', { codes })
      .andWhere('w.tenantId = :tenantId', { tenantId })
      .andWhere('w.deletedAt IS NULL')
      .getMany();

    return new Map(warehouses.map((w) => [w.code.toUpperCase(), w]));
  }

  private async buildLocationMap(
    codes: string[],
    tenantId: number,
  ): Promise<Map<string, WarehouseLocation>> {
    if (codes.length === 0) return new Map();
    const locations = await this.locationRepository
      .createQueryBuilder('l')
      .where('UPPER(l.code) IN (:...codes)', { codes })
      .andWhere('l.tenantId = :tenantId', { tenantId })
      .andWhere('l.deletedAt IS NULL')
      .getMany();

    return new Map(locations.map((l) => [l.code.toUpperCase(), l]));
  }
}
