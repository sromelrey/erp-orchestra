# EPIC-03: HRIS Core & Employee Management

| Field | Value |
|-------|-------|
| **Epic ID** | EPIC-03 |
| **Epic Name** | HRIS Core & Employee Management |
| **Status** | 📋 Planned |
| **Priority** | High |
| **Dependencies** | EPIC-01, EPIC-02 (RBAC & System Config) |

---

## 🎯 Purpose
Establish the foundational Human Resources Information System (HRIS). This epic provides the core organizational structure (Departments, Designations, Branches) and the central `Employee` entity. By separating this from Attendance and Payroll (EPIC-04), we ensure the master data and access control foundation is solid before handling time-series and financial calculations.

---

## 🏗️ Architecture & Entities

### Core Entities
1. **Department**: Logical groupings within the company (e.g., IT, Finance, HR).
2. **Designation**: Job titles and ranks (e.g., Software Engineer, Manager).
3. **Branch**: Physical or logical locations of the company operations.
4. **Employee**: The central business profile of a staff member. Forms a 1-to-1 relationship with the `User` entity (which handles authentication) but contains HR-specific data.

---

## 📝 Stories & Implementation Plan

### 📌 PHASE 1: Organizational Structure (Backend)

| Story ID | STORY-HR-001 |
|----------|--------------|
| **Name** | Organizational Master Data CRUD |
| **Type** | Backend |

**Description:**
Create the database entities, seeders, and REST API endpoints for organizational configuration.

**Tasks:**
- [x] Create `Department`, `Designation`, and `Branch` entities.
- [x] Add `tenant_id` to all entities for multi-tenant isolation.
- [x] Implement `CRUD` services and controllers for each entity.
- [x] Protect all endpoints using `PermissionsGuard` (e.g., `hris.department.manage`).
- [x] Update `permissions.seeder.ts` with new HRIS permission slugs.

---

### 📌 PHASE 2: Organizational Structure (Frontend)

| Story ID | STORY-HR-002 |
|----------|--------------|
| **Name** | Organizational Management UI |
| **Type** | Frontend |

**Description:**
Build the UI interfaces for HR administrators to configure the company structure. Let's utilize the established `EntityManager` pattern.

**Tasks:**
- [ ] Add "HR Settings" or "Organization" group to `sidebar.config.ts`.
- [ ] Create RTK Query APIs: `departmentsApi.ts`, `designationsApi.ts`, `branchesApi.ts`.
- [ ] Create UI management pages using `EntityManager`:
  - `app/hris/departments/page.tsx`
  - `app/hris/designations/page.tsx`
  - `app/hris/branches/page.tsx`
- [ ] Protect routes using `<PermissionGuard>`.

---

### 📌 PHASE 3: Employee Master Data (Backend)

| Story ID | STORY-HR-003 |
|----------|--------------|
| **Name** | Employee Entity & Relationships |
| **Type** | Backend |

**Description:**
Implement the core `Employee` profile that links a user account to their HR data, department, and designation.

**Tasks:**
- [ ] Create `Employee` entity with relationships:
  - `user_id` -> `SystemUser` (1-to-1)
  - `department_id` -> `Department`
  - `designation_id` -> `Designation`
  - `branch_id` -> `Branch`
  - `manager_id` -> `Employee` (Self-referential for reporting hierarchy)
- [ ] Add core HR fields: `hire_date`, `employee_code`, `status`, `emergency_contact`, etc.
- [ ] Implement `EmployeeService` with CRUD operations, ensuring tenant isolation.
- [ ] Ensure that creating an Employee optionally creates the system `User` account simultaneously.

---

### 📌 PHASE 4: Employee Management (Frontend)

| Story ID | STORY-HR-004 |
|----------|--------------|
| **Name** | Employee Directory & Profiles |
| **Type** | Frontend |

**Description:**
Provide a comprehensive interface for HR to manage staff members and view the company directory.

**Tasks:**
- [ ] Create `employeeApi.ts` in RTK Query.
- [ ] Create the **Employee Directory** table view (`app/hris/employees/page.tsx`).
- [ ] Create the **Add/Edit Employee Form**:
  - Personal Information section.
  - Job Information section (Dropdowns for Department, Designation, Manager).
  - System Access section (Toggle to auto-create user account and assign roles).
- [ ] Create **Employee Profile View**: A detailed page showing the employee's full file.

---

## 🔒 Security & RBAC Requirements

To implement this Epic, the following new permission slugs must be defined and seeded in the database:

**HRIS Read Permissions:**
- `hris.department.view`
- `hris.designation.view`
- `hris.branch.view`
- `hris.employee.view`

**HRIS Write/Manage Permissions:**
- `hris.department.manage`
- `hris.designation.manage`
- `hris.branch.manage`
- `hris.employee.manage`

---

## ✅ Definition of Done
1. Backend entities are fully migrated and synced to the database.
2. All endpoints require explicit permissions via `@RequirePermissions()`.
3. HR Administrators can create Departments, Designations, and Branches from the Portal UI.
4. HR Administrators can onboard a new Employee, link them to an Organizational setup, and automatically provision their portal login (`User` entity).
