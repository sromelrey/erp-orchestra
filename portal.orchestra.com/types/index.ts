export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    nextCursor: string | number | null;
    total?: number;
  };
}

export interface Permission {
  id: number;
  module: string;
  resource: string;
  action: string;
  slug: string;
  description?: string;
  isActive: boolean;
}

export interface Role {
  id: number;
  name: string;
  code: string;
  description: string;
  isSystemRole?: boolean;
  rolePermissions?: Array<{
    permission: Permission;
  }>;
}

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  status: 'ACTIVE' | 'INACTIVE';
  tenantId?: number;
  userRoles?: Array<{
    role?: Role;
  }>;
  userPermissions?: UserPermission[];
}

export interface CreateUserRequest {
  email: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export interface UpdateUserRequest extends Partial<Omit<User, 'id'>> {
  id: number;
  password?: string;
}

export interface UserPermission {
  id: number;
  userId: number;
  permissionId: number;
  type: 'GRANT' | 'DENY';
  expiresAt?: string;
  grantedAt: string;
  permission: Permission;
}

export interface Branch {
  id: number;
  name: string;
  code: string;
  address?: string;
  phone?: string;
  email?: string;
  isActive: boolean;
  tenantId: number;
}

export interface Department {
  id: number;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  tenantId: number;
}

export interface Designation {
  id: number;
  name: string;
  code: string;
  description?: string;
  isActive: boolean;
  tenantId: number;
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  employeeCode?: string;
  hireDate?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'ARCHIVED';
  emergencyContact?: string;
  userId?: number;
  user?: User;
  departmentId?: number;
  department?: Department;
  designationId?: number;
  designation?: Designation;
  branchId?: number;
  branch?: Branch;
  managerId?: number;
  manager?: Employee;
  tenantId: number;
}

export interface AuthUser {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  tenantId?: number;
  isSystemAdmin?: boolean;
  roles: string[];
  permissions: string[];
}

export type AuthResponse = AuthUser;

export interface LoginRequest {
  email: string;
  password?: string;
}

// Re-export Material types from API
export type {
  Material,
  MaterialType,
  CreateMaterialRequest,
  UpdateMaterialRequest,
  MaterialsQueryParams,
} from '@/store/api/materialsApi';

// Export error types
export type { ApiError } from '@/types/errors';
export { isApiError, getErrorMessage } from '@/types/errors';
