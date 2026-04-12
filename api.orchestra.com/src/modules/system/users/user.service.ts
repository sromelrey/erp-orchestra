import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../../entities/system/user.entity';
import { UserPermission } from '../../../entities/system/user-permission.entity';
import { Permission } from '../../../entities/system/permission.entity';
import { Tenant } from '../../../entities/system/tenant.entity';
import { UserRole } from '../../../entities/system/user-role.entity';
import { CreateTenantUserDto } from './dto/create-tenant-user.dto';
import { UpdateTenantUserDto } from './dto/update-tenant-user.dto';
import { CursorPaginationDto } from '../../../common/dto/cursor-pagination.dto';
import { PaginatedResult } from '@/types';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserPermission)
    private readonly userPermissionRepository: Repository<UserPermission>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
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

    // Create user
    const { roleIds, ...userData } = createDto;
    const user = this.userRepository.create({
      ...userData,
      passwordHash,
      tenantId,
      isSystemAdmin: false,
    });

    const savedUser = await this.userRepository.save(user);

    // Assign roles if provided
    if (roleIds && roleIds.length > 0) {
      const userRoles = roleIds.map((roleId) => {
        const userRole = new UserRole();
        userRole.userId = savedUser.id;
        userRole.roleId = roleId;
        userRole.assignedAt = new Date();
        return userRole;
      });
      await this.userRoleRepository.save(userRoles);
    }

    return this.findOneForTenant(tenantId, savedUser.id);
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

  /**
   * Find a user belonging to a specific tenant
   */
  async findOneForTenant(tenantId: number, id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, tenantId },
      relations: ['userRoles', 'userRoles.role'],
    });

    if (!user) {
      throw new NotFoundException(
        `User with ID ${id} not found in this tenant`,
      );
    }
    return user;
  }

  /**
   * Update a user for a specific tenant
   */
  async updateForTenant(
    tenantId: number,
    id: number,
    dto: UpdateTenantUserDto,
  ): Promise<User> {
    const user = await this.findOneForTenant(tenantId, id);

    // Update basic fields
    const { password, roleIds, ...rest } = dto;
    Object.assign(user, rest);

    if (password) {
      const salt = await bcrypt.genSalt();
      user.passwordHash = await bcrypt.hash(password, salt);
    }

    await this.userRepository.save(user);

    // Handle role assignments if provided
    if (roleIds !== undefined) {
      // Remove existing role assignments
      await this.userRoleRepository.delete({ userId: id });

      // Add new role assignments if any
      if (roleIds.length > 0) {
        const userRoles = roleIds.map((roleId) => {
          const userRole = new UserRole();
          userRole.userId = id;
          userRole.roleId = roleId;
          userRole.assignedAt = new Date();
          return userRole;
        });
        await this.userRoleRepository.save(userRoles);
      }
    }

    return this.findOneForTenant(tenantId, id);
  }

  /**
   * Remove a user from a specific tenant
   */
  async removeForTenant(tenantId: number, id: number): Promise<void> {
    const user = await this.findOneForTenant(tenantId, id);
    await this.userRepository.softRemove(user);
  }

  /**
   * Assign permissions to a user
   *
   * @param userId - The user ID
   * @param permissionIds - Array of permission IDs to assign
   * @param type - Type of assignment (GRANT or DENY)
   * @param tenantId - Optional tenant ID for multi-tenant support
   * @param expiresAt - Optional expiration date
   * @returns Promise<User> - Updated user with assigned permissions
   */
  async assignPermissions(
    userId: number,
    permissionIds: number[],
    type: 'GRANT' | 'DENY',
    tenantId?: number,
    expiresAt?: Date,
  ): Promise<User> {
    // Verify user exists
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['userPermissions', 'userPermissions.permission'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Verify all permissions exist
    const permissions =
      await this.permissionRepository.findByIds(permissionIds);
    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('One or more permissions not found');
    }

    // Check for existing assignments of same type to avoid duplicates
    const existingPermissions = await this.userPermissionRepository.find({
      where: {
        userId,
        type,
        permissionId: In(permissionIds),
      },
    });

    const existingPermissionIds = new Set(
      existingPermissions.map((up) => up.permissionId),
    );

    // Filter out already assigned permissions
    const newPermissionIds = permissionIds.filter(
      (id) => !existingPermissionIds.has(id),
    );

    if (newPermissionIds.length === 0) {
      throw new ConflictException(
        'All specified permissions are already assigned with this type',
      );
    }

    // Create new user permission assignments
    const userPermissions = newPermissionIds.map((permissionId) => {
      const userPermission = new UserPermission();
      userPermission.userId = userId;
      userPermission.permissionId = permissionId;
      userPermission.type = type;
      userPermission.grantedAt = new Date();
      userPermission.expiresAt = expiresAt;
      return userPermission;
    });

    await this.userPermissionRepository.save(userPermissions);

    return this.findOneForTenant(tenantId || 1, userId);
  }

  /**
   * Remove permissions from a user
   *
   * @param userId - The user ID
   * @param permissionIds - Array of permission IDs to remove (empty array to clear all)
   * @param tenantId - Optional tenant ID for multi-tenant support
   * @returns Promise<User> - Updated user with permissions removed
   */
  async removePermissions(
    userId: number,
    permissionIds: number[],
    tenantId?: number,
  ): Promise<User> {
    // Verify user exists
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // If empty array, remove all user permissions
    if (permissionIds.length === 0) {
      await this.userPermissionRepository.delete({ userId });
    } else {
      // Remove specific permissions
      await this.userPermissionRepository.delete({
        userId,
        permissionId: In(permissionIds),
      });
    }

    return this.findOneForTenant(tenantId || 1, userId);
  }

  /**
   * Get user permissions
   *
   * @param userId - The user ID
   * @param tenantId - Optional tenant ID for multi-tenant support
   * @returns Promise<UserPermission[]> - Array of user permissions with full details
   */
  async getUserPermissions(
    userId: number,
    tenantId?: number,
  ): Promise<UserPermission[]> {
    // Verify user exists
    const user = await this.userRepository.findOne({
      where: tenantId ? { id: userId, tenantId } : { id: userId },
      relations: ['userPermissions', 'userPermissions.permission'],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.userPermissionRepository.find({
      where: { userId },
      relations: ['permission'],
      order: { grantedAt: 'DESC' },
    });
  }

  /**
   * Get effective permissions for a user
   *
   * Calculates effective permissions by combining role permissions with user-specific overrides.
   * DENY permissions take precedence over GRANT permissions.
   *
   * @param userId - The user ID
   * @returns Promise<string[]> - Array of effective permission slugs
   */
  async getEffectivePermissions(userId: number): Promise<string[]> {
    // Get user with roles and permissions
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: [
        'userRoles',
        'userRoles.role',
        'userRoles.role.rolePermissions',
        'userRoles.role.rolePermissions.permission',
        'userPermissions',
        'userPermissions.permission',
      ],
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Start with role-based permissions
    const rolePermissions = new Set<string>();
    user.userRoles?.forEach((userRole) => {
      userRole.role?.rolePermissions?.forEach((rolePermission) => {
        rolePermissions.add(rolePermission.permission.slug);
      });
    });

    // Apply user-specific GRANT permissions
    const userGrantPermissions = new Set<string>();
    const userDenyPermissions = new Set<string>();

    user.userPermissions?.forEach((userPermission) => {
      if (userPermission.type === 'GRANT') {
        userGrantPermissions.add(userPermission.permission.slug);
      } else if (userPermission.type === 'DENY') {
        userDenyPermissions.add(userPermission.permission.slug);
      }
    });

    // Combine permissions: Role + User GRANT - User DENY
    const effectivePermissions = new Set<string>();

    // Add role permissions
    rolePermissions.forEach((slug) => effectivePermissions.add(slug));

    // Add user GRANT permissions
    userGrantPermissions.forEach((slug) => effectivePermissions.add(slug));

    // Remove user DENY permissions (they take precedence)
    userDenyPermissions.forEach((slug) => effectivePermissions.delete(slug));

    // Filter out expired permissions
    const now = new Date();
    user.userPermissions?.forEach((userPermission) => {
      if (userPermission.expiresAt && userPermission.expiresAt < now) {
        if (userPermission.type === 'GRANT') {
          userGrantPermissions.delete(userPermission.permission.slug);
          effectivePermissions.delete(userPermission.permission.slug);
        } else if (userPermission.type === 'DENY') {
          userDenyPermissions.delete(userPermission.permission.slug);
        }
      }
    });

    return Array.from(effectivePermissions);
  }
}
