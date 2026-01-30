# EPIC-02: Frontend RBAC & Session Management

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-02 |
| **Epic Name** | Frontend RBAC & Session Management |
| **Status** | 📋 Planned |
| **Priority** | High |
| **Platform** | Portal (`portal.orchestra.com`) |

---

## Purpose

Implement the frontend consumption of the RBAC system, enabling permission-based UI element visibility, route protection, and admin management interfaces.

---

## Stories

### STORY-F001: Permission State & Logic

| Field | Value |
|-------|-------|
| **Story ID** | STORY-F001 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Description:**
Update the authentication store to manage user permissions and provide hooks for checking access.

**Tasks:**
- [ ] Update `authSlice` to include `permissions: string[]` in the state.
- [ ] Update `authApi` login/profile fetch to retrieve permissions.
- [ ] Create `usePermission(slug)` custom hook.
- [ ] Create `useRole(roleCode)` custom hook.

**Files to Modify:**
- `store/slices/authSlice.ts`
- `store/api/authApi.ts`
- `hooks/usePermission.ts` (NEW)

---

### STORY-F002: Route Guards & Protection

| Field | Value |
|-------|-------|
| **Story ID** | STORY-F002 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Description:**
Protect generic pages and routes based on required permissions.

**Tasks:**
- [ ] Create `PermissionGuard` wrapper component.
- [ ] Integrate granular permission checks into Middleware (optional/advanced).

**Usage Example:**
```tsx
<PermissionGuard required="hris.employee.view">
  <EmployeeListPage />
</PermissionGuard>
```

**Files to Create:**
- `components/guards/PermissionGuard.tsx`

---

### STORY-F003: UI Components (Directives)

| Field | Value |
|-------|-------|
| **Story ID** | STORY-F003 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Description:**
Create reusable components to conditionally render UI elements based on permissions (e.g., hiding "Delete" buttons).

**Tasks:**
- [ ] Create `<Can I="action" a="resource">` or `<HasPermission slug="...">` component.

**Usage Example:**
```tsx
<HasPermission slug="hris.employee.delete">
  <Button variant="destructive">Delete Employee</Button>
</HasPermission>
```

**Files to Create:**
- `components/auth/HasPermission.tsx`

---

### STORY-F004: Role Management UI

| Field | Value |
|-------|-------|
| **Story ID** | STORY-F004 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Description:**
Interface for admins to manage roles and assign permissions.

**Tasks:**
- [ ] **Role List Page**: Table of roles with "Edit" / "Delete" actions.
- [ ] **Role Form**: Modal/Page to create/edit role details.
- [ ] **Permission Matrix**: Tree/Grid UI to assign permissions to a role (using `POST /roles/:id/permissions`).

**Files to Create:**
- `app/admin/roles/page.tsx`
- `app/admin/roles/components/RoleTable.tsx`
- `app/admin/roles/components/PermissionAssigner.tsx`

---

### STORY-F005: Session Management UI

| Field | Value |
|-------|-------|
| **Story ID** | STORY-F005 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Description:**
UI for users to view their active sessions and for admins to revoke suspicious sessions.

**Tasks:**
- [ ] **My Sessions Page**: List current user's active sessions (Device, IP, Last Active) with "Revoke" button.
- [ ] **Admin Session View**: View active sessions for a specific user.

**Files to Create:**
- `app/profile/sessions/page.tsx`
- `app/admin/users/[id]/sessions/page.tsx`

---

---

### STORY-F006: Tenant User Management UI

| Field | Value |
|-------|-------|
| **Story ID** | STORY-F006 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Description:**
UI for Tenant Admins to invite/manage users and assign them roles.

**Tasks:**
- [ ] **User List Page**: List users belonging to the tenant.
- [ ] **User Form**: Create/Edit user (First Name, Last Name, Email, Role Selection).
- [ ] **Role Selection**: Dropdown showing available roles (System + Tenant Custom).

**Files to Create:**
- `app/admin/users/page.tsx`
- `app/admin/users/components/UserForm.tsx`

---

### STORY-F007: Tenant Role Management UI

| Field | Value |
|-------|-------|
| **Story ID** | STORY-F007 |
| **Status** | 📋 Planned |
| **Type** | Frontend |

**Description:**
UI for Tenant Admins to manage their custom roles.

**Tasks:**
- [ ] **Role List Page**: Show only roles available to this tenant.
- [ ] **Role Editor**: Allow creating custom roles with permissions.

**Files to Create:**
- `app/admin/roles/page.tsx` (Update to handle tenant context)

---

## Dependencies
- Backend EPIC-01 (STORY-001, STORY-002, STORY-004, STORY-005, STORY-007, STORY-008)
- Backend STORY-006 (Double-Gating)
