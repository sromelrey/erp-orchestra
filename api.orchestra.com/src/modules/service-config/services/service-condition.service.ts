import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm';
import { ServiceCondition } from '@/entities/service-config/service-condition.entity';
import { CreateServiceConditionDto } from '../dto/create-service-condition.dto';
import { UpdateServiceConditionDto } from '../dto/update-service-condition.dto';

@Injectable()
export class ServiceConditionService {
  constructor(
    @InjectRepository(ServiceCondition)
    private readonly serviceConditionRepository: Repository<ServiceCondition>,
  ) {}

  async create(
    createDto: CreateServiceConditionDto,
    actor: { tenantId: number; userId: number },
  ) {
    const serviceCondition = this.serviceConditionRepository.create({
      ...createDto,
      tenantId: actor.tenantId,
      createdBy: actor.userId,
      updatedBy: actor.userId,
    });

    return this.serviceConditionRepository.save(serviceCondition);
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

    const where: FindOptionsWhere<ServiceCondition> = {
      tenantId: actor.tenantId,
    };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (search) {
      where.name = search;
    }

    const findOptions: FindManyOptions<ServiceCondition> = {
      where,
      skip,
      take: limit,
      order: {
        code: 'ASC',
      },
    };

    const [data, total] =
      await this.serviceConditionRepository.findAndCount(findOptions);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, actor: { tenantId: number }) {
    const findOptions: FindOneOptions<ServiceCondition> = {
      where: {
        id,
        tenantId: actor.tenantId,
      },
    };

    return this.serviceConditionRepository.findOne(findOptions);
  }

  async update(
    id: number,
    updateDto: UpdateServiceConditionDto,
    actor: { tenantId: number; userId: number },
  ) {
    await this.serviceConditionRepository.update(
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
    return this.serviceConditionRepository.softDelete({
      id,
      tenantId: actor.tenantId,
    });
  }

  async findByCode(code: string, actor: { tenantId: number }) {
    return this.serviceConditionRepository.findOne({
      where: {
        code,
        tenantId: actor.tenantId,
      },
    });
  }
}
