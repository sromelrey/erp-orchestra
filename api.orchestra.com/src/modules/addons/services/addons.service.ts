import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindManyOptions, QueryFailedError } from 'typeorm';
import { plainToInstance } from 'class-transformer';
import { Addon } from '@/entities/addons/addon.entity';
import { AddonInclusionRule } from '@/entities/addons/addon-inclusion-rule.entity';
import { CreateAddonDto } from '../dto/create-addon.dto';
import { UpdateAddonDto } from '../dto/update-addon.dto';
import { CreateAddonRuleDto } from '../dto/create-addon-rule.dto';
import { UpdateAddonRuleDto } from '../dto/update-addon-rule.dto';
import { AddonResponseDto } from '../dto/addon-response.dto';

@Injectable()
export class AddonsService {
  constructor(
    @InjectRepository(Addon)
    private readonly addonRepository: Repository<Addon>,
    @InjectRepository(AddonInclusionRule)
    private readonly ruleRepository: Repository<AddonInclusionRule>,
  ) {}

  async create(
    createDto: CreateAddonDto,
    actor: { tenantId: number; userId: number },
  ) {
    // Check if addon with the same code already exists for this tenant
    const existing = await this.findByCode(createDto.code, actor);
    if (existing) {
      throw new ConflictException(
        `Addon with code '${createDto.code}' already exists for this tenant. ` +
          `Existing addon: ${existing.name} (ID: ${existing.id}). ` +
          `Please use a different code or update the existing addon.`,
      );
    }

    const addon = this.addonRepository.create({
      ...createDto,
      tenantId: actor.tenantId,
      createdBy: actor.userId,
      updatedBy: actor.userId,
    });

    try {
      const savedAddon = await this.addonRepository.save(addon);
      return plainToInstance(AddonResponseDto, savedAddon);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes('duplicate key')
      ) {
        throw new ConflictException(
          `Failed to create addon: An addon with code '${createDto.code}' already exists. ` +
            `Please use a different code or update the existing addon.`,
        );
      }
      throw error;
    }
  }

  async findAll(
    actor: { tenantId: number; userId: number },
    options?: {
      page?: number;
      limit?: number;
      search?: string;
      type?: 'PHYSICAL' | 'SERVICE';
      isActive?: boolean;
    },
  ) {
    const { page = 1, limit = 20, search, type, isActive } = options || {};
    const skip = (page - 1) * limit;

    const where: {
      tenantId: number;
      isActive?: boolean;
      type?: 'PHYSICAL' | 'SERVICE';
      name?: string;
    } = {
      tenantId: actor.tenantId,
    };

    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    if (type) {
      where.type = type;
    }

    if (search) {
      where.name = search;
    }

    const findOptions: FindManyOptions<Addon> = {
      where,
      skip,
      take: limit,
      order: {
        createdAt: 'DESC',
      },
    };

    const [data, total] = await this.addonRepository.findAndCount(findOptions);

    return {
      data: plainToInstance(AddonResponseDto, data),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number, actor: { tenantId: number; userId: number }) {
    const addon = await this.addonRepository.findOne({
      where: {
        id,
        tenantId: actor.tenantId,
      },
      relations: ['inclusionRules'],
    });

    if (!addon) {
      throw new NotFoundException(`Addon with ID ${id} not found`);
    }

    return plainToInstance(AddonResponseDto, addon);
  }

  async findByCode(code: string, actor: { tenantId: number; userId: number }) {
    return this.addonRepository.findOne({
      where: {
        code,
        tenantId: actor.tenantId,
      },
    });
  }

  async update(
    id: number,
    updateDto: UpdateAddonDto,
    actor: { tenantId: number; userId: number },
  ) {
    // Check if addon exists
    const existing = await this.findOne(id, actor);
    if (!existing) {
      throw new NotFoundException(
        `Addon with ID ${id} not found for this tenant.`,
      );
    }

    // If updating code, check for duplicates
    if (updateDto.code && updateDto.code !== existing.code) {
      const duplicate = await this.findByCode(updateDto.code, actor);
      if (duplicate) {
        throw new ConflictException(
          `Addon with code '${updateDto.code}' already exists for this tenant. ` +
            `Existing addon: ${duplicate.name} (ID: ${duplicate.id}).`,
        );
      }
    }

    try {
      await this.addonRepository.update(
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

      return await this.findOne(id, actor);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes('duplicate key')
      ) {
        throw new ConflictException(
          `Failed to update addon: An addon with this code already exists.`,
        );
      }
      throw error;
    }
  }

  async remove(id: number, actor: { tenantId: number; userId: number }) {
    const existing = await this.findOne(id, actor);
    if (!existing) {
      throw new NotFoundException(
        `Addon with ID ${id} not found for this tenant.`,
      );
    }

    return this.addonRepository.softDelete({
      id,
      tenantId: actor.tenantId,
    });
  }

  // Inclusion Rules Management
  async createRule(
    createDto: CreateAddonRuleDto,
    actor: { tenantId: number; userId: number },
  ) {
    // Check if addon exists
    const addon = await this.findOne(createDto.addonId, actor);
    if (!addon) {
      throw new NotFoundException(
        `Addon with ID ${createDto.addonId} not found for this tenant.`,
      );
    }

    const rule = this.ruleRepository.create({
      ...createDto,
      tenantId: actor.tenantId,
      createdBy: actor.userId,
      updatedBy: actor.userId,
    });

    return this.ruleRepository.save(rule);
  }

  async findAllRules(actor: { tenantId: number; userId: number }) {
    return this.ruleRepository.find({
      where: {
        tenantId: actor.tenantId,
      },
      relations: ['addon'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async updateRule(
    id: number,
    updateDto: UpdateAddonRuleDto,
    actor: { tenantId: number; userId: number },
  ) {
    const rule = await this.ruleRepository.findOne({
      where: { id, tenantId: actor.tenantId },
    });

    if (!rule) {
      throw new NotFoundException(`Rule with ID ${id} not found`);
    }

    await this.ruleRepository.update(id, {
      ...updateDto,
      updatedBy: actor.userId,
      updatedAt: new Date(),
    });

    return this.ruleRepository.findOne({ where: { id } });
  }

  async removeRule(id: number, actor: { tenantId: number; userId: number }) {
    const rule = await this.ruleRepository.findOne({
      where: { id, tenantId: actor.tenantId },
    });

    if (!rule) {
      throw new NotFoundException(`Rule with ID ${id} not found`);
    }

    return this.ruleRepository.softDelete(id);
  }
}
