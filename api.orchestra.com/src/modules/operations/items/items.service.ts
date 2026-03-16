import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemCategory } from '@/entities/operations/item-category.entity';
import { UnitOfMeasure } from '@/entities/operations/unit-of-measure.entity';
import { Item } from '@/entities/operations/item.entity';
import { ItemUnit } from '@/entities/operations/item-unit.entity';
import { CreateItemCategoryDto } from './dto/create-item-category.dto';
import { CreateUnitOfMeasureDto } from './dto/create-unit-of-measure.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { UpdateItemCategoryDto } from './dto/update-item-category.dto';
import { UpdateUnitOfMeasureDto } from './dto/update-unit-of-measure.dto';

interface ActorContext {
  tenantId: number;
  userId: number;
}

@Injectable()
export class ItemsService {
  constructor(
    @InjectRepository(ItemCategory)
    private readonly categoryRepo: Repository<ItemCategory>,
    @InjectRepository(UnitOfMeasure)
    private readonly uomRepo: Repository<UnitOfMeasure>,
    @InjectRepository(Item)
    private readonly itemRepo: Repository<Item>,
    @InjectRepository(ItemUnit)
    private readonly itemUnitRepo: Repository<ItemUnit>,
  ) {}

  // Categories
  async createCategory(dto: CreateItemCategoryDto, actor: ActorContext) {
    const exists = await this.categoryRepo.findOne({
      where: { tenantId: actor.tenantId, code: dto.code },
    });
    if (exists) {
      throw new BadRequestException('Category code already exists');
    }
    const entity = this.categoryRepo.create({
      ...dto,
      tenantId: actor.tenantId,
      createdBy: actor.userId,
    });
    return this.categoryRepo.save(entity);
  }

  findCategories(tenantId: number) {
    return this.categoryRepo.find({ where: { tenantId } });
  }

  async updateCategory(
    id: number,
    dto: UpdateItemCategoryDto,
    tenantId: number,
    userId: number,
  ) {
    const category = await this.categoryRepo.findOne({
      where: { id, tenantId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    Object.assign(category, dto, { updatedBy: userId });
    return this.categoryRepo.save(category);
  }

  // UOM
  async createUom(dto: CreateUnitOfMeasureDto, actor: ActorContext) {
    const exists = await this.uomRepo.findOne({
      where: { tenantId: actor.tenantId, code: dto.code },
    });
    if (exists) {
      throw new BadRequestException('UOM code already exists');
    }
    const entity = this.uomRepo.create({
      ...dto,
      tenantId: actor.tenantId,
      createdBy: actor.userId,
    });
    return this.uomRepo.save(entity);
  }

  findUoms(tenantId: number) {
    return this.uomRepo.find({ where: { tenantId } });
  }

  async updateUom(
    id: number,
    dto: UpdateUnitOfMeasureDto,
    tenantId: number,
    userId: number,
  ) {
    const uom = await this.uomRepo.findOne({
      where: { id, tenantId },
    });
    if (!uom) {
      throw new NotFoundException('UOM not found');
    }
    Object.assign(uom, dto, { updatedBy: userId });
    return this.uomRepo.save(uom);
  }

  // Items
  async createItem(dto: CreateItemDto, actor: ActorContext) {
    const exists = await this.itemRepo.findOne({
      where: { tenantId: actor.tenantId, code: dto.code },
    });
    if (exists) {
      throw new BadRequestException('Item code already exists');
    }

    const baseUom = await this.uomRepo.findOne({
      where: { id: dto.baseUomId, tenantId: actor.tenantId },
    });
    if (!baseUom) {
      throw new BadRequestException('Base UOM not found for tenant');
    }

    let categoryId: number | undefined;
    if (dto.categoryId) {
      const category = await this.categoryRepo.findOne({
        where: { id: dto.categoryId, tenantId: actor.tenantId },
      });
      if (!category) {
        throw new BadRequestException('Category not found for tenant');
      }
      categoryId = category.id;
    }

    const entity = this.itemRepo.create({
      tenantId: actor.tenantId,
      code: dto.code,
      name: dto.name,
      description: dto.description,
      categoryId,
      baseUomId: dto.baseUomId,
      isActive: dto.isActive ?? true,
      createdBy: actor.userId,
    });

    const saved = await this.itemRepo.save(entity);

    // Create item-unit row for base UOM
    const baseItemUnit = this.itemUnitRepo.create({
      tenantId: actor.tenantId,
      itemId: saved.id,
      uomId: dto.baseUomId,
      conversionFactor: '1',
      createdBy: actor.userId,
    });
    await this.itemUnitRepo.save(baseItemUnit);

    return saved;
  }

  findItems(tenantId: number) {
    return this.itemRepo.find({
      where: { tenantId },
      relations: ['category', 'baseUom'],
    });
  }

  async updateItem(id: number, dto: UpdateItemDto, actor: ActorContext) {
    const item = await this.itemRepo.findOne({
      where: { id, tenantId: actor.tenantId },
    });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (dto.baseUomId) {
      const uom = await this.uomRepo.findOne({
        where: { id: dto.baseUomId, tenantId: actor.tenantId },
      });
      if (!uom) {
        throw new BadRequestException('Base UOM not found for tenant');
      }
      item.baseUomId = dto.baseUomId;
    }

    if (dto.categoryId !== undefined) {
      if (dto.categoryId === null) {
        item.categoryId = null;
      } else {
        const category = await this.categoryRepo.findOne({
          where: { id: dto.categoryId, tenantId: actor.tenantId },
        });
        if (!category) {
          throw new BadRequestException('Category not found for tenant');
        }
        item.categoryId = category.id;
      }
    }

    Object.assign(item, {
      name: dto.name ?? item.name,
      description: dto.description ?? item.description,
      isActive: dto.isActive ?? item.isActive,
      updatedBy: actor.userId,
    });

    return this.itemRepo.save(item);
  }
}
