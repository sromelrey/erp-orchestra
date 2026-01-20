# Orchestrator ERP

Orchestrator is a **modular and affordable ERP system** designed for small to medium enterprises. It integrates core operational, financial, and human resource modules into a scalable architecture with **portal-based RBAC** and separate databases for each module.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Module Features](#module-features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Authentication & RBAC](#authentication--rbac)
- [License](#license)

---

## Overview

Orchestrator is designed to be modular, scalable, and easy to maintain:

- **Unified Portal Experience**: Users and Company Admins share the same portal with permission-based views.
- **Dedicated System Admin**: Separate console for tenant management and global system configuration.
- **Integrated Core Operations**: Seamless flow from raw materials to final sales.
- **Financial Intelligence**: Real-time cash flow and financial reporting.
- **Strategic Oversight**: High-level dashboards and task-based execution.
- **Separate Databases**: Per-module database architecture for scalability and maintainability.

---

## Architecture

```bash
erp-orchestra/
├── admin.orchestra.com       # Super Admin Console (Tenant mgmt, Billing, System Config)
├── api.orchestra.com         # Backend API (NestJS, modular services)
├── core-orchestra.com        # Shared core (UI components, utilities)
├── [portal.orchestra.com/](https://portal.orchestra.com/)     # Main User Portal (The ERP System)
│   ├── Operations & Inventory/
│   │   ├── Material Master          # Item & SKU central database
│   │   ├── Bill of Materials (BOM)  # Manufacturing recipes
│   │   ├── Procurement              # Vendor ordering
│   │   ├── Goods Receipt (GR)       # Inbound inventory log
│   │   ├── Sales Order (SO)         # Customer commitments
│   │   └── Goods Issue (GI)         # Outbound shipping log
│   ├── Finance & Accounting/
│   │   ├── Sales Invoice            # Revenue recording
│   │   ├── Accounts Payable (AP)    # Expense tracking
│   │   ├── Financial Reporting      # Daily analytics
│   │   └── Cash Flow Analysis       # Real-time cash logs
│   ├── Management & Strategy/
│   │   ├── Project Management       # Kanban & tasks
│   │   └── Executive Dashboard      # Metrics & visual goals
│   ├── HRIS/
│   │   ├── Employee                 # Staff records
│   │   ├── TimeSheets               # Attendance tracking
│   │   └── Payroll                  # Compensation management
│   └── RBAC & Settings/             # Company Admin Settings
│       ├── User Management          # Add/Invite employees
│       ├── Roles & Permissions      # Assign access (e.g., "Warehouse View")
│       └── Company Profile          # Logo, Tax ID, Address settings
└── README.md

```

---

## Module Features

| Module | Features Included | Primary Goal |
| --- | --- | --- |
| **Operations** | Material Master, BOM, Procurement, GR, SO, GI | Manage the lifecycle of physical goods and manufacturing. |
| **Finance** | Invoicing, AP, Reporting, Cash Flow | Maintain financial health and audit-ready transaction logs. |
| **Management** | Kanban, Project Tasks, Dashboard | Align daily tasks with long-term business targets. |
| **HRIS** | Employee Data, TimeSheets, Payroll | Manage the workforce and labor cost allocation. |
| **RBAC (Portal)** | User Mgmt, Roles | Allow Company Admins to manage their own employees' access. |
| **Admin Console** | Tenants, Billing, Global Logs | (Separate App) For the System Owner to manage subscribers. |

---

## Tech Stack

* **Frontend**: Next.js (Portal and Admin are separate Next.js apps)
* **Backend**: NestJS (Modular services with shared RBAC core)
* **Database**: PostgreSQL (Independent schemas/databases per module)
* **State Management**: Shared Core for UI components and utilities

---

## Setup & Installation

### Prerequisites

* Node.js >= 20
* PNPM or Yarn
* PostgreSQL >= 14
* Docker (optional)

### Installation

```bash
# Clone the repo
git clone [https://github.com/yourusername/erp-orchestra.git](https://github.com/yourusername/erp-orchestra.git)
cd erp-orchestra

# Install dependencies
pnpm install

# Run the development environment
pnpm dev

```

---

## Authentication & RBAC

Orchestrator uses a split-level **Role-Based Access Control** system:

1. **System Level (admin.orchestra.com)**:
* **Super Admin**: Can create new Tenants (Companies) and manage billing.


2. **Tenant Level (portal.orchestra.com)**:
* **Company Admin**: Accessed via `RBAC & Settings` folder. Can invite users and assign roles.
* **Employees**: View only the modules assigned to their role (e.g., Warehouse Staff sees Operations; Accountants see Finance).



```
 