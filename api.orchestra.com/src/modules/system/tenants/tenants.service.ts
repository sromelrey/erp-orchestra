import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tenant } from '../../../entities/system/tenant.entity';
import { Plan } from '../../../entities/system/plan.entity';
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
    @InjectRepository(Plan)
    private readonly plansRepository: Repository<Plan>,
  ) {}

  /**
   * Creates a new tenant in the system.
   *
   * @param createTenantDto - The DTO containing tenant creation details
   * @returns The newly created Tenant entity
   * @throws {BadRequestException} If the plan name is not found
   */
  async create(createTenantDto: CreateTenantDto): Promise<Tenant> {
    const { plan: planName, subdomain, ...rest } = createTenantDto;

    // Look up plan by name
    const plan = await this.plansRepository.findOne({
      where: { name: planName },
    });

    if (!plan) {
      throw new BadRequestException(`Plan "${planName}" not found`);
    }

    // Create tenant with planId and slug (mapped from subdomain)
    const tenant = this.tenantsRepository.create({
      ...rest,
      slug: subdomain,
      planId: plan.id,
    });

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
    const queryBuilder = this.tenantsRepository
      .createQueryBuilder('tenant')
      .leftJoinAndSelect('tenant.plan', 'plan');

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
    const tenant = await this.tenantsRepository.findOne({
      where: { id },
      relations: ['plan'],
    });
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
   * @throws {BadRequestException} If the plan name is not found
   */
  async update(id: number, updateTenantDto: UpdateTenantDto): Promise<Tenant> {
    const tenant = await this.findOne(id);
    const { plan: planName, subdomain, ...rest } = updateTenantDto;

    // Build update object
    const updateData: Partial<Tenant> = { ...rest };

    // Map subdomain to slug if provided
    if (subdomain !== undefined) {
      updateData.slug = subdomain;
    }

    // Look up plan by name if provided
    if (planName !== undefined) {
      const plan = await this.plansRepository.findOne({
        where: { name: planName },
      });

      if (!plan) {
        throw new BadRequestException(`Plan "${planName}" not found`);
      }

      updateData.planId = plan.id;
    }

    const updatedTenant = this.tenantsRepository.merge(tenant, updateData);
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

  /**
   * Retrieves the feature codes (module codes) available to a tenant through their plan.
   *
   * @param tenantId - The ID of the tenant
   * @returns Array of module codes available to the tenant
   * @throws {NotFoundException} If the tenant does not exist
   */
  async getTenantFeatures(tenantId: number): Promise<string[]> {
    const tenant = await this.tenantsRepository.findOne({
      where: { id: tenantId },
      relations: ['plan', 'plan.modules'],
    });

    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    return tenant.plan?.modules?.map((module) => module.code) ?? [];
  }
}
