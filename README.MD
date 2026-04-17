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
* PM2 (for production deployment)

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

## Production Deployment with PM2

### Environment Configuration

1. **Configure Backend Environment** (`api.orchestra.com/.env`):
```env
DATABASE_URL=postgresql://user:password@host:5432/database
SESSION_SECRET=your-secret-key
NODE_ENV=development  # or production
FRONTEND_URL=http://localhost:3001
API_BASE_URL=http://localhost:3000/api
```

2. **Important: PM2 Ecosystem Config**
   - The `api.orchestra.com/ecosystem.config.js` file sets the `NODE_ENV` environment variable for PM2
   - **Critical**: Ensure `NODE_ENV` matches your environment (development/production)
   - For development: `NODE_ENV: "development"` (sets secure cookies to false)
   - For production: `NODE_ENV: "production"` (sets secure cookies to true)

### Building the Application

```bash
# Build backend
cd api.orchestra.com
npm run build
cd ..

# Build frontend
cd portal.orchestra.com
npm run build
cd ..
```

### Starting with PM2

```bash
# Start backend
pm2 start api.orchestra.com/ecosystem.config.js

# Start frontend
pm2 start portal.orchestra.com/ecosystem.config.cjs

# Check status
pm2 list

# View logs
pm2 logs backend
pm2 logs frontend
```

### PM2 Management Commands

```bash
# Restart applications
pm2 restart all
pm2 restart backend
pm2 restart frontend

# Stop applications
pm2 stop all
pm2 stop backend
pm2 stop frontend

# Delete applications
pm2 delete all
pm2 delete backend
pm2 delete frontend

# Save PM2 configuration (auto-start on reboot)
pm2 save
pm2 startup
```

### Troubleshooting

**Port Already in Use Error (EADDRINUSE):**
```powershell
# Find process using the port
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue | Select-Object OwningProcess, State

# Kill the process
Stop-Process -Id <PID> -Force
```

**Session Cookie Issues (403 on /me endpoint):**
- Ensure `NODE_ENV=development` in both `.env` and `ecosystem.config.js`
- Development mode sets `secure: false` on cookies (works with HTTP)
- Production mode sets `secure: true` on cookies (requires HTTPS)
- After changing NODE_ENV, rebuild and restart PM2

**PM2 Process Not Found:**
```bash
pm2 kill
pm2 start api.orchestra.com/ecosystem.config.js
pm2 start portal.orchestra.com/ecosystem.config.cjs
```

### Accessing the Application

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000/api
- **Swagger Documentation**: http://localhost:3000/api/docs

### Deploying to Another Computer

1. Pull the latest changes:
```bash
git pull
```

2. Install dependencies:
```bash
cd api.orchestra.com
npm install
cd ../portal.orchestra.com
npm install
cd ..
```

3. Configure environment variables in `.env` files

4. Build the applications:
```bash
cd api.orchestra.com
npm run build
cd ../portal.orchestra.com
npm run build
cd ..
```

5. Start with PM2:
```bash
pm2 start api.orchestra.com/ecosystem.config.js
pm2 start portal.orchestra.com/ecosystem.config.cjs
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
 