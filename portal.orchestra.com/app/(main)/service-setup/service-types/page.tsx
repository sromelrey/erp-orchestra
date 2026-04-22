'use client';

import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { EntityManager } from '@/components/entity-manager';
import { columns } from './column';
import { formFields } from './form-fields';

export default function ServiceTypesPage() {
  return (
    <PermissionGuard permission="service-config.service-type.view">
      <EntityManager
        entityName="Service Type"
        entityNamePlural="Service Types"
        data={[]}
        columns={columns}
        formFields={formFields}
        keyExtractor={(item) => item.id}
        permissions={{
          create: 'service-config.service-type.create',
          update: 'service-config.service-type.update',
          delete: 'service-config.service-type.delete',
          view: 'service-config.service-type.view',
        }}
      />
    </PermissionGuard>
  );
}
