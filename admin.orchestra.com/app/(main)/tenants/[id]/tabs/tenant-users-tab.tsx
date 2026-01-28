import { useGetTenantUsersQuery, useCreateTenantUserMutation } from "@/store/api/tenantsApi";
import { useGetRolesQuery } from "@/store/api/rolesApi";
import { EntityManager, StatCard } from "@/components/entity-manager";
import { columns } from "../users/columns";
import { formFields as defaultFormFields } from "../users/form-fields";
import { Users, ShieldCheck, UserCheck } from "lucide-react";
import { toast } from "@/lib/toast";
import { useMemo } from "react";

interface TenantUsersTabProps {
  tenantId: string | number;
}

export function TenantUsersTab({ tenantId }: TenantUsersTabProps) {
  const { data: usersData, isLoading: isUsersLoading } = useGetTenantUsersQuery({ tenantId });
  const { data: rolesData, isLoading: isRolesLoading } = useGetRolesQuery();
  const [createUser] = useCreateTenantUserMutation();

  const users = usersData?.data || [];
  const roles = (Array.isArray(rolesData) ? rolesData : (rolesData as any)?.data) || [];
  const isLoading = isUsersLoading || isRolesLoading;

  // Dynamically update form fields with roles options
  const formFields = useMemo(() => {
    return defaultFormFields.map((field) => {
      if (field.name === "roleIds") {
        const tenantAdminRole = roles.find((r: any) => r.code === "ADMIN");
        return {
          ...field,
          options: roles.length > 0 
            ? roles
                .filter((role: any) => role.code === "ADMIN")
                .map((role: any) => ({
                  label: role.name,
                  value: role.id,
                }))
            : field.options,
          defaultValue: tenantAdminRole ? tenantAdminRole.id : field.defaultValue,
          disabled: true, // Force Tenant Admin
          description: "User will be assigned as Tenant Admin",
        };
      }
      return field;
    });
  }, [roles]);

  const stats: StatCard[] = [
    {
      label: "Total Users",
      value: users.length,
      icon: Users,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Active",
      value: users.filter((u: any) => u.status === "ACTIVE").length,
      icon: UserCheck,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Admins",
      value: users.filter((u: any) => u.isTenantAdmin).length,
      icon: ShieldCheck,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  const handleCreate = async (data: any) => {
    try {
      const payload = { ...data };
      
      // Ensure password is set if disabled
      if (!payload.password) {
        payload.password = "password123";
      }

      // Handle Role selection
      const tenantAdminRole = roles.find((r: any) => r.code === "ADMIN");
      
      let finalRoleIds: number[] = [];

      // If roleIds is present in raw form data
      if (payload.roleIds) {
          const rawIds = Array.isArray(payload.roleIds) ? payload.roleIds : [payload.roleIds];
          finalRoleIds = rawIds
            .map((id: any) => {
              if (id === "ADMIN" && tenantAdminRole) return Number(tenantAdminRole.id);
              return Number(id);
            })
            .filter((id: number) => !isNaN(id) && id > 0);
      } 
      
      // If we still have no roles and we found a default one, use it
      if (finalRoleIds.length === 0 && tenantAdminRole) {
          finalRoleIds = [Number(tenantAdminRole.id)];
      }

      payload.roleIds = finalRoleIds;

      console.log("Submitting Payload:", payload);

      await createUser({ tenantId, body: payload }).unwrap();
      toast.success("User created successfully");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create user");
      console.error("Failed to create user:", error);
    }
  };

  return (
    <div className="space-y-4">
      <EntityManager
        data={users}
        columns={columns}
        entityName="User"
        keyExtractor={(user) => user.id}
        formFields={formFields}
        stats={stats}
        onCreate={handleCreate}
        // Update/Delete not strictly required by prompt but good to have placeholders if needed
        showViewButton={false}
        showEditButton={false} // Enable when update endpoint exists
        showDeleteButton={false} // Enable when delete endpoint exists
        isLoading={isLoading}
      />
    </div>
  );
}
