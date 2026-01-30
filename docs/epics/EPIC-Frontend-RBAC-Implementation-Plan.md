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

## Dependencies
- Backend EPIC-01 (STORY-001, STORY-002, STORY-004 completed)
- Backend STORY-005 (Session Management API - In Progress)
