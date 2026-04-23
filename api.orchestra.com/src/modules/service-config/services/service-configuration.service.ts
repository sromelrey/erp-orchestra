import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Repository,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  IsNull,
} from 'typeorm';
import { ServiceConfiguration } from '@/entities/service-config/service-configuration.entity';
import { CreateServiceConfigurationDto } from '../dto/create-service-configuration.dto';
import { UpdateServiceConfigurationDto } from '../dto/update-service-configuration.dto';

@Injectable()
export class ServiceConfigurationService {
  constructor(
    @InjectRepository(ServiceConfiguration)
    private readonly serviceConfigurationRepository: Repository<ServiceConfiguration>,
  ) {}

  async create(
    createDto: CreateServiceConfigurationDto,
    actor: { tenantId: number; userId: number },
  ) {
    const serviceConfiguration = this.serviceConfigurationRepository.create({
      ...createDto,
      tenantId: actor.tenantId,
      createdBy: actor.userId,
      updatedBy: actor.userId,
    });

    return this.serviceConfigurationRepository.save(serviceConfiguration);
  }

  async findAll(
    actor: { tenantId: number },
    options?: {
      page?: number;
      limit?: number;
      serviceTypeId?: number;
      serviceOptionId?: number;
      isActive?: boolean;
    },
  ) {
    const {
      page = 1,
      limit = 20,
      serviceTypeId,
      serviceOptionId,
      isActive,
    } = options || {};
    const skip = (page - 1) * limit;

    const where: FindOptionsWhere<ServiceConfiguration> = {
      tenantId: actor.tenantId,
    };

    if (serviceTypeId) {
      where.serviceTypeId = serviceTypeId;
    }

    if (serviceOptionId) {
      where.serviceOptionId = serviceOptionId;
    }

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const findOptions: FindManyOptions<ServiceConfiguration> = {
      where,
      skip,
      take: limit,
      relations: ['serviceType', 'serviceOption', 'bom'],
      order: {
        serviceType: {
          code: 'ASC',
        },
        serviceOption: {
          code: 'ASC',
        },
      },
    };

    const [data, total] =
      await this.serviceConfigurationRepository.findAndCount(findOptions);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, actor: { tenantId: number }) {
    const findOptions: FindOneOptions<ServiceConfiguration> = {
      where: {
        id,
        tenantId: actor.tenantId,
      },
      relations: ['serviceType', 'serviceOption', 'bom'],
    };

    return this.serviceConfigurationRepository.findOne(findOptions);
  }

  async update(
    id: number,
    updateDto: UpdateServiceConfigurationDto,
    actor: { tenantId: number; userId: number },
  ) {
    await this.serviceConfigurationRepository.update(
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
    return this.serviceConfigurationRepository.softDelete({
      id,
      tenantId: actor.tenantId,
    });
  }

  async findMatchingConfiguration(
    tenantId: number,
    serviceTypeId: number,
    serviceOptionId: number,
    conditionKey?: string,
    conditionValue?: string,
  ) {
    const where: FindOptionsWhere<ServiceConfiguration> = {
      tenantId,
      serviceTypeId,
      serviceOptionId,
      isActive: true,
    };

    if (conditionKey && conditionValue) {
      where.conditionKey = conditionKey;
      where.conditionValue = conditionValue;
    } else {
      // For configurations without conditions
      where.conditionKey = IsNull();
      where.conditionValue = IsNull();
    }

    return this.serviceConfigurationRepository.findOne({
      where,
      relations: ['bom'],
    });
  }

  async getPrice(
    tenantId: number,
    serviceTypeId: number,
    serviceOptionId: number,
  ) {
    const configuration = await this.serviceConfigurationRepository.findOne({
      where: {
        tenantId,
        serviceTypeId,
        serviceOptionId,
        isActive: true,
      },
      relations: ['serviceType', 'serviceOption'],
    });

    if (!configuration) {
      throw new Error(
        `No active service configuration found for service type ${serviceTypeId} and option ${serviceOptionId}`,
      );
    }

    return {
      price: configuration.price,
      serviceTypeName: configuration.serviceType?.name || '',
      serviceOptionName: configuration.serviceOption?.name || '',
    };
  }
}
