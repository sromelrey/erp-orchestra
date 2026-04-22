export const system_seeder = [
  {
    module: 'system',
    resource: 'role',
    action: 'view',
    slug: 'system.role.view',
    name: 'View Roles',
  },
  {
    module: 'system',
    resource: 'role',
    action: 'manage',
    slug: 'system.role.manage',
    name: 'Manage Roles',
  },
  // System - User
  {
    module: 'system',
    resource: 'user',
    action: 'view',
    slug: 'system.user.view',
    name: 'View Users',
  },
  {
    module: 'system',
    resource: 'user',
    action: 'manage',
    slug: 'system.user.manage',
    name: 'Manage Users',
  },
  // System - Permission
  {
    module: 'system',
    resource: 'permission',
    action: 'view',
    slug: 'system.permission.view',
    name: 'View Permissions',
  },
  // System - Session
  {
    module: 'system',
    resource: 'session',
    action: 'view',
    slug: 'system.session.view',
    name: 'View Sessions',
  },
  {
    module: 'system',
    resource: 'session',
    action: 'manage',
    slug: 'system.session.manage',
    name: 'Manage Sessions',
  },
];
