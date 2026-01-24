import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../../entities/system/tenant.entity';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { CursorPaginationDto } from '../../../common/dto/cursor-pagination.dto';
import { PaginatedResult } from '@/types';

/**
 * Service responsible for managing tenant lifecycles.
 * Handles creation, retrieval, updates, and soft-deletion of Tenant entities.
 */
@Injectable()
export class TenantsService {
  constructor(
    @InjectRepository(Tenant)
    private readonly tenantsRepository: Repository<Tenant>,
  ) {}

  /**
   * Creates a new tenant in the system.
   *
   * @param createTenantDto - The DTO containing tenant creation details
   * @returns The newly created Tenant entity
   */
  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const tenant = this.tenantsRepository.create(createTenantDto);
    return await this.tenantsRepository.save(tenant);
  }

  /**
   * Retrieves a paginated list of tenants using cursor-based pagination.
   *
   * @param paginationDto - Cursor pagination options (cursor, limit)
   * @returns A PaginatedResult containing the list of tenants and the next cursor (if any)
   */
  async findAll(
    paginationDto: CursorPaginationDto,
  ): Promise<PaginatedResult<Tenant>> {
    const { cursor, limit = 10 } = paginationDto;
    // Assuming cursor is the ID for simplicity, typically you'd decode a cursor
    // But since the plan says "next cursor", we'll just use ID.
    const queryBuilder = this.tenantsRepository.createQueryBuilder('tenant');

    if (cursor) {
      queryBuilder.where('tenant.id > :cursor', { cursor });
    }

    queryBuilder.orderBy('tenant.id', 'ASC').take(limit + 1); // Fetch one more to check if next page exists

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
   * Finds a single tenant by its unique ID.
   *
   * @param id - The ID of the tenant to retrieve
   * @returns The found Tenant entity
   * @throws {NotFoundException} If no tenant is found with the given ID
   */
  async findOne(id: number): Promise<Tenant> {
    const tenant = await this.tenantsRepository.findOne({ where: { id } });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${id} not found`);
    }
    return tenant;
  }

  /**
   * Updates an existing tenant's information.
   *
   * @param id - The ID of the tenant to update
   * @param updateTenantDto - The DTO containing fields to update
   * @returns The updated Tenant entity
   * @throws {NotFoundException} If the tenant does not exist
   */
  async update(id: number, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);
    const updatedTenant = this.tenantsRepository.merge(tenant, updateTenantDto);
    return await this.tenantsRepository.save(updatedTenant);
  }

  /**
   * Soft-deletes a tenant from the system.
   *
   * @param id - The ID of the tenant to remove
   * @returns Void promise when operation is complete
   * @throws {NotFoundException} If the tenant does not exist
   */
  async remove(id: number): Promise<void> {
    // Verify the tenant exists before attempting deletion
    await this.findOne(id);
    await this.tenantsRepository.softDelete(id);
  }
}
