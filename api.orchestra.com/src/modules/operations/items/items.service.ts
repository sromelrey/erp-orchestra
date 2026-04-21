import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Item, ItemCategory, ItemUnit, UnitOfMeasure } from '@/entities';
import { CreateItemCategoryDto } from './dto/create-item-category.dto';
import { UpdateItemCategoryDto } from './dto/update-item-category.dto';
import { CreateUnitOfMeasureDto } from './dto/create-unit-of-measure.dto';
import { UpdateUnitOfMeasureDto } from './dto/update-unit-of-measure.dto';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { CursorPaginationDto } from '@/common/dto/cursor-pagination.dto';
import { PaginatedResult } from '@/types';

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
    const existing = await this.categoryRepo.findOne({
      where: { tenantId: actor.tenantId, code: dto.code },
    });
    if (existing) {
      throw new BadRequestException('Category code already exists');
    }
    const category = this.categoryRepo.create({
      tenantId: actor.tenantId,
      code: dto.code,
      name: dto.name,
      description: dto.description,
      createdBy: actor.userId,
    });
    return this.categoryRepo.save(category);
  }

  findCategories(tenantId: number) {
    return this.categoryRepo.find({ where: { tenantId } });
  }

  async updateCategory(
    id: number,
    dto: UpdateItemCategoryDto,
    actor: ActorContext,
  ) {
    const category = await this.categoryRepo.findOne({
      where: { id, tenantId: actor.tenantId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    Object.assign(category, dto, { updatedBy: actor.userId });
    return this.categoryRepo.save(category);
  }

  // UOMs
  async createUom(dto: CreateUnitOfMeasureDto, actor: ActorContext) {
    const existing = await this.uomRepo.findOne({
      where: { tenantId: actor.tenantId, code: dto.code },
    });
    if (existing) {
      throw new BadRequestException('UOM code already exists');
    }
    const uom = this.uomRepo.create({
      tenantId: actor.tenantId,
      code: dto.code,
      name: dto.name,
      precision: dto.precision ?? 2,
      createdBy: actor.userId,
    });
    return this.uomRepo.save(uom);
  }

  findUoms(tenantId: number) {
    return this.uomRepo.find({ where: { tenantId } });
  }

  async updateUom(
    id: number,
    dto: UpdateUnitOfMeasureDto,
    actor: ActorContext,
  ) {
    const uom = await this.uomRepo.findOne({
      where: { id, tenantId: actor.tenantId },
    });
    if (!uom) {
      throw new NotFoundException('UOM not found');
    }
    Object.assign(uom, dto, { updatedBy: actor.userId });
    return this.uomRepo.save(uom);
  }

  // Items
  async createItem(dto: CreateItemDto, actor: ActorContext) {
    const existing = await this.itemRepo.findOne({
      where: { tenantId: actor.tenantId, code: dto.code },
    });
    if (existing) {
      throw new BadRequestException('Item code already exists');
    }

    await this.ensureUomExists(dto.baseUomId, actor.tenantId);
    const categoryId = await this.resolveCategoryId(
      dto.categoryId,
      actor.tenantId,
    );

    const item = this.itemRepo.create({
      tenantId: actor.tenantId,
      code: dto.code,
      name: dto.name,
      description: dto.description,
      categoryId,
      baseUomId: dto.baseUomId,
      isActive: dto.isActive ?? true,
      createdBy: actor.userId,
    });
    const saved = await this.itemRepo.save(item);

    const baseUnit = this.itemUnitRepo.create({
      tenantId: actor.tenantId,
      itemId: saved.id,
      uomId: dto.baseUomId,
      conversionFactor: '1',
      createdBy: actor.userId,
    });
    await this.itemUnitRepo.save(baseUnit);

    return saved;
  }

  async findItems(
    tenantId: number,
    paginationDto: CursorPaginationDto,
    filters?: {
      search?: string;
      isActive?: boolean;
      categoryId?: number;
    },
  ): Promise<PaginatedResult<Item>> {
    const { cursor, limit = 10 } = paginationDto;
    const { search, isActive, categoryId } = filters || {};

    const queryBuilder = this.itemRepo.createQueryBuilder('item');

    queryBuilder
      .where('item.tenantId = :tenantId', { tenantId })
      .leftJoinAndSelect('item.category', 'category')
      .leftJoinAndSelect('item.baseUom', 'baseUom');

    if (cursor) {
      queryBuilder.andWhere('item.id > :cursor', { cursor });
    }

    if (isActive !== undefined) {
      queryBuilder.andWhere('item.isActive = :isActive', { isActive });
    }

    if (search) {
      queryBuilder.andWhere('item.code LIKE :search', {
        search: `%${search}%`,
      });
    }

    if (categoryId !== undefined) {
      queryBuilder.andWhere('item.categoryId = :categoryId', {
        categoryId,
      });
    }

    queryBuilder.orderBy('item.id', 'ASC').take(limit + 1);

    const items = await queryBuilder.getMany();
    let nextCursor: string | number | null = null;

    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem ? nextItem.id : null;
    }

    return {
      data: items,
      meta: {
        nextCursor,
      },
    };
  }

  async updateItem(id: number, dto: UpdateItemDto, actor: ActorContext) {
    const item = await this.itemRepo.findOne({
      where: { id, tenantId: actor.tenantId },
    });
    if (!item) {
      throw new NotFoundException('Item not found');
    }

    if (dto.baseUomId) {
      await this.ensureUomExists(dto.baseUomId, actor.tenantId);
      item.baseUomId = dto.baseUomId;
    }

    if (dto.categoryId !== undefined) {
      item.categoryId = await this.resolveCategoryId(
        dto.categoryId,
        actor.tenantId,
      );
    }

    Object.assign(item, dto, { updatedBy: actor.userId });
    return this.itemRepo.save(item);
  }

  private async ensureUomExists(id: number, tenantId: number) {
    const uom = await this.uomRepo.findOne({
      where: { id, tenantId },
    });
    if (!uom) {
      throw new BadRequestException('UOM not found for tenant');
    }
  }

  private async resolveCategoryId(
    categoryId: number | undefined | null,
    tenantId: number,
  ): Promise<number | null | undefined> {
    if (categoryId === undefined) {
      return undefined;
    }
    if (categoryId === null) {
      return null;
    }
    const category = await this.categoryRepo.findOne({
      where: { id: categoryId, tenantId },
    });
    if (!category) {
      throw new BadRequestException('Category not found for tenant');
    }
    return category.id;
  }
}
