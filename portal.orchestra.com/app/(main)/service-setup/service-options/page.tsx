'use client';

import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { EntityManager } from '@/components/entity-manager';
import { columns } from './column';
import { formFields } from './form-fields';

export default function ServiceOptionsPage() {
  return (
    <PermissionGuard permission="service-config.service-option.view">
      <EntityManager
        entityName="Service Option"
        entityNamePlural="Service Options"
        data={[]}
        columns={columns}
        formFields={formFields}
        keyExtractor={(item) => item.id}
        permissions={{
          create: 'service-config.service-option.create',
          update: 'service-config.service-option.update',
          delete: 'service-config.service-option.delete',
          view: 'service-config.service-option.view',
        }}
      />
    </PermissionGuard>
  );
}
