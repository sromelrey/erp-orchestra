# Entities Directory Structure

This directory contains all TypeORM entities for the Orchestrator ERP API.

## 📁 Structure

```
src/entities/
├── index.ts              # Central barrel export (use @entities/index)
├── common.entity.ts      # Base entity with audit fields
├── company.entity.ts     # Multi-tenant company entity
├── README.md             # This file
│
└── rbac/                 # Role-Based Access Control entities
    ├── user.entity.ts
    ├── role.entity.ts
    ├── permission.entity.ts
    ├── menu.entity.ts
    ├── user_role.entity.ts
    └── role_permission.entity.ts
```

## 🔧 Import Convention

**Always import from the barrel export:**

```typescript
import { User, Role, Permission, CommonEntity } from "@entities/index";
```

**Never import directly from entity files** to maintain consistency and enable easier refactoring.

## 📋 Entity Overview

### Core Entities

| Entity | Table | Description |
|--------|-------|-------------|
| `CommonEntity` | (abstract) | Base class with id, audit fields (createdBy, updatedBy, deletedBy), and timestamps |
| `Company` | `companies` | Multi-tenant organization entity |

### RBAC Entities

| Entity | Table | Description |
|--------|-------|-------------|
| `User` | `users` | User accounts with company association |
| `Role` | `roles` | Job roles (system-wide or company-specific) |
| `Permission` | `permissions` | Granular permissions with module/resource/action pattern |
| `Menu` | `menus` | Sidebar menu items with permission-based visibility |

### Junction Tables

| Entity | Table | Description |
|--------|-------|-------------|
| `UserRole` | `user_roles` | Maps users to roles (with optional expiration) |
| `RolePermission` | `role_permissions` | Maps roles to permissions |

## 🔐 Permission Slug Convention

Permissions use a `module:resource:action` slug pattern:

```
ops:goods_receipt:create    # Operations > Goods Receipt > Create
fin:invoice:approve         # Finance > Invoice > Approve
hr:employee:view            # HR > Employee > View
```

## 🔗 Relationship Diagram

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   Company   │───1:N─│    User     │───N:M─│    Role     │
└─────────────┘       └─────────────┘       └─────────────┘
      │                                            │
      │ 1:N (custom roles)                        N:M
      │                                            │
      └──────────────────────┐              ┌─────────────┐
                             │              │ Permission  │
                             └──────────────└─────────────┘
                                                   │
                                                  1:N
                                                   │
                                            ┌─────────────┐
                                            │    Menu     │ (self-ref)
                                            └─────────────┘
```

## ➕ Adding New Entities

1. **Create entity file** in appropriate folder (e.g., `rbac/` for RBAC-related)
2. **Extend `CommonEntity`** to inherit audit fields
3. **Export from `index.ts`** barrel file
4. **Use string references** in `@ManyToOne`/`@OneToMany` to avoid circular dependencies:

```typescript
// ✅ Good - string reference prevents circular import issues
@ManyToOne('Company', 'users')
company?: any;

// ⚠️ Works but may cause issues in complex circular cases
@ManyToOne(() => Company, (company) => company.users)
company?: Company;
```

## 🎯 Best Practices

1. **Always use `CommonEntity`** as base class for audit trail
2. **Use snake_case** for database column names via `@Column({ name: 'column_name' })`
3. **Add appropriate indexes** for foreign keys and frequently queried fields
4. **Use soft deletes** via `deletedAt` (inherited from CommonEntity)
5. **Document nullable fields** with `?` and `| null` type annotation
