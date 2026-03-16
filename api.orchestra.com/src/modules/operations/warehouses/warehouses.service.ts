import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import {
  Item,
  StockBalance,
  StockLedger,
  UnitOfMeasure,
  Warehouse,
  WarehouseLocation,
} from '@/entities';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { CreateWarehouseLocationDto } from './dto/create-location.dto';
import { UpdateWarehouseLocationDto } from './dto/update-location.dto';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { StockMovementType } from '@/types/enums';

interface ActorContext {
  tenantId: number;
  userId: number;
}

@Injectable()
export class WarehousesService {
  constructor(
    @InjectRepository(Warehouse)
    private readonly warehouseRepo: Repository<Warehouse>,
    @InjectRepository(WarehouseLocation)
    private readonly locationRepo: Repository<WarehouseLocation>,
    @InjectRepository(StockLedger)
    private readonly ledgerRepo: Repository<StockLedger>,
    @InjectRepository(StockBalance)
    private readonly balanceRepo: Repository<StockBalance>,
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
    @InjectRepository(UnitOfMeasure)
    private readonly uomRepo: Repository<UnitOfMeasure>,
  ) {}

  // Warehouses
  async createWarehouse(dto: CreateWarehouseDto, actor: ActorContext) {
    const existing = await this.warehouseRepo.findOne({
      where: { tenantId: actor.tenantId, code: dto.code },
    });
    if (existing) {
      throw new BadRequestException('Warehouse code already exists');
    }

    const entity = this.warehouseRepo.create({
      tenantId: actor.tenantId,
      code: dto.code,
      name: dto.name,
      description: dto.description,
      isDefault: dto.isDefault ?? false,
      isActive: dto.isActive ?? true,
      createdBy: actor.userId,
    });

    return this.warehouseRepo.save(entity);
  }

  findWarehouses(tenantId: number) {
    return this.warehouseRepo.find({
      where: { tenantId },
      order: { name: 'ASC' },
    });
  }

  async updateWarehouse(
    id: number,
    dto: UpdateWarehouseDto,
    actor: ActorContext,
  ) {
    const warehouse = await this.warehouseRepo.findOne({
      where: { id, tenantId: actor.tenantId },
    });
    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }
    Object.assign(warehouse, dto, { updatedBy: actor.userId });
    return this.warehouseRepo.save(warehouse);
  }

  // Locations
  async createLocation(
    warehouseId: number,
    dto: CreateWarehouseLocationDto,
    actor: ActorContext,
  ) {
    const warehouse = await this.getWarehouseOrThrow(
      warehouseId,
      actor.tenantId,
    );

    const exists = await this.locationRepo.findOne({
      where: { warehouseId: warehouse.id, code: dto.code },
    });
    if (exists) {
      throw new BadRequestException(
        'Location code already exists for warehouse',
      );
    }

    let parent: WarehouseLocation | null = null;
    if (dto.parentId) {
      parent = await this.locationRepo.findOne({
        where: {
          id: dto.parentId,
          tenantId: actor.tenantId,
          warehouseId: warehouse.id,
        },
      });
      if (!parent) {
        throw new BadRequestException('Parent location not found in warehouse');
      }
    }

    const path = parent ? `${parent.path}/${dto.code}` : dto.code;
    const depth = parent ? parent.depth + 1 : 0;

    const entity = this.locationRepo.create({
      tenantId: actor.tenantId,
      warehouseId: warehouse.id,
      parentId: parent?.id ?? null,
      code: dto.code,
      name: dto.name,
      path,
      depth,
      isActive: dto.isActive ?? true,
      createdBy: actor.userId,
    });

    return this.locationRepo.save(entity);
  }

  async listLocations(warehouseId: number, tenantId: number) {
    const warehouse = await this.getWarehouseOrThrow(warehouseId, tenantId);
    return this.locationRepo.find({
      where: { warehouseId: warehouse.id, tenantId },
      order: { path: 'ASC' },
    });
  }

  async updateLocation(
    warehouseId: number,
    locationId: number,
    dto: UpdateWarehouseLocationDto,
    actor: ActorContext,
  ) {
    await this.getWarehouseOrThrow(warehouseId, actor.tenantId);
    const location = await this.locationRepo.findOne({
      where: {
        id: locationId,
        tenantId: actor.tenantId,
        warehouseId,
      },
    });
    if (!location) {
      throw new NotFoundException('Location not found');
    }

    if (dto.parentId) {
      const newParent = await this.locationRepo.findOne({
        where: {
          id: dto.parentId,
          tenantId: actor.tenantId,
          warehouseId,
        },
      });
      if (!newParent) {
        throw new BadRequestException('Parent location not found');
      }
      location.parentId = newParent.id;
      location.path = `${newParent.path}/${location.code}`;
      location.depth = newParent.depth + 1;
    } else if (dto.parentId === null) {
      location.parentId = null;
      location.path = location.code;
      location.depth = 0;
    }

    Object.assign(location, dto, { updatedBy: actor.userId });
    return this.locationRepo.save(location);
  }

  // Stock movements
  async recordMovement(dto: CreateStockMovementDto, actor: ActorContext) {
    const warehouse = await this.getWarehouseOrThrow(
      dto.warehouseId,
      actor.tenantId,
    );
    let location: WarehouseLocation | null = null;
    if (dto.locationId) {
      location = await this.locationRepo.findOne({
        where: {
          id: dto.locationId,
          tenantId: actor.tenantId,
          warehouseId: warehouse.id,
        },
      });
      if (!location) {
        throw new BadRequestException('Location not found in warehouse');
      }
    }

    const item = await this.itemRepo.findOne({
      where: { id: dto.itemId, tenantId: actor.tenantId },
    });
    if (!item) {
      throw new BadRequestException('Item not found for tenant');
    }

    const uom = await this.uomRepo.findOne({
      where: { id: dto.uomId, tenantId: actor.tenantId },
    });
    if (!uom) {
      throw new BadRequestException('UOM not found for tenant');
    }

    const signedQuantity = this.getSignedQuantity(
      dto.movementType,
      dto.quantity,
    );

    const ledgerEntry = this.ledgerRepo.create({
      tenantId: actor.tenantId,
      warehouseId: warehouse.id,
      locationId: location?.id ?? null,
      itemId: item.id,
      uomId: uom.id,
      quantity: signedQuantity.toString(),
      movementType: dto.movementType,
      referenceType: dto.referenceType,
      referenceCode: dto.referenceCode,
      memo: dto.memo,
      documentDate: dto.documentDate ? new Date(dto.documentDate) : new Date(),
      createdBy: actor.userId,
    });
    const savedLedger = await this.ledgerRepo.save(ledgerEntry);

    await this.updateStockBalance(
      actor,
      warehouse,
      location,
      item,
      uom,
      signedQuantity,
    );

    return savedLedger;
  }

  findLedgerEntries(tenantId: number) {
    return this.ledgerRepo.find({
      where: { tenantId },
      order: { documentDate: 'DESC', id: 'DESC' },
      take: 200,
    });
  }

  private async updateStockBalance(
    actor: ActorContext,
    warehouse: Warehouse,
    location: WarehouseLocation | null,
    item: Item,
    uom: UnitOfMeasure,
    delta: number,
  ) {
    let balance = await this.balanceRepo.findOne({
      where: {
        tenantId: actor.tenantId,
        warehouseId: warehouse.id,
        locationId: location ? location.id : IsNull(),
        itemId: item.id,
        uomId: uom.id,
      },
    });

    const currentQty = balance ? parseFloat(balance.onHandQty || '0') : 0;
    const nextQty = currentQty + delta;

    if (!balance) {
      balance = this.balanceRepo.create({
        tenantId: actor.tenantId,
        warehouseId: warehouse.id,
        locationId: location?.id ?? null,
        itemId: item.id,
        uomId: uom.id,
        onHandQty: nextQty.toString(),
        createdBy: actor.userId,
      });
    } else {
      balance.onHandQty = nextQty.toString();
      balance.updatedBy = actor.userId;
    }

    await this.balanceRepo.save(balance);
  }

  private getSignedQuantity(type: StockMovementType, quantity: number): number {
    const abs = Math.abs(quantity);
    switch (type) {
      case StockMovementType.RECEIPT:
      case StockMovementType.TRANSFER_IN:
        return abs;
      case StockMovementType.ISSUE:
      case StockMovementType.TRANSFER_OUT:
        return -abs;
      case StockMovementType.ADJUSTMENT:
      default:
        return quantity;
    }
  }

  private async getWarehouseOrThrow(id: number, tenantId: number) {
    const warehouse = await this.warehouseRepo.findOne({
      where: { id, tenantId },
    });
    if (!warehouse) {
      throw new NotFoundException('Warehouse not found');
    }
    return warehouse;
  }
}
