import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Designation } from '@/entities/hris/designation.entity';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { PaginatedResult } from '@/types';
import { CursorPaginationDto } from '@/common/dto/cursor-pagination.dto';

/**
 * Service responsible for managing designation operations.
 * Handles creation, updates, retrieval, and soft-deletion of Designation entities,
 * always scoped to the authenticated user's tenant.
 */
@Injectable()
export class DesignationService {
  constructor(
    @InjectRepository(Designation)
    private readonly designationRepository: Repository<Designation>,
  ) {}

  /**
   * Retrieves all designations for a given tenant using cursor-based pagination.
   *
   * @param tenantId - The tenant ID to scope the query
   * @param paginationDto - Cursor pagination parameters
   * @returns Paginated list of Designation entities
   */
  async findAll(
    tenantId: number,
    paginationDto: CursorPaginationDto,
  ): Promise<PaginatedResult<Designation>> {
    const { cursor, limit = 10 } = paginationDto;
    const queryBuilder =
      this.designationRepository.createQueryBuilder('designation');

    queryBuilder.where('designation.tenantId = :tenantId', { tenantId });

    if (cursor) {
      queryBuilder.andWhere('designation.id > :cursor', { cursor });
    }

    queryBuilder.orderBy('designation.id', 'ASC').take(limit + 1);

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

  /**
   * Retrieves a single designation by ID, scoped to tenant.
   *
   * @param id - Designation ID
   * @param tenantId - The tenant ID for scoping
   * @returns The Designation entity
   * @throws {NotFoundException} If the designation does not exist for this tenant
   */
  async findOne(id: number, tenantId: number): Promise<Designation> {
    const designation = await this.designationRepository.findOne({
      where: { id, tenantId },
    });

    if (!designation) {
      throw new NotFoundException(`Designation with ID ${id} not found`);
    }

    return designation;
  }

  /**
   * Creates a new designation for a tenant.
   *
   * @param dto - Designation creation data
   * @param tenantId - The tenant ID to associate with the designation
   * @returns The created Designation entity
   */
  async create(
    dto: CreateDesignationDto,
    tenantId: number,
  ): Promise<Designation> {
    const designation = this.designationRepository.create({
      ...dto,
      tenantId,
    });

    return this.designationRepository.save(designation);
  }

  /**
   * Updates an existing designation, scoped to tenant.
   *
   * @param id - Designation ID
   * @param dto - Partial designation data to update
   * @param tenantId - The tenant ID for scoping
   * @returns The updated Designation entity
   * @throws {NotFoundException} If the designation does not exist for this tenant
   */
  async update(
    id: number,
    dto: UpdateDesignationDto,
    tenantId: number,
  ): Promise<Designation> {
    const designation = await this.findOne(id, tenantId);
    Object.assign(designation, dto);
    return this.designationRepository.save(designation);
  }

  /**
   * Soft-deletes a designation, scoped to tenant.
   *
   * @param id - Designation ID
   * @param tenantId - The tenant ID for scoping
   * @throws {NotFoundException} If the designation does not exist for this tenant
   */
  async remove(id: number, tenantId: number): Promise<void> {
    const designation = await this.findOne(id, tenantId);
    await this.designationRepository.softRemove(designation);
  }
}
