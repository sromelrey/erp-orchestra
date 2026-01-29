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
   * Retrieves all roles.
   */
  async findAll(): Promise<Role[]> {
    return this.roleRepository.find({
      order: { name: 'ASC' },
    });
  }

  /**
   * Retrieves a role by ID with its assigned permissions.
   */
  async findOne(id: number): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  /**
   * Creates a new role.
   */
  async create(dto: CreateRoleDto): Promise<Role> {
    const role = this.roleRepository.create(dto);
    return this.roleRepository.save(role);
  }

  /**
   * Updates an existing role.
   */
  async update(id: number, dto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);
    Object.assign(role, dto);
    return this.roleRepository.save(role);
  }

  /**
   * Soft deletes a role.
   */
  async remove(id: number): Promise<void> {
    const role = await this.findOne(id);
    await this.roleRepository.softRemove(role);
  }

  /**
   * Assigns permissions to a role.
   *
   * @param roleId - The role ID
   * @param permissionIds - Array of permission IDs to assign
   * @returns The updated role with permissions
   */
  async assignPermissions(
    roleId: number,
    permissionIds: number[],
  ): Promise<Role> {
    await this.findOne(roleId); // Validate role exists

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

    return this.findOne(roleId);
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
  ): Promise<Role> {
    await this.findOne(roleId); // Verify role exists

    await this.rolePermissionRepository.delete({
      roleId,
      permissionId: In(permissionIds),
    });

    return this.findOne(roleId);
  }
}
