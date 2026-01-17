# Orchestrator ERP

Orchestrator is a **modular and affordable ERP system** designed for small to medium enterprises. It integrates multiple modules such as **HRIS, Accounting (AIS), Property Management (PMS), and CRM** into a scalable architecture with **centralized RBAC** and separate databases for each module.

---

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup & Installation](#setup--installation)
- [Database Schema](#database-schema)
- [Authentication & RBAC](#authentication--rbac)
- [Module Development](#module-development)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

Orchestrator is designed to be modular, scalable, and easy to maintain:

- **Separate Frontend Apps** for each module (HRIS, AIS, PMS, CRM)
- **Single Modular Backend** handling RBAC, shared services, and module APIs
- **Centralized RBAC** for user authentication and module-level access control
- **Separate Databases** per module for scalability and maintainability
- Future-ready for **microservices migration** if needed

---

## Architecture
```bash
erp-orchestra/
├── admin.orchestra.com # Admin console (system config, RBAC, tenant management)
├── portal.orchestra.com  # User-facing apps (HRIS, AIS, CRM, PMS)
├── api.orchestra.com     # Backend API (NestJS, modular services)
└── core-orchestra.com    # Shared core (UI components, utilities)
└── README.md
```


**Key Features**
- Monorepo with independent apps & shared packages
- Modular backend with separate databases for HRIS, AIS, PMS, CRM, and RBAC
- Centralized RBAC for authentication & access control
- Reusable components in `shared-orchestra`
- CI/CD ready, compatible with Nx or Turborepo for efficient builds

---

## Apps

| App Name | Tech | Description |
|----------|------|-------------|
| HRIS     | Next.js | Employee management, attendance, payroll integration |
| AIS      | Next.js | Accounting, financial reports, invoicing |
| CRM      | Next.js | Customer relationship management, sales pipeline |
| PMS      | Next.js | Property management and asset tracking |
| Backend  | NestJS | Modular backend, RBAC, shared services |

---

## Packages

| Package | Purpose |
|---------|---------|
| shared-orchestra | Reusable UI components, hooks, utilities, services shared across all frontend apps |

---

## Getting Started

### Prerequisites
- Node.js >= 20
- Yarn or PNPM
- PostgreSQL >= 14
- Docker (optional, for DB or local containers)

### Installation
```bash
# Clone the repo
git clone https://github.com/yourusername/erp-orchestra.git
cd erp-orchestra

# Install dependencies for monorepo
yarn install
# or
pnpm install

