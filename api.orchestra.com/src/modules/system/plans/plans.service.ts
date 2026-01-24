import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { Plan } from '../../../entities/system/plan.entity';
import { SystemModule } from '../../../entities/system/system-module.entity';
import { CursorPaginationDto } from '../../../common/dto/cursor-pagination.dto';
import { PaginatedResult } from '@/types';

/**
 * Service responsible for managing Subscription Plans.
 * Handles creation, retrieval, updates, and soft-deletion of plans.
 * Manages relationships between Plans and SystemModules.
 */
@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(Plan)
    private readonly plansRepository: Repository<Plan>,
    @InjectRepository(SystemModule)
    private readonly systemModulesRepository: Repository<SystemModule>,
  ) {}

  /**
   * Creates a new plan and associates it with provided modules.
   *
   * @param createPlanDto - Data for creating the plan
   * @returns The created Plan entity
   */
  async create(createPlanDto: CreatePlanDto): Promise<Plan> {
    const { moduleIds, ...planData } = createPlanDto;
    const plan = this.plansRepository.create(planData);

    if (moduleIds && moduleIds.length > 0) {
      const modules = await this.systemModulesRepository.findBy({
        id: In(moduleIds),
      });
      plan.modules = modules;
    }

    return await this.plansRepository.save(plan);
  }

  /**
   * Retrieves a paginated list of plans.
   *
   * @param paginationDto - Cursor pagination parameters
   * @returns Paginated result containing plans and next cursor
   */
  async findAll(
    paginationDto: CursorPaginationDto,
  ): Promise<PaginatedResult<Plan>> {
    const { cursor, limit = 10 } = paginationDto;
    const queryBuilder = this.plansRepository.createQueryBuilder('plan');

    // Include the relation to show which modules are in the plan
    queryBuilder.leftJoinAndSelect('plan.modules', 'modules');

    if (cursor) {
      queryBuilder.where('plan.id > :cursor', { cursor });
    }

    queryBuilder.orderBy('plan.id', 'ASC').take(limit + 1);

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
   * Retrieves a single plan by ID.
   *
   * @param id - The unique identifier of the plan
   * @returns The requested Plan entity
   * @throws {NotFoundException} If plan is not found
   */
  async findOne(id: number): Promise<Plan> {
    const plan = await this.plansRepository.findOne({
      where: { id },
      relations: ['modules'],
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }
    return plan;
  }

  /**
   * Updates an existing plan.
   *
   * @param id - The unique identifier of the plan
   * @param updatePlanDto - Data for updating the plan
   * @returns The updated Plan entity
   * @throws {NotFoundException} If plan is not found
   */
  async update(id: number, updatePlanDto: UpdatePlanDto): Promise<Plan> {
    const plan = await this.findOne(id);
    const { moduleIds, ...updateData } = updatePlanDto;

    // Update basic fields
    this.plansRepository.merge(plan, updateData);

    // Update relationships if moduleIds are provided
    if (moduleIds) {
      const modules = await this.systemModulesRepository.findBy({
        id: In(moduleIds),
      });
      plan.modules = modules;
    }

    return await this.plansRepository.save(plan);
  }

  /**
   * Soft-deletes a plan.
   *
   * @param id - The unique identifier of the plan
   * @returns Void promise
   * @throws {NotFoundException} If plan is not found
   */
  async remove(id: number): Promise<void> {
    // Verify the plan exists before attempting deletion
    await this.findOne(id);
    await this.plansRepository.softDelete(id);
  }
}
