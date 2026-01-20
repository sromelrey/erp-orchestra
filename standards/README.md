# 📊 RBAC TABLE GRAPH (MARKDOWN)

This table graph shows **each RBAC table**, its **role in the system**, and **how it connects to others** — useful for **documentation, audits, and onboarding**.

---

## 🧩 RBAC TABLE OVERVIEW

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

---

## 🔗 RELATIONSHIP GRAPH (LOGICAL FLOW)

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
