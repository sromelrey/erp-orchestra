'use client';

import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { EntityManager } from '@/components/entity-manager';
import { columns } from './column';
import { formFields } from './form-fields';

export default function ServiceTypesPage() {
  return (
    <PermissionGuard permission="service_config.service_type.view">
      <EntityManager
        entityName="Service Type"
        entityNamePlural="Service Types"
        data={[]}
        columns={columns}
        formFields={formFields}
        keyExtractor={(item) => item.id}
        permissions={{
          create: 'service_config.service_type.create',
          update: 'service_config.service_type.update',
          delete: 'service_config.service_type.delete',
          view: 'service_config.service_type.view',
        }}
      />
    </PermissionGuard>
  );
}
