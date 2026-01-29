import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '@/entities/system/permission.entity';
import { RolePermission } from '@/entities/system/role-permission.entity';
import { UserRole } from '@/entities/system/user-role.entity';

/**
 * Service responsible for permission management and access control.
 *
 * Handles permission lookups and user permission checking.
 */
@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
    @InjectRepository(UserRole)
    private readonly userRoleRepository: Repository<UserRole>,
  ) {}

  /**
   * Retrieves all active permissions grouped by module.
   *
   * @returns Array of permissions
   */
  async findAll(): Promise<Permission[]> {
    return this.permissionRepository.find({
      where: { isActive: true },
      order: { module: 'ASC', resource: 'ASC', action: 'ASC' },
    });
  }

  /**
   * Finds a permission by its unique slug.
   *
   * @param slug - The permission slug (e.g., 'hris.employee.view')
   * @returns The permission or null if not found
   */
  async findBySlug(slug: string): Promise<Permission | null> {
    return this.permissionRepository.findOne({
      where: { slug, isActive: true },
    });
  }

  /**
   * Gets all permission slugs for a user by aggregating from their roles.
   *
   * @param userId - The user's ID
   * @returns Array of permission slugs
   */
  async getUserPermissions(userId: number): Promise<string[]> {
    // Get user's active roles
    const userRoles = await this.userRoleRepository.find({
      where: { userId },
      relations: ['role'],
    });

    if (userRoles.length === 0) {
      return [];
    }

    const roleIds = userRoles.map((ur) => ur.roleId);

    // Get permissions for those roles
    const rolePermissions = await this.rolePermissionRepository
      .createQueryBuilder('rp')
      .innerJoinAndSelect('rp.permission', 'permission')
      .where('rp.roleId IN (:...roleIds)', { roleIds })
      .andWhere('permission.isActive = :isActive', { isActive: true })
      .getMany();

    // Extract unique permission slugs
    const slugs = new Set<string>();
    for (const rp of rolePermissions) {
      slugs.add(rp.permission.slug);
    }

    return Array.from(slugs);
  }

  /**
   * Checks if a user has a specific permission.
   *
   * @param userId - The user's ID
   * @param permissionSlug - The permission slug to check
   * @returns True if user has the permission, false otherwise
   */
  async checkPermission(
    userId: number,
    permissionSlug: string,
  ): Promise<boolean> {
    const userPermissions = await this.getUserPermissions(userId);
    return userPermissions.includes(permissionSlug);
  }

  /**
   * Legacy method for backward compatibility with PermissionGuard.
   * Check if a user has permission to perform an action on a menu/resource.
   *
   * @param userId - The user's ID
   * @param menuIdOrCode - The menu ID or code (ignored in new implementation)
   * @param action - The action to check (ignored in new implementation)
   * @returns True - placeholder until full RBAC migration
   * @deprecated Use checkPermission() with slug-based permissions instead
   */
  hasPermission(
    userId: number,
    menuIdOrCode: number | string,
    action: string,
  ): Promise<boolean> {
    // TODO: Implement proper permission check using slug pattern
    // For now, return true to maintain backward compatibility
    void userId;
    void menuIdOrCode;
    void action;
    return Promise.resolve(true);
  }
}
