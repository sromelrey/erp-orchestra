import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../../entities/system/user.entity';
import { Tenant } from '../../../entities/system/tenant.entity';
import { Role } from '../../../entities/system/role.entity';
import { UserRole } from '../../../entities/system/user-role.entity';
import { CreateTenantUserDto } from './dto/create-tenant-user.dto';
import { CursorPaginationDto } from '../../../common/dto/cursor-pagination.dto';
import { PaginatedResult } from '@/types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  /**
   * Create a user for a specific tenant
   */
  async createForTenant(
    tenantId: number,
    createDto: CreateTenantUserDto,
  ): Promise<User> {
    // Verify tenant exists
    const tenant = await this.tenantRepository.findOne({
      where: { id: tenantId },
    });
    if (!tenant) {
      throw new NotFoundException(`Tenant with ID ${tenantId} not found`);
    }

    // Check email uniqueness
    const existingUser = await this.userRepository.findOne({
      where: { email: createDto.email },
      withDeleted: true,
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    // Hash password
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(createDto.password, salt);

    console.log('Creating user for tenant:', tenantId);
    console.log('Role IDs received:', createDto.roleIds);

    // Create user
    const user = this.userRepository.create({
      ...createDto,
      passwordHash,
      tenantId,
      isSystemAdmin: false, // Tenant users are never system admins by this method
    });

    const savedUser = await this.userRepository.save(user);

    // Assign Roles if provided
    if (createDto.roleIds && createDto.roleIds.length > 0) {
      for (const roleId of createDto.roleIds) {
        // Verify role belongs to tenant or is a common role
        // For now, assuming any valid roleId is okay, but ideally should check tenant ownership
        const role = await this.roleRepository.findOne({
          where: { id: roleId },
        });
        if (role) {
          await this.userRoleRepository.save({
            userId: savedUser.id,
            roleId: role.id,
          });
        }
      }
    }

    return savedUser;
  }

  /**
   * Find users for a specific tenant
   */
  async findAllForTenant(
    tenantId: number,
    paginationDto: CursorPaginationDto,
  ): Promise<PaginatedResult<User>> {
    const { cursor, limit = 10 } = paginationDto;
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    queryBuilder
      .where('user.tenantId = :tenantId', { tenantId })
      .leftJoinAndSelect('user.userRoles', 'userRoles')
      .leftJoinAndSelect('userRoles.role', 'role');

    if (cursor) {
      queryBuilder.andWhere('user.id > :cursor', { cursor });
    }

    queryBuilder.orderBy('user.id', 'ASC').take(limit + 1);

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

  // Basic CRUD for completeness/future use
  async findAll(
    paginationDto: CursorPaginationDto,
  ): Promise<PaginatedResult<User>> {
    const { cursor, limit = 10 } = paginationDto;
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if (cursor) {
      queryBuilder.where('user.id > :cursor', { cursor });
    }

    queryBuilder.orderBy('user.id', 'ASC').take(limit + 1);

    const items = await queryBuilder.getMany();
    let nextCursor: string | number | null = null;

    if (items.length > limit) {
      const nextItem = items.pop();
      nextCursor = nextItem ? nextItem.id : null;
    }

    return {
      data: items,
      meta: { nextCursor },
    };
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['tenant', 'userRoles', 'userRoles.role'],
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }
}
