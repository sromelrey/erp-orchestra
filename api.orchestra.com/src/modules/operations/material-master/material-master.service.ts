import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, Not, IsNull, FindOperator } from 'typeorm';
import { Material } from '@/entities/inventory/material.entity';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';
import { QueryMaterialDto } from './dto/query-material.dto';
import { MaterialType } from '@/types/enums';

// Define proper types for TypeORM where conditions
type FindManyWhereCondition = {
  tenantId: number;
  deletedAt?: FindOperator<Date>;
  sku?: FindOperator<string>;
  name?: FindOperator<string>;
  materialType?: MaterialType;
  materialGroup?: string;
  isActive?: boolean;
};

type FindOneWhereCondition = {
  id?: number | FindOperator<number>;
  sku?: string;
  tenantId: number;
  deletedAt?: FindOperator<Date>;
};

// Define ActorContext locally based on common usage in the codebase
interface ActorContext {
  tenantId: number;
  userId: number;
}

/**
 * Service responsible for managing material master data.
 * Handles CRUD operations for materials with tenant isolation.
 */
@Injectable()
export class MaterialMasterService {
  constructor(
    @InjectRepository(Material)
    private readonly materialRepository: Repository<Material>,
  ) {}

  /**
   * Creates a new material record.
   *
   * @param createMaterialDto - The material data
   * @param actor - The actor context containing tenant and user info
   * @returns The created Material entity
   * @throws {ConflictException} If SKU already exists for the tenant
   */
  async create(
    createMaterialDto: CreateMaterialDto,
    actor: ActorContext,
  ): Promise<Material> {
    // Check if SKU already exists for this tenant
    const existingMaterial = await this.materialRepository.findOne({
      where: {
        sku: createMaterialDto.sku,
        tenantId: actor.tenantId,
        deletedAt: IsNull(),
      } as FindOneWhereCondition,
    });

    if (existingMaterial) {
      throw new ConflictException(
        `Material with SKU "${createMaterialDto.sku}" already exists`,
      );
    }

    const material = this.materialRepository.create({
      ...createMaterialDto,
      tenantId: actor.tenantId,
      createdBy: actor.userId,
      updatedBy: actor.userId,
    });

    return this.materialRepository.save(material);
  }

  /**
   * Retrieves all materials for a tenant with optional filtering.
   *
   * @param query - Query parameters for filtering and pagination
   * @param actor - The actor context
   * @returns Paginated list of materials
   */
  async findAll(query: QueryMaterialDto, actor: ActorContext) {
    const {
      page = 1,
      limit = 20,
      search,
      materialType,
      materialGroup,
      isActive,
    } = query;

    const skip = (page - 1) * limit;

    const where: FindManyWhereCondition = {
      tenantId: actor.tenantId,
      deletedAt: IsNull(),
    };

    if (search) {
      where.sku = Like(`%${search}%`);
      where.name = Like(`%${search}%`);
    }

    if (materialType) {
      where.materialType = materialType;
    }

    if (materialGroup) {
      where.materialGroup = materialGroup;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [materials, total] = await this.materialRepository.findAndCount({
      where,
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      data: materials,
      total,
      page,
      limit,
    };
  }

  /**
   * Retrieves a specific material by ID.
   *
   * @param id - Material ID
   * @param actor - The actor context
   * @returns The Material entity
   * @throws {NotFoundException} If material not found
   */
  async findOne(id: number, actor: ActorContext): Promise<Material> {
    const material = await this.materialRepository.findOne({
      where: {
        id,
        tenantId: actor.tenantId,
        deletedAt: IsNull(),
      } as FindOneWhereCondition,
    });

    if (!material) {
      throw new NotFoundException(`Material with ID ${id} not found`);
    }

    return material;
  }

  /**
   * Updates a material record.
   *
   * @param id - Material ID
   * @param updateMaterialDto - The update data
   * @param actor - The actor context
   * @returns The updated Material entity
   * @throws {NotFoundException} If material not found
   * @throws {ConflictException} If new SKU already exists
   */
  async update(
    id: number,
    updateMaterialDto: UpdateMaterialDto,
    actor: ActorContext,
  ): Promise<Material> {
    const material = await this.findOne(id, actor);

    // If updating SKU, check for conflicts
    if (updateMaterialDto.sku && updateMaterialDto.sku !== material.sku) {
      const existingMaterial = await this.materialRepository.findOne({
        where: {
          sku: updateMaterialDto.sku,
          tenantId: actor.tenantId,
          id: Not(id),
          deletedAt: IsNull(),
        } as FindOneWhereCondition,
      });

      if (existingMaterial) {
        throw new ConflictException(
          `Material with SKU "${updateMaterialDto.sku}" already exists`,
        );
      }
    }

    Object.assign(material, updateMaterialDto, {
      updatedBy: actor.userId,
    });

    return this.materialRepository.save(material);
  }

  /**
   * Soft-deletes a material.
   *
   * @param id - Material ID
   * @param actor - The actor context
   * @returns Promise that resolves when deletion is complete
   * @throws {NotFoundException} If material not found
   * @throws {BadRequestException} If material is referenced in BOMs
   */
  async remove(id: number, actor: ActorContext): Promise<void> {
    // Check if material exists
    await this.findOne(id, actor);

    // Check if material is referenced in any BOMs
    const bomCount = await this.materialRepository
      .createQueryBuilder('material')
      .leftJoin('material.boms', 'bom')
      .leftJoin('material.bomItems', 'bomItem')
      .where('material.id = :id', { id })
      .andWhere('(bom.id IS NOT NULL OR bomItem.id IS NOT NULL)')
      .getCount();

    if (bomCount > 0) {
      throw new BadRequestException(
        'Cannot delete material: it is referenced in one or more BOMs',
      );
    }

    await this.materialRepository.softDelete(id);
  }
}
