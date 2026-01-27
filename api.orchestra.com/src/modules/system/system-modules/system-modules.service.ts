import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSystemModuleDto } from './dto/create-system-module.dto';
import { UpdateSystemModuleDto } from './dto/update-system-module.dto';
import { SystemModule } from '../../../entities/system/system-module.entity';
import { CursorPaginationDto } from '../../../common/dto/cursor-pagination.dto';
import { PaginatedResult } from '@/types';

/**
 * Service responsible for managing System Modules.
 * Handles creation, retrieval, updates, and soft-deletion of module definitions.
 */
@Injectable()
export class SystemModulesService {
  constructor(
    @InjectRepository(SystemModule)
    private readonly systemModulesRepository: Repository<SystemModule>,
  ) {}

  /**
   * Creates a new system module.
   *
   * @param createSystemModuleDto - Data for creating the module
   * @returns The created SystemModule entity
   */
  async create(
    createSystemModuleDto: CreateSystemModuleDto,
  ): Promise<SystemModule> {
    const module = this.systemModulesRepository.create(createSystemModuleDto);
    return await this.systemModulesRepository.save(module);
  }

  /**
   * Retrieves a paginated list of system modules.
   *
   * @param paginationDto - Cursor pagination parameters
   * @returns Paginated result containing modules and next cursor
   */
  async findAll(
    paginationDto: CursorPaginationDto,
  ): Promise<PaginatedResult<SystemModule>> {
    const { cursor, limit = 10 } = paginationDto;
    const queryBuilder =
      this.systemModulesRepository.createQueryBuilder('module');

    if (cursor) {
      queryBuilder.where('module.id > :cursor', { cursor });
    }

    queryBuilder.orderBy('module.id', 'ASC').take(limit + 1);

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
   * Retrieves a lightweight list of modules for select dropdowns.
   * Only returns id, name, and code - useful for parent module selection.
   *
   * @returns Array of module options
   */
  async getOptions(): Promise<Pick<SystemModule, 'id' | 'name' | 'code'>[]> {
    return this.systemModulesRepository.find({
      select: ['id', 'name', 'code'],
      where: { type: 'MODULE' }, // Only top-level modules can be parents
      order: { name: 'ASC' },
    });
  }

  /**
   * Retrieves a single module by ID.
   *
   * @param id - The unique identifier of the module
   * @returns The requested SystemModule entity
   * @throws {NotFoundException} If module is not found
   */
  async findOne(id: number): Promise<SystemModule> {
    const module = await this.systemModulesRepository.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    if (!module) {
      throw new NotFoundException(`System Module with ID ${id} not found`);
    }
    return module;
  }

  /**
   * Updates an existing module.
   *
   * @param id - The unique identifier of the module
   * @param updateSystemModuleDto - Data for updating the module
   * @returns The updated SystemModule entity
   * @throws {NotFoundException} If module is not found
   */
  async update(
    id: number,
    updateSystemModuleDto: UpdateSystemModuleDto,
  ): Promise<SystemModule> {
    const module = await this.findOne(id);
    const updatedModule = this.systemModulesRepository.merge(
      module,
      updateSystemModuleDto,
    );
    return await this.systemModulesRepository.save(updatedModule);
  }

  /**
   * Soft-deletes a module.
   *
   * @param id - The unique identifier of the module
   * @returns Void promise
   * @throws {NotFoundException} If module is not found
   */
  async remove(id: number): Promise<void> {
    // Verify the module exists before attempting deletion
    await this.findOne(id);
    await this.systemModulesRepository.softDelete(id);
  }
}
