import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryFailedError,
} from 'typeorm';
import { ServiceType } from '@/entities/service-config/service-type.entity';
import { CreateServiceTypeDto } from '../dto/create-service-type.dto';
import { UpdateServiceTypeDto } from '../dto/update-service-type.dto';

@Injectable()
export class ServiceTypeService {
  constructor(
    @InjectRepository(ServiceType)
    private readonly serviceTypeRepository: Repository<ServiceType>,
  ) {}

  async create(
    createDto: CreateServiceTypeDto,
    actor: { tenantId: number; userId: number },
  ) {
    // Check if service type with the same code already exists for this tenant
    const existing = await this.findByCode(createDto.code, actor);
    if (existing) {
      throw new ConflictException(
        `Service type with code '${createDto.code}' already exists for this tenant. ` +
          `Existing service type: ${existing.name} (ID: ${existing.id}). ` +
          `Please use a different code or update the existing service type.`,
      );
    }

    const serviceType = this.serviceTypeRepository.create({
      ...createDto,
      tenantId: actor.tenantId,
      createdBy: actor.userId,
      updatedBy: actor.userId,
    });

    try {
      return await this.serviceTypeRepository.save(serviceType);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes('duplicate key')
      ) {
        throw new ConflictException(
          `Failed to create service type: A service type with code '${createDto.code}' already exists. ` +
            `Please use a different code or update the existing service type.`,
        );
      }
      throw error;
    }
  }

  async findAll(
    actor: { tenantId: number },
    options?: {
      page?: number;
      limit?: number;
      search?: string;
      isActive?: boolean;
    },
  ) {
    const { page = 1, limit = 20, search, isActive } = options || {};
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<ServiceType> = {
      tenantId: actor.tenantId,
    };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.name = search;
    }

    const findOptions: FindManyOptions<ServiceType> = {
      where,
      skip,
      take: limit,
      order: {
        code: 'ASC',
      },
    };

    const [data, total] =
      await this.serviceTypeRepository.findAndCount(findOptions);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, actor: { tenantId: number }) {
    const findOptions: FindOneOptions<ServiceType> = {
      where: {
        id,
        tenantId: actor.tenantId,
      },
    };

    return this.serviceTypeRepository.findOne(findOptions);
  }

  async update(
    id: number,
    updateDto: UpdateServiceTypeDto,
    actor: { tenantId: number; userId: number },
  ) {
    // Check if service type exists
    const existing = await this.findOne(id, actor);
    if (!existing) {
      throw new NotFoundException(
        `Service type with ID ${id} not found for this tenant.`,
      );
    }

    // If updating code, check for duplicates
    if (updateDto.code && updateDto.code !== existing.code) {
      const duplicate = await this.findByCode(updateDto.code, actor);
      if (duplicate) {
        throw new ConflictException(
          `Service type with code '${updateDto.code}' already exists for this tenant. ` +
            `Existing service type: ${duplicate.name} (ID: ${duplicate.id}).`,
        );
      }
    }

    try {
      await this.serviceTypeRepository.update(
        {
          id,
          tenantId: actor.tenantId,
        },
        {
          ...updateDto,
          updatedBy: actor.userId,
          updatedAt: new Date(),
        },
      );

      return this.findOne(id, actor);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes('duplicate key')
      ) {
        throw new ConflictException(
          `Failed to update service type: A service type with this code already exists.`,
        );
      }
      throw error;
    }
  }

  async remove(id: number, actor: { tenantId: number; userId: number }) {
    const existing = await this.findOne(id, actor);
    if (!existing) {
      throw new NotFoundException(
        `Service type with ID ${id} not found for this tenant.`,
      );
    }

    return this.serviceTypeRepository.softDelete({
      id,
      tenantId: actor.tenantId,
    });
  }

  async findByCode(code: string, actor: { tenantId: number }) {
    return this.serviceTypeRepository.findOne({
      where: {
        code,
        tenantId: actor.tenantId,
      },
    });
  }
}
