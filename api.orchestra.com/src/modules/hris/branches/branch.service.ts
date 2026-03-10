import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '@/entities';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { PaginatedResult } from '@/types';
import { CursorPaginationDto } from '@/common/dto/cursor-pagination.dto';

/**
 * Service responsible for managing branch operations.
 * Handles creation, updates, retrieval, and soft-deletion of Branch entities,
 * always scoped to the authenticated user's tenant.
 */
@Injectable()
export class BranchService {
  constructor(
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  /**
   * Retrieves all branches for a given tenant using cursor-based pagination.
   *
   * @param tenantId - The tenant ID to scope the query
   * @param paginationDto - Cursor pagination parameters
   * @returns Paginated list of Branch entities
   */
  async findAll(
    tenantId: number,
    paginationDto: CursorPaginationDto,
  ): Promise<PaginatedResult<Branch>> {
    const { cursor, limit = 10 } = paginationDto;
    const queryBuilder = this.branchRepository.createQueryBuilder('branch');

    queryBuilder.where('branch.tenantId = :tenantId', { tenantId });

    if (cursor) {
      queryBuilder.andWhere('branch.id > :cursor', { cursor });
    }

    queryBuilder.orderBy('branch.id', 'ASC').take(limit + 1);

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
   * Retrieves a single branch by ID, scoped to tenant.
   *
   * @param id - Branch ID
   * @param tenantId - The tenant ID for scoping
   * @returns The Branch entity
   * @throws {NotFoundException} If the branch does not exist for this tenant
   */
  async findOne(id: number, tenantId: number): Promise<Branch> {
    const branch = await this.branchRepository.findOne({
      where: { id, tenantId },
    });

    if (!branch) {
      throw new NotFoundException(`Branch with ID ${id} not found`);
    }

    return branch;
  }

  /**
   * Creates a new branch for a tenant.
   *
   * @param dto - Branch creation data
   * @param tenantId - The tenant ID to associate with the branch
   * @returns The created Branch entity
   */
  async create(dto: CreateBranchDto, tenantId: number): Promise<Branch> {
    const branch = this.branchRepository.create({
      ...dto,
      tenantId,
    });

    return this.branchRepository.save(branch);
  }

  /**
   * Updates an existing branch, scoped to tenant.
   *
   * @param id - Branch ID
   * @param dto - Partial branch data to update
   * @param tenantId - The tenant ID for scoping
   * @returns The updated Branch entity
   * @throws {NotFoundException} If the branch does not exist for this tenant
   */
  async update(
    id: number,
    dto: UpdateBranchDto,
    tenantId: number,
  ): Promise<Branch> {
    const branch = await this.findOne(id, tenantId);
    Object.assign(branch, dto);
    return this.branchRepository.save(branch);
  }

  /**
   * Soft-deletes a branch, scoped to tenant.
   *
   * @param id - Branch ID
   * @param tenantId - The tenant ID for scoping
   * @throws {NotFoundException} If the branch does not exist for this tenant
   */
  async remove(id: number, tenantId: number): Promise<void> {
    const branch = await this.findOne(id, tenantId);
    await this.branchRepository.softRemove(branch);
  }
}
