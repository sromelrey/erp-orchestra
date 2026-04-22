export const production_seeder = [
  // Production - Production Batches
  {
    module: 'production',
    resource: 'batch',
    action: 'create',
    slug: 'production.batch.create',
    name: 'Create Production Batches',
  },
  {
    module: 'production',
    resource: 'batch',
    action: 'view',
    slug: 'production.batch.view',
    name: 'View Production Batches',
  },
  {
    module: 'production',
    resource: 'batch',
    action: 'update',
    slug: 'production.batch.update',
    name: 'Update Production Batches',
  },
  {
    module: 'production',
    resource: 'batch',
    action: 'delete',
    slug: 'production.batch.delete',
    name: 'Delete Production Batches',
  },
  {
    module: 'production',
    resource: 'batch',
    action: 'start',
    slug: 'production.batch.start',
    name: 'Start Production Batches',
  },
  {
    module: 'production',
    resource: 'batch',
    action: 'complete',
    slug: 'production.batch.complete',
    name: 'Complete Production Batches',
  },
];
