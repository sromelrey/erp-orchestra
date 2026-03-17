# 🚀 Orchestra ERP: Master Project Plan

This document serves as the high-level roadmap for the Orchestra ERP system, detailing the completed foundations and the planned business modules (Epics).

---

## 🏗️ Phase 1: System Foundation & Security
*The core plumbing of the application. Everything built here is required for the business modules to function securely.*

### ✅ EPIC-01: Role-Based Access Control (RBAC)
- **Status**: Completed
- **Focus**: Complete RBAC system with frontend integration.
- **Key Features**:
  - ✅ Backend RBAC: Entities, guards, decorators, and APIs
  - ✅ Frontend RBAC: Permission hooks, guards, UI components
  - ✅ Advanced Permission Management: Modern SaaS-style interface
  - ✅ Session Management: Device tracking and revocation
  - ✅ Multi-Tenant Support: Tenant-scoped user/role management
  - ✅ Double-Gating Security: Feature + permission access control
  - 📋 Future: Navigation menu integration (low priority)

**Documentation**: See [EPIC-01-RBAC.md](./epics/EPIC-01-RBAC.md) for complete implementation details.

---

## 🏗️ Phase 2: HR & Operations Core
Build the foundational operational modules that drive daily business logic.

- ✅ **EPIC-02: HRIS Core & Employee Management** (delivered)
  - Departments, Designations, Branches
  - Employee Master Profile
- ✅ **EPIC-03: HRIS Attendance & Payroll** (delivered; see EPIC-04 HRIS doc for payroll/attendance)
  - Time Tracking & Timesheet Aggregation
  - Leave Management Workflows
  - Compensation, Deductions & Payslips
- 🚧 **EPIC-05: HRIS API Completion** (partially delivered; parked)
  - Done: import/export entities, migrations, permissions, endpoints scaffold
  - Pending (parked): reporting/analytics, import/export workers & FilesService, notifications/webhooks, audit trail, API v2/docs (see tech-debt)
- � **EPIC-04: Operations Master Data** (in progress; ~80% complete)
  - Material Master (Items, Stock levels) - ✅ Complete
  - Warehouse & Location Management - ✅ Complete
  - Stock Ledger & Movements - ✅ Complete
  - Bill of Materials (BOM) - 🚧 Entities done, APIs pending
  - Costing & Availability - 📋 Pending

---

## 📦 Phase 3: Operational Modules
*The modules that drive the actual day-to-day business tracking and supply chain.*

### 📋 EPIC-07: Inventory & Asset Management
- **Status**: Backlog
- **Focus**: Tracking physical items, goods, and company assets.
- **Key Features**:
  - `Item` master list (consumables, raw materials, fixed assets).
  - Multi-warehouse/branch stock tracking.
  - Asset Flow: Assigning laptops/vehicles to `Employees` (depends on EPIC-03).
  - Goods Receipt and Issuance workflows.

### 📋 EPIC-08: Operations & Procurement
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

### 📋 EPIC-09: Timekeeping & Payroll
- **Status**: Backlog
- **Focus**: Compensating the workforce.
- **Key Features**:
  - Attendance tracking and Leave Management (depends on EPIC-03).
  - Dynamic payroll generation based on designations and attendance.
  - Payslip generation and portal viewing.

### 📋 EPIC-10: Finance & Accounting (Core)
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

### 📋 EPIC-11: Executive Dashboards & BI
- **Status**: Backlog
- **Focus**: Data visualization for C-suite and Management.
- **Key Features**:
  - Real-time widgets (Cash flow, Inventory valuation, Headcount).
  - Exportable custom reports (PDF/Excel).

### 📋 EPIC-12: Notifications & Workflow Automation
- **Status**: Backlog
- **Focus**: Proactive alerting and system intelligence.
- **Key Features**:
  - In-app notification center.
  - Email alerts for pending approvals (Leave requests, PRs).
  - Automated escalation rules.
