export const addons_seeder = [
  // Add-ons - Add-on Management
  {
    module: 'addons',
    resource: 'addons',
    action: 'view',
    slug: 'addons.view',
    name: 'View Add-ons',
  },
  {
    module: 'addons',
    resource: 'addons',
    action: 'create',
    slug: 'addons.create',
    name: 'Create Add-ons',
  },
  {
    module: 'addons',
    resource: 'addons',
    action: 'update',
    slug: 'addons.update',
    name: 'Update Add-ons',
  },
  {
    module: 'addons',
    resource: 'addons',
    action: 'delete',
    slug: 'addons.delete',
    name: 'Delete Add-ons',
  },
  // Add-ons - Inclusion Rules
  {
    module: 'addons',
    resource: 'rules',
    action: 'view',
    slug: 'addons.rules.view',
    name: 'View Add-on Rules',
  },
  {
    module: 'addons',
    resource: 'rules',
    action: 'manage',
    slug: 'addons.rules.manage',
    name: 'Manage Add-on Rules',
  },
  // Sales Order - Add-on Integration
  {
    module: 'sales_order',
    resource: 'addons',
    action: 'select',
    slug: 'sales_order.addons.select',
    name: 'Select Add-ons for Orders',
  },
  {
    module: 'sales_order',
    resource: 'addons',
    action: 'view',
    slug: 'sales_order.addons.view',
    name: 'View Order Add-ons',
  },
];
