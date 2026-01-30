import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Role } from '@/entities/system/role.entity';
import { RolePermission } from '@/entities/system/role-permission.entity';
import { Permission } from '@/entities/system/permission.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

/**
 * Service responsible for role management and permission assignment.
 */
@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  /**
   * Retrieves all roles available to a tenant.
   * Includes custom roles and system roles.
   *
   * @param tenantId - Optional tenant ID to filter by
   */
  async findAll(tenantId?: number): Promise<Role[]> {
    const query = this.roleRepository
      .createQueryBuilder('role')
      .where('role.tenantId = :tenantId OR role.tenantId IS NULL', {
        tenantId,
      });

    return query.orderBy('role.name', 'ASC').getMany();
  }

  /**
   * Retrieves a role by ID with its assigned permissions, scoped to tenant.
   *
   * @param id - Role ID
   * @param tenantId - Optional tenant ID for scoping
   */
  async findOne(id: number, tenantId?: number): Promise<Role> {
    const query = this.roleRepository
      .createQueryBuilder('role')
      .leftJoinAndSelect('role.rolePermissions', 'rolePermissions')
      .leftJoinAndSelect('rolePermissions.permission', 'permission')
      .where('role.id = :id', { id });

    if (tenantId !== undefined) {
      query.andWhere('(role.tenantId = :tenantId OR role.tenantId IS NULL)', {
        tenantId,
      });
    }

    const role = await query.getOne();

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  /**
   * Creates a new role for a tenant.
   *
   * @param dto - Role creation data
   * @param tenantId - Tenant ID to associate with the role
   */
  async create(dto: CreateRoleDto, tenantId?: number): Promise<Role> {
    const role = this.roleRepository.create({
      ...dto,
      tenantId,
      isSystemRole: false, // Custom roles are never system roles
    });
    return this.roleRepository.save(role);
  }

  /**
   * Updates an existing role, scoped to tenant.
   */
  async update(
    id: number,
    dto: UpdateRoleDto,
    tenantId?: number,
  ): Promise<Role> {
    const role = await this.findOne(id, tenantId);
    Object.assign(role, dto);
    return this.roleRepository.save(role);
  }

  /**
   * Soft deletes a role, scoped to tenant.
   */
  async remove(id: number, tenantId?: number): Promise<void> {
    const role = await this.findOne(id, tenantId);
    await this.roleRepository.softRemove(role);
  }

  /**
   * Assigns permissions to a role.
   *
   * @param roleId - The role ID
   * @param permissionIds - Array of permission IDs to assign
   * @param tenantId - Optional tenant ID for scoping
   * @returns The updated role with permissions
   */
  async assignPermissions(
    roleId: number,
    permissionIds: number[],
    tenantId?: number,
  ): Promise<Role> {
    await this.findOne(roleId, tenantId); // Validate role exists and belongs to tenant

    // Validate permissions exist
    const permissions = await this.permissionRepository.find({
      where: { id: In(permissionIds) },
    });

    if (permissions.length !== permissionIds.length) {
      throw new NotFoundException('One or more permissions not found');
    }

    // Create role-permission links (ignore duplicates)
    for (const permissionId of permissionIds) {
      const existing = await this.rolePermissionRepository.findOne({
        where: { roleId, permissionId },
      });

      if (!existing) {
        const rolePermission = this.rolePermissionRepository.create({
          roleId,
          permissionId,
        });
        await this.rolePermissionRepository.save(rolePermission);
      }
    }

    return this.findOne(roleId, tenantId);
  }

  /**
   * Removes permissions from a role.
   *
   * @param roleId - The role ID
   * @param permissionIds - Array of permission IDs to remove
   * @returns The updated role with remaining permissions
   */
  async removePermissions(
    roleId: number,
    permissionIds: number[],
    tenantId?: number,
  ): Promise<Role> {
    await this.findOne(roleId, tenantId); // Verify role exists and belongs to tenant

    await this.rolePermissionRepository.delete({
      roleId,
      permissionId: In(permissionIds),
    });

    return this.findOne(roleId, tenantId);
  }
}
