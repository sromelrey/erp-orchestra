# 🚀 Orchestra ERP: Master Project Plan

This document serves as the high-level roadmap for the Orchestra ERP system, detailing the completed foundations and the planned business modules (Epics).

---

## 🏗️ Phase 1: System Foundation & Security
*The core plumbing of the application. Everything built here is required for the business modules to function securely.*

### ✅ EPIC-01: Backend RBAC & Advanced Session Management
- **Status**: Completed
- **Focus**: Identity, Authorization, and JWT Security.
- **Key Features**:
  - `User`, `Role`, and `Permission` entities.
  - Slug-based endpoints protection (`@RequirePermissions`).
  - Strict Tenant-Scoped data isolation.
  - Active Session tracking and remote revocation (Hard/Soft session destruction).

### ✅ EPIC-02: Frontend RBAC & Portal Layout
- **Status**: Completed
- **Focus**: UX, Navigation Gating, and Admin Dashboards.
- **Key Features**:
  - `EntityManager` and `DataTable` standardized UI patterns.
  - Dynamic, permission-gated Sidebar navigation.
  - Centralized Admin dashboards for Users, Roles, and Active Sessions.
  - Smart redirection (Login loop prevention, Unauthorized boundaries).

---

## 🏗️ Phase 2: HR & Operations Core
Build the foundational operational modules that drive daily business logic.

- [ ] **EPIC-03: HRIS Core & Employee Management**
  - Departments, Designations, Branches
  - Employee Master Profile
- [ ] **EPIC-04: HRIS Attendance & Payroll**
  - Time Tracking & Timesheet Aggregation
  - Leave Management Workflows
  - Compensation, Deductions & Payslips
- [ ] **EPIC-05: Operations Master Data**
  - Material Master (Items, Stock levels)
  - Bill of Materials (BOM / Recipes)

---

## 📦 Phase 3: Operational Modules
*The modules that drive the actual day-to-day business tracking and supply chain.*

### 📋 EPIC-04: Inventory & Asset Management
- **Status**: Backlog
- **Focus**: Tracking physical items, goods, and company assets.
- **Key Features**:
  - `Item` master list (consumables, raw materials, fixed assets).
  - Multi-warehouse/branch stock tracking.
  - Asset Flow: Assigning laptops/vehicles to `Employees` (depends on EPIC-03).
  - Goods Receipt and Issuance workflows.

### 📋 EPIC-05: Operations & Procurement
- **Status**: Backlog
- **Focus**: Supply chain requests and vendor management.
- **Key Features**:
  - Purchase Requisitions (PR) workflow.
  - Vendor / Supplier master list.
  - Purchase Orders (PO) linked to Inventory receiving.
  - Approval Matrix (e.g., Department Heads approving PRs - depends on EPIC-03 hierarchy).

---

## 💰 Phase 4: Financial Operations
*The modules that track the flow of money, highly dependent on the operational modules.*

### 📋 EPIC-06: Timekeeping & Payroll
- **Status**: Backlog
- **Focus**: Compensating the workforce.
- **Key Features**:
  - Attendance tracking and Leave Management (depends on EPIC-03).
  - Dynamic payroll generation based on designations and attendance.
  - Payslip generation and portal viewing.

### 📋 EPIC-07: Finance & Accounting (Core)
- **Status**: Backlog
- **Focus**: Bookkeeping and financial health tracking.
- **Key Features**:
  - Chart of Accounts.
  - Accounts Payable (linked to EPIC-05 Procurement).
  - General Ledger and Journal Entries.
  - Basic Financial Reporting (P&L, Balance Sheet).

---

## 📈 Phase 5: Advanced Features & Analytics
*Future-proofing and scaling the ERP.*

### 📋 EPIC-08: Executive Dashboards & BI
- **Status**: Backlog
- **Focus**: Data visualization for C-suite and Management.
- **Key Features**:
  - Real-time widgets (Cash flow, Inventory valuation, Headcount).
  - Exportable custom reports (PDF/Excel).

### 📋 EPIC-09: Notifications & Workflow Automation
- **Status**: Backlog
- **Focus**: Proactive alerting and system intelligence.
- **Key Features**:
  - In-app notification center.
  - Email alerts for pending approvals (Leave requests, PRs).
  - Automated escalation rules.
