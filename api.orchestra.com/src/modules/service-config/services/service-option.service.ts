import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryFailedError,
} from 'typeorm';
import { ServiceOption } from '@/entities/service-config/service-option.entity';
import { CreateServiceOptionDto } from '../dto/create-service-option.dto';
import { UpdateServiceOptionDto } from '../dto/update-service-option.dto';

@Injectable()
export class ServiceOptionService {
  constructor(
    @InjectRepository(ServiceOption)
    private readonly serviceOptionRepository: Repository<ServiceOption>,
  ) {}

  async create(
    createDto: CreateServiceOptionDto,
    actor: { tenantId: number; userId: number },
  ) {
    const serviceOption = this.serviceOptionRepository.create({
      ...createDto,
      tenantId: actor.tenantId,
      createdBy: actor.userId,
      updatedBy: actor.userId,
    });

    try {
      return await this.serviceOptionRepository.save(serviceOption);
    } catch (error) {
      if (error instanceof QueryFailedError) {
        // PostgreSQL error code 23505 is for unique violation
        const driverError = error.driverError as { code?: string };
        if (driverError.code === '23505') {
          throw new ConflictException(
            `Service option with code '${createDto.code}' already exists for this tenant`,
          );
        }
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

    const where: FindOptionsWhere<ServiceOption> = {
      tenantId: actor.tenantId,
    };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.name = search;
    }

    const findOptions: FindManyOptions<ServiceOption> = {
      where,
      skip,
      take: limit,
      order: {
        code: 'ASC',
      },
    };

    const [data, total] =
      await this.serviceOptionRepository.findAndCount(findOptions);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, actor: { tenantId: number }) {
    const findOptions: FindOneOptions<ServiceOption> = {
      where: {
        id,
        tenantId: actor.tenantId,
      },
    };

    return this.serviceOptionRepository.findOne(findOptions);
  }

  async update(
    id: number,
    updateDto: UpdateServiceOptionDto,
    actor: { tenantId: number; userId: number },
  ) {
    await this.serviceOptionRepository.update(
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
  }

  async remove(id: number, actor: { tenantId: number; userId: number }) {
    return this.serviceOptionRepository.softDelete({
      id,
      tenantId: actor.tenantId,
    });
  }

  async findByCode(code: string, actor: { tenantId: number }) {
    return this.serviceOptionRepository.findOne({
      where: {
        code,
        tenantId: actor.tenantId,
      },
    });
  }
}
