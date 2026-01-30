# EPIC-01: Role-Based Access Control & Advanced Session Management

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-01 |
| **Epic Name** | Role-Based Access Control & Advanced Session Management |
| **Status** | � In Progress |
| **Priority** | High |
| **Sprint** | Sprint 1-2 |
| **Story Points** | 42 |

---

## Purpose

Implement a comprehensive RBAC system with flexible role/permission management and secure session handling with device tracking and selective revocation.

---

## Stories

### STORY-001: Permission System Foundation

| Field | Value |
|-------|-------|
| **Story ID** | STORY-001 |
| **Status** | ✅ Done |
| **Assignee** | Backend |
| **Story Points** | 5 |

**Description:**  
As a developer, I need a permission system so that access control can be enforced throughout the application.

#### Sub-Task: BE-001-1 – Update Permission Entity

| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-001-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes to Make:**
- Update `Permission` entity with `feature_id` (nullable FK to `SystemModule`) for double-gating.
- Ensure `slug` column is unique for code-based lookups.
- Add `is_active` column for soft-disabling permissions.

**Permission Entity Structure:**
```typescript
@Entity({ name: 'permissions', schema: 'system' })
export class Permission extends CommonEntity {
  @Column({ name: 'feature_id', type: 'int', nullable: true })
  featureId?: number | null; // Links to SystemModule for double-gating

  @Column({ type: 'varchar', length: 50 })
  module: string; // e.g., 'hris', 'payroll'

  @Column({ type: 'varchar', length: 50 })
  resource: string; // e.g., 'employee', 'leave_request'

  @Column({ type: 'varchar', length: 50 })
  action: string; // e.g., 'view', 'create', 'approve'

  @Column({ type: 'varchar', length: 100, unique: true })
  slug: string; // e.g., 'hris.employee.create'

  @Column({ type: 'boolean', name: 'is_active', default: true })
  isActive: boolean;

  @ManyToOne(() => SystemModule, { nullable: true })
  @JoinColumn({ name: 'feature_id' })
  feature?: SystemModule;
}
```

**Files to Modify:**

| File | Change |
|------|--------|
| `api.orchestra.com/src/entities/system/permission.entity.ts` | [MODIFY] Add `featureId`, `isActive` |

---

#### Sub-Task: BE-001-2 – Permission Seeder

| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-001-2 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes to Make:**
- Create `permissions.seeder.ts` to seed standard permissions per module.
- Use UPSERT logic to avoid duplicates.

**Example Seed Permissions:**

| Module | Resource | Action | Slug |
|--------|----------|--------|------|
| hris | employee | view | `hris.employee.view` |
| hris | employee | create | `hris.employee.create` |
| hris | employee | update | `hris.employee.update` |
| hris | employee | delete | `hris.employee.delete` |
| hris | leave_request | view | `hris.leave_request.view` |
| hris | leave_request | create | `hris.leave_request.create` |
| hris | leave_request | approve | `hris.leave_request.approve` |
| system | role | view | `system.role.view` |
| system | role | manage | `system.role.manage` |
| system | user | view | `system.user.view` |
| system | user | manage | `system.user.manage` |

**Files to Create:**

| File | Change |
|------|--------|
| `api.orchestra.com/src/database/seeders/permissions.seeder.ts` | [NEW] |

---

#### Sub-Task: BE-001-3 – Permission Service & Controller

| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-001-3 |
| **Status** | ✅ Done (caching deferred) |
| **Type** | Backend |

**Changes to Make:**
- Implement `PermissionService.findAll()`: Return all permissions grouped by module.
- Implement `PermissionService.getUserPermissions(userId)`: Aggregate from roles + direct overrides.
- Implement `PermissionService.checkPermission(userId, slug)`: Return boolean.
- Add caching layer for performance.
- Create `PermissionController` with list endpoint.

**Files to Modify/Create:**

| File | Change |
|------|--------|
| `api.orchestra.com/src/modules/system/permissions/permission.service.ts` | [MODIFY] |
| `api.orchestra.com/src/modules/system/permissions/permission.controller.ts` | [NEW] |
| `api.orchestra.com/src/modules/system/permissions/permission.module.ts` | [MODIFY] Add TypeORM imports |

---

### STORY-002: RBAC Entities & Role-Permission Linking

| Field | Value |
|-------|-------|
| **Story ID** | STORY-002 |
| **Status** | ✅ Done |
| **Assignee** | Backend |
| **Story Points** | 5 |

**Description:**  
As a developer, I need RBAC junction tables so that roles can be assigned permissions and users can have direct permission overrides.

#### Sub-Task: BE-002-1 – User Permission Entity

| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-002-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes to Make:**
- Create `UserPermission` entity for direct user-level permission overrides (grant or deny).

**Files to Create:**

| File | Change |
|------|--------|
| `api.orchestra.com/src/entities/system/user-permission.entity.ts` | [NEW] |

---

#### Sub-Task: BE-002-2 – Update Standard Roles Seeder

| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-002-2 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes to Make:**
- Update `standard-roles.seeder.ts` to assign default permissions to `ADMIN` role via `role_permissions` table.

**Files to Modify:**

| File | Change |
|------|--------|
| `api.orchestra.com/src/database/seeders/standard-roles.seeder.ts` | [MODIFY] |

---

### STORY-003: Permission Guards & Decorators

| Field | Value |
|-------|-------|
| **Story ID** | STORY-003 |
| **Status** | ✅ Done |
| **Assignee** | Backend |
| **Story Points** | 5 |

**Description:**  
As a developer, I need guards and decorators to enforce permissions on routes.

#### Sub-Task: BE-003-1 – Permission Decorator & Guard

| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-003-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes to Make:**
- Create `@RequirePermissions('slug')` decorator.
- Create `PermissionsGuard` that calls `PermissionService.checkPermission()`.

**Files to Create:**

| File | Change |
|------|--------|
| `api.orchestra.com/src/decorators/require-permissions.decorator.ts` | [NEW] |
| `api.orchestra.com/src/guards/permissions.guard.ts` | [NEW] |

---

### STORY-004: Role Management API

| Field | Value |
|-------|-------|
| **Story ID** | STORY-004 |
| **Status** | ✅ Done |
| **Assignee** | Backend |
| **Story Points** | 8 |

**Description:**  
As an admin, I want to manage roles and assign permissions dynamically.

#### Sub-Task: BE-004-1 – Role CRUD & Permission Assignment

| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-004-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes to Make:**
- Expand `RoleService` with full CRUD.
- Add `assignPermissionsToRole(roleId, permissionIds[])`.
- Add `getRoleWithPermissions(roleId)`.

**Files to Modify:**

| File | Change |
|------|--------|
| `api.orchestra.com/src/modules/system/roles/role.service.ts` | [MODIFY] |
| `api.orchestra.com/src/modules/system/roles/role.controller.ts` | [MODIFY] |
| `api.orchestra.com/src/modules/system/roles/dto/assign-permissions.dto.ts` | [NEW] |

---

### STORY-005: Session Management Enhancements

| Field | Value |
|-------|-------|
| **Story ID** | STORY-005 |
| **Status** | ✅ Done |
| **Assignee** | Backend |
| **Story Points** | 8 |

**Description:**  
As a user, I want secure session management so that I can see and revoke my active sessions.

#### Sub-Task: BE-005-1 – Session Service Enhancements

| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-005-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes to Make:**
- Add `revokeSession(sessionId)` method.
- Add `revokeAllSessions(userId)` method.
- Add `getUserActiveSessions(userId)` for listing.

**Files to Modify:**

| File | Change |
|------|--------|
| `api.orchestra.com/src/modules/system/sessions/session.service.ts` | [MODIFY] |
| `api.orchestra.com/src/modules/system/sessions/session.controller.ts` | [NEW] |

---

#### Sub-Task: BE-005-2 – Auth Flow Integration

| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-005-2 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes to Make:**
- Update `AuthService.logout()` to call `sessionService.revokeSession()`.
- Update JWT guard to validate session `status === 'ACTIVE'`.

**Files to Modify:**

| File | Change |
|------|--------|
| `api.orchestra.com/src/modules/system/auth/auth.service.ts` | [MODIFY] |
| `api.orchestra.com/src/guards/jwt-auth.guard.ts` | [MODIFY] |

---

### STORY-006: Feature + Permission Double-Gating

| Field | Value |
|-------|-------|
| **Story ID** | STORY-006 |
| **Status** | ✅ Done |
| **Assignee** | Backend |
| **Story Points** | 3 |

**Description:**  
As the system, I need to check both tenant feature access AND user permissions.

#### Sub-Task: BE-006-1 – Combined Access Guard

| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-006-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes to Make:**
- Create `CombinedAccessGuard` (checks tenant feature then user permission).
- Create `@RequireAccess({ feature, permission })` decorator.

**Files to Create:**

| File | Change |
|------|--------|
| `api.orchestra.com/src/guards/combined-access.guard.ts` | [NEW] |
| `api.orchestra.com/src/decorators/require-access.decorator.ts` | [NEW] |

**Example Usage:**
```typescript
@Controller('leave-requests')
export class LeaveRequestController {
  @Post()
  @UseGuards(JwtAuthGuard, CombinedAccessGuard)
  @RequireAccess({
    feature: 'HRIS_LEAVE',
    permission: 'hris.leave_request.create'
  })
  async create() { /* ... */ }
}
```

---

### STORY-007: Tenant-Scoped Role Management

| Field | Value |
|-------|-------|
| **Story ID** | STORY-007 |
| **Status** | ✅ Done |
| **Assignee** | Backend |
| **Story Points** | 5 |

**Description:**
As a Tenant Admin, I need to manage MY custom roles without seeing other tenants' roles or system roles that don't apply to me.

#### Sub-Task: BE-007-1 – Scope Role Service to Tenant

| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-007-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes to Make:**
- Update `RoleService.findAll(tenantId)` to filter by tenant OR system default roles.
- Update `RoleService.create` to strictly attach `tenantId` from the authenticated session.
- Update `RoleService.assignPermissions` to verify that the role belongs to the requestor's tenant.

**Files to Modify:**
| File | Change |
|------|--------|
| `api.orchestra.com/src/modules/system/roles/role.service.ts` | [MODIFY] |

---

### STORY-008: Tenant User Management

| Field | Value |
|-------|-------|
| **Story ID** | STORY-008 |
| **Status** | ✅ Done |
| **Assignee** | Backend |
| **Story Points** | 8 |

**Description:**
As a Tenant Admin, I want to create new users and assign them roles so that I can onboard my team.

#### Sub-Task: BE-008-1 – Tenant User CRUD

| Field | Value |
|-------|-------|
| **Sub-Task ID** | BE-008-1 |
| **Status** | ✅ Done |
| **Type** | Backend |

**Changes to Make:**
- Create `UsersController` (or update existing) with endpoints for Tenant Admins: `GET /users`, `POST /users`, `PUT /users/:id`.
- Ensure `POST /users` creates user with requestor's `tenantId`.
- Ensure role assignment during creation/update validates that the Role ID belongs to the tenant.

**Files to Modify:**
| File | Change |
|------|--------|
| `api.orchestra.com/src/modules/system/users/user.controller.ts` | [NEW/MODIFY] |
| `api.orchestra.com/src/modules/system/users/user.service.ts` | [MODIFY] |

---

## 🧪 Testing Plan

### HTTP Client Tests (`api.orchestra.com/requests/rbac.http`)

```http
@API_BASE_URL = http://localhost:3000/api
@AUTH_TOKEN = {{adminLogin.response.body.accessToken}}

### 1. Login as Admin
# @name adminLogin
POST {{API_BASE_URL}}/auth/login
Content-Type: application/json

{
    "email": "admin@orchestra.com",
    "password": "Admin123!"
}

###

### 2. List All Permissions
GET {{API_BASE_URL}}/system/permissions
Authorization: Bearer {{AUTH_TOKEN}}

###

### 3. Check Permission (Dev Utility)
POST {{API_BASE_URL}}/system/permissions/check
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json

{
    "permission": "hris.employee.view"
}

###

### 4. Create Custom Role
POST {{API_BASE_URL}}/system/roles
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json

{
    "name": "HR Junior",
    "code": "HR_JR",
    "description": "Limited HR access"
}

###

### 5. Assign Permissions to Role
POST {{API_BASE_URL}}/system/roles/{{roleId}}/permissions
Authorization: Bearer {{AUTH_TOKEN}}
Content-Type: application/json

{
    "permissionIds": [1, 2, 3]
}

###

### 6. Get User Active Sessions
GET {{API_BASE_URL}}/system/sessions
Authorization: Bearer {{AUTH_TOKEN}}

###

### 7. Revoke Session
DELETE {{API_BASE_URL}}/system/sessions/{{sessionId}}
Authorization: Bearer {{AUTH_TOKEN}}
```

---

## Dependencies

| Type | Dependencies |
|------|--------------|
| **Depends On** | Auth module (existing) |
| **Blocks** | All future feature modules (RBAC required for access control) |

---

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Hash refresh tokens in session | Never store sensitive tokens in plaintext |
| Session per device | Allow users to see/revoke individual devices |
| Permission caching | RBAC checks are expensive; cache aggressively |
| Slug-based permission checks | Code uses `hris.employee.view` not IDs for readability |
| Feature + Permission gating | Double-layer security: company tier + user role |
| Tenant-Scoped Roles | Prevent tenants from seeing or modifying each other's custom roles |

---

## Implementation Order

1. **STORY-001**: Permission System Foundation (entity, seeder, service)
2. **STORY-002**: RBAC Entities & Role-Permission Linking
3. **STORY-003**: Permission Guards & Decorators
4. **STORY-004**: Role Management API
5. **STORY-005**: Session Management Enhancements
6. **STORY-006**: Feature + Permission Double-Gating
7. **STORY-007**: Tenant-Scoped Role Management
8. **STORY-008**: Tenant User Management
