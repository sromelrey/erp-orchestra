'use client';

import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { EntityManager } from '@/components/entity-manager';
import { columns } from './column';
import { formFields } from './form-fields';

export default function ServiceConfigurationsPage() {
  return (
    <PermissionGuard permission="service-config.service-configuration.view">
      <EntityManager
        entityName="Service Configuration"
        entityNamePlural="Service Configurations"
        data={[]}
        columns={columns}
        formFields={formFields}
        keyExtractor={(item) => item.id}
        permissions={{
          create: 'service-config.service-configuration.create',
          update: 'service-config.service-configuration.update',
          delete: 'service-config.service-configuration.delete',
          view: 'service-config.service-configuration.view',
        }}
      />
    </PermissionGuard>
  );
}
