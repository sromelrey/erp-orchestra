import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from '@/entities/hris/department.entity';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { PaginatedResult } from '@/types';
import { CursorPaginationDto } from '@/common/dto/cursor-pagination.dto';

/**
 * Service responsible for managing department operations.
 * Handles creation, updates, retrieval, and soft-deletion of Department entities,
 * always scoped to the authenticated user's tenant.
 */
@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  /**
   * Retrieves all departments for a given tenant using cursor-based pagination.
   *
   * @param tenantId - The tenant ID to scope the query
   * @param paginationDto - Cursor pagination parameters
   * @returns Paginated list of Department entities
   */
  async findAll(
    tenantId: number,
    paginationDto: CursorPaginationDto,
  ): Promise<PaginatedResult<Department>> {
    const { cursor, limit = 10 } = paginationDto;
    const queryBuilder =
      this.departmentRepository.createQueryBuilder('department');

    queryBuilder.where('department.tenantId = :tenantId', { tenantId });

    if (cursor) {
      queryBuilder.andWhere('department.id > :cursor', { cursor });
    }

    queryBuilder.orderBy('department.id', 'ASC').take(limit + 1);

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
   * Retrieves a single department by ID, scoped to tenant.
   *
   * @param id - Department ID
   * @param tenantId - The tenant ID for scoping
   * @returns The Department entity
   * @throws {NotFoundException} If the department does not exist for this tenant
   */
  async findOne(id: number, tenantId: number): Promise<Department> {
    const department = await this.departmentRepository.findOne({
      where: { id, tenantId },
    });

    if (!department) {
      throw new NotFoundException(`Department with ID ${id} not found`);
    }

    return department;
  }

  /**
   * Creates a new department for a tenant.
   *
   * @param dto - Department creation data
   * @param tenantId - The tenant ID to associate with the department
   * @returns The created Department entity
   */
  async create(
    dto: CreateDepartmentDto,
    tenantId: number,
  ): Promise<Department> {
    const department = this.departmentRepository.create({
      ...dto,
      tenantId,
    });

    return this.departmentRepository.save(department);
  }

  /**
   * Updates an existing department, scoped to tenant.
   *
   * @param id - Department ID
   * @param dto - Partial department data to update
   * @param tenantId - The tenant ID for scoping
   * @returns The updated Department entity
   * @throws {NotFoundException} If the department does not exist for this tenant
   */
  async update(
    id: number,
    dto: UpdateDepartmentDto,
    tenantId: number,
  ): Promise<Department> {
    const department = await this.findOne(id, tenantId);
    Object.assign(department, dto);
    return this.departmentRepository.save(department);
  }

  /**
   * Soft-deletes a department, scoped to tenant.
   *
   * @param id - Department ID
   * @param tenantId - The tenant ID for scoping
   * @throws {NotFoundException} If the department does not exist for this tenant
   */
  async remove(id: number, tenantId: number): Promise<void> {
    const department = await this.findOne(id, tenantId);
    await this.departmentRepository.softRemove(department);
  }
}
