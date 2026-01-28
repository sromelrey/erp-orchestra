"use client";

import { 
    Column 
} from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const columns: Column<any>[] = [
  {
    accessorKey: "firstName",
    header: "User",
    cell: (row) => {
      const firstName = row.firstName || "";
      const lastName = row.lastName || "";
      const email = row.email;
      const avatarUrl = row.avatarUrl;
      const initials = `${firstName[0] || ""}${lastName[0] || ""}`.toUpperCase();

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage src={avatarUrl} alt={firstName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {firstName} {lastName}
            </span>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Roles",
    cell: (row) => {
      const roles = row.userRoles || [];
      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((ur: any) => (
            <Badge key={ur.role.id} variant="outline" className="text-xs">
              {ur.role.name}
            </Badge>
          ))}
          {roles.length === 0 && <span className="text-xs text-muted-foreground">-</span>}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (row) => {
      const status = row.status;
      const variant =
        status === "ACTIVE"
          ? "success"
          : status === "BANNED"
          ? "destructive"
          : "secondary";

      return (
        <Badge variant={variant === "success" ? "default" : variant} className="capitalize">
          {status?.toLowerCase()}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: (row) => {
      return (
        <span className="text-muted-foreground text-sm">
          {new Date(row.createdAt).toLocaleDateString()}
        </span>
      );
    },
  },
];
