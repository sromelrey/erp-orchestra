# ERP Orchestra Mapping Documentation

This document provides a comprehensive mapping of both the functional business processes and the technical entity-to-database relationships.

## 1. Functional Overview

This table describes the primary features of the ERP system and their core business functions.

| Category | Feature | Primary Function |
| :--- | :--- | :--- |
| **Operations** | Bill of Materials | The recipe or assembly list that defines which components are needed to build a finished product. |
| **Operations** | Procurement | Manages Purchase Orders (PO) and relationships with vendors to bring materials into the company. |
| **Inventory** | Material Master | The central database for all items (raw materials or finished goods), including codes, units, and stock levels. |
| **Inventory** | Goods Receipt (GR) | The point of entry; confirms that physical items have arrived in the warehouse and updates inventory. |
| **Inventory** | Sales Order (SO) | Captures customer demand and commits specific inventory for future delivery. |
| **Inventory** | Goods Issue (GI) | The point of exit; records the physical movement of stock out of the warehouse to a customer or production. |
| **Finance** | Sales Invoice | The legal billing document sent to customers to request payment for goods or services rendered. |
| **Finance** | Accounts Payable | Tracks the money you owe to vendors for materials purchased through Procurement. |
| **Finance** | Financial Reporting | Generates Balance Sheets and P&L statements to show the overall health of the company. |
| **Finance** | Cash Flow Analysis | Monitors the timing of money coming in vs. going out to ensure the company remains liquid. |
| **Management** | Project Management | Tracks long-term tasks, milestones, and costs for specific business initiatives or customer projects. |
| **Management** | Executive Dashboard | Provides high-level visualizations (KPIs) for leadership to make data-driven decisions. |
| **HRIS** | Employee | The Master Data for people, containing profiles, contracts, and department assignments. |
| **HRIS** | TimeSheets | Records the hours worked by staff, which acts as the source data for both billing and payroll. |
| **HRIS** | Payroll | Calculates salaries, taxes, and benefits based on employee data and recorded time. |

---

## 2. System Schema Seed Data

This section documents the seed data for the `system` schema including modules, plans, and their relationships.

### 2.1 Modules & Sub-modules

| Parent Module | Code | Type | Sub-modules |
| :--- | :--- | :--- | :--- |
| **Operations** | `OPS` | MODULE | Bill of Materials (BOM), Procurement |
| **Inventory** | `INV` | MODULE | Material Master, Goods Receipt (GR), Sales Order (SO), Goods Issue (GI) |
| **Finance & Accounting** | `FIN` | MODULE | Sales Invoice, Accounts Payable (AP), Financial Reporting, Cash Flow Analysis |
| **Management & Strategy** | `MGT` | MODULE | Project Management, Executive Dashboard |
| **HRIS** | `HRIS` | MODULE | Employee, Timesheets, Payroll |

**Sub-module Code Convention:** `{PARENT_CODE}_{FEATURE_ABBREV}` (e.g., `OPS_BOM`, `INV_MM`, `FIN_SI`)

### 2.2 Plans

| Plan Name | Code | Monthly Price | Max Users | Description |
| :--- | :--- | :--- | :--- | :--- |
| Starter | `STARTER` | $49 | 5 | Entry-level plan with basic inventory features |
| Professional | `PROFESSIONAL` | $199 | 25 | Mid-tier plan for growing businesses |
| Enterprise | `ENTERPRISE` | $499 | Unlimited | Full-featured plan with all modules |

### 2.3 Plan-Module Relationships

| Plan | Linked Modules |
| :--- | :--- |
| **Enterprise** | All modules and sub-modules (22 total) |
| **Professional** | TBD (can be configured per business needs) |
| **Starter** | Inventory (parent) + Material Master (sub-module) |

---

## 3. Technical Entity Mapping

This table maps NestJS Entity classes to their corresponding database tables and schemas.

| Domain / Module | NestJS Entity Class | DB Table Name | Description |
| :--- | :--- | :--- | :--- |
| **System** | `Tenant` | `system.tenants` | The main tenant/company record. |
| **System** | `User` | `system.users` | Login credentials and user identity. |
| **System** | `Session` | `system.sessions` | Persistent login sessions (connect-typeorm). |
| **System** | `Role` | `system.roles` | Job titles (e.g., 'Warehouse Manager'). |
| **System** | `Permission` | `system.permissions` | Granular access keys (e.g., ops:gr:create). |
| **System** | `Plan` | `system.plans` | Subscription plans with pricing and user limits. |
| **System** | `SystemModule` | `system.modules` | Available system modules and sub-modules. |
| **System** | `Menu` | `system.menus` | Navigation menu items linked to modules. |
| **Operations** | `OpsMaterial` | `operations.materials` | Master data for items and stock. |
| **Operations** | `OpsBom` | `operations.boms` | Recipe/Assembly list for products. |
| **Operations** | `OpsProcurement` | `operations.procurement_orders` | Purchase orders sent to vendors. |
| **Operations** | `OpsGoodsReceipt` | `operations.goods_receipts` | Recording incoming warehouse stock. |
| **Finance** | `FinInvoice` | `finance.invoices` | Billing documents sent to customers. |
| **Finance** | `FinAccountPayable` | `finance.accounts_payable` | Tracking money owed to vendors. |
| **HRIS** | `HrisEmployee` | `hris.employees` | Master data for staff and people. |
| **HRIS** | `HrisTimeSheet` | `hris.timesheets` | Records of hours worked by employees. |
| **HRIS** | `HrisPayroll` | `hris.payroll_runs` | Calculated salary and tax records. |

### 3.1 Junction Tables

| Table Name | Schema | Purpose |
| :--- | :--- | :--- |
| `plan_modules` | `system` | Many-to-Many relationship between Plans and Modules |
| `user_roles` | `system` | Many-to-Many relationship between Users and Roles |
| `role_permissions` | `system` | Many-to-Many relationship between Roles and Permissions |

