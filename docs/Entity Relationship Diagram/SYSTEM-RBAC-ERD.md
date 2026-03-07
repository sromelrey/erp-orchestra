# ERD: Core System & RBAC

This document outlines the core system architecture, focusing on multi-tenancy (`tenants`/`companies`) and Role-Based Access Control (`users`, `roles`, `permissions`, `menus`).

## 1. Database Schema (DBML)

```dbml
title ERD System (Enterprise Grade)

companies [icon: building, color: gray] {
  id integer [pk, increment]
  name varchar(150) [unique, not null]
  created_at timestamptz
  updated_at timestamptz
  deleted_at timestamptz
}

users [icon: user, color: blue] {
  id integer [pk, increment]
  company_id integer [note: "Tenant ID"]
  email varchar(255) [unique, not null]
  password_hash varchar(255)
  first_name varchar(100)
  last_name varchar(100)
  avatar_url varchar(255)
  is_system_admin boolean [default: false, note: "Super Admin / God Mode"]
  status Enum [note: "Active, Inactive, Banned"]
  last_login_at timestamptz
  created_at timestamptz
  updated_at timestamptz
  deleted_at timestamptz
}

roles [icon: users, color: blue] {
  id integer [pk, increment]
  company_id integer [note: "NULL = System Role, Value = Tenant Role"]
  name varchar(100) [note: "e.g. 'Warehouse Manager'"]
  code varchar(50) [unique, note: "Stable key: 'WH_MGR', 'ACC_PAYABLE'"]
  description text
  is_system_role boolean [default: false, note: "Protected system role"]
  status Enum [note: "Active, Inactive"]
  created_at timestamptz
  updated_at timestamptz
  deleted_at timestamptz
}

permissions [icon: shield, color: purple] {
  id integer [pk, increment]
  module varchar(50) [note: "e.g. 'Operations', 'Finance'"]
  resource varchar(50) [note: "e.g. 'GoodsReceipt', 'Invoice'"]
  action varchar(50) [note: "e.g. 'create', 'view', 'approve'"]
  slug varchar(100) [unique, note: "Code check: 'ops:gr:create'"]
  name varchar(100)
  description text
  created_at timestamptz
  updated_at timestamptz
  deleted_at timestamptz
}

menus [icon: folder, color: orange] {
  id integer [pk, increment]
  parent_id integer [note: "Self-reference for nested tree"]
  permission_id integer [note: "Links menu visibility to a permission"]
  label varchar(100) [note: "e.g. 'Sales Invoicing'"]
  path varchar(255) [note: "e.g. '/portal/finance/invoice'"]
  icon varchar(50)
  sort_order integer
  is_visible boolean [default: true]
  created_at timestamptz
  updated_at timestamptz
  deleted_at timestamptz
}

role_permissions [icon: key, color: green] {
  id integer [pk, increment]
  role_id integer
  permission_id integer
  created_at timestamptz
  updated_at timestamptz
  deleted_at timestamptz
}

user_roles [icon: user-check, color: green] {
  id integer [pk, increment]
  user_id integer
  role_id integer
  assigned_at timestamptz [default: "now()"]
  expires_at timestamptz [note: "Optional temporary access"]
  created_at timestamptz
  updated_at timestamptz
  deleted_at timestamptz
}

session [icon: lock, color: gray] {
  id varchar(255) [pk]
  expiredAt bigint
  json text
  destroyedAt timestamptz
}

// Relationships
users.company_id > companies.id
roles.company_id > companies.id

user_roles.user_id > users.id
user_roles.role_id > roles.id

role_permissions.role_id > roles.id
role_permissions.permission_id > permissions.id

menus.parent_id - menus.id
menus.permission_id > permissions.id
```

## 2. RBAC Table Graph Overview

This table graph shows **each RBAC table**, its **role in the system**, and **how it connects to others** — useful for **documentation, audits, and onboarding**.

| Table Name | Category | What It Does | Connected To |
|----------|--------|-------------|-------------|
| **users** | Identity | Stores all system users and login-related data | user_roles, user_permissions, rbac_audit_logs |
| **roles** | Authorization | Defines job-based access bundles | user_roles, role_permissions |
| **permissions** | Authorization | Defines all allowed actions in the system | role_permissions, user_permissions, menu_permissions |
| **menus** | UI / Navigation | Defines system menus and navigation structure | menu_permissions, menus (self-reference) |
| **menu_permissions** | UI Security | Controls which permissions are required to see a menu | menus, permissions |
| **role_permissions** | Authorization Mapping | Assigns permissions to roles | roles, permissions |
| **user_roles** | Authorization Mapping | Assigns roles to users per tenant | users, roles |
| **user_permissions** | Authorization Override | Grants direct permissions to a user (exception-based) | users, permissions |
| **rbac_audit_logs** | Security / Compliance | Logs all RBAC-related changes for auditing | users |

## 3. Relationship Graph (Logical Flow)

```text
users
 ├── user_roles
 │    └── roles
 │         └── role_permissions
 │              └── permissions
 │
 ├── user_permissions
 │    └── permissions
 │
 └── rbac_audit_logs

permissions
 └── menu_permissions
      └── menus
           └── menus (parent-child hierarchy)
```
