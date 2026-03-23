'use client';

import { useState, useMemo } from 'react';
import { useGetUsersQuery } from '@/store/api/usersApi';
import { useAssignUsersMutation } from '@/store/api/rolesApi';
import { Role } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Loader2, Search, Users, UserPlus, CheckCircle2 } from 'lucide-react';

interface AssignUsersPanelProps {
  role: Role;
  onClose?: () => void;
}

export function AssignUsersPanel({ role, onClose }: AssignUsersPanelProps) {
  const { data: users = [], isLoading: isLoadingUsers } = useGetUsersQuery();
  const [assignUsers, { isLoading: isAssigning }] = useAssignUsersMutation();

  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Determine which user IDs are already assigned to this role
  const alreadyAssignedUserIds = useMemo(() => {
    return users
      .filter((user) => user.userRoles?.some((ur) => ur.role && ur.role.id === role.id))
      .map((user) => user.id);
  }, [users, role.id]);

  // Filter users by search query
  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.email.toLowerCase().includes(query) ||
        (user.firstName && user.firstName.toLowerCase().includes(query)) ||
        (user.lastName && user.lastName.toLowerCase().includes(query))
    );
  }, [users, searchQuery]);

  // Users that can be assigned (not already assigned)
  const assignableUsers = useMemo(
    () => filteredUsers.filter((u) => !alreadyAssignedUserIds.includes(u.id)),
    [filteredUsers, alreadyAssignedUserIds]
  );

  const handleToggle = (userId: number) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    const assignableIds = assignableUsers.map((u) => u.id);
    const allSelected = assignableIds.every((id) => selectedUserIds.includes(id));

    if (allSelected) {
      setSelectedUserIds((prev) => prev.filter((id) => !assignableIds.includes(id)));
    } else {
      setSelectedUserIds((prev) => {
        const newIds = assignableIds.filter((id) => !prev.includes(id));
        return [...prev, ...newIds];
      });
    }
  };

  const handleSave = async () => {
    if (selectedUserIds.length === 0) return;

    try {
      await assignUsers({
        roleId: role.id,
        userIds: selectedUserIds,
      }).unwrap();
      toast.success(`${selectedUserIds.length} user(s) assigned to "${role.name}" successfully`);
      setSelectedUserIds([]);
      onClose?.();
    } catch {
      toast.error('Failed to assign users');
    }
  };

  const allAssignableSelected =
    assignableUsers.length > 0 && assignableUsers.every((u) => selectedUserIds.includes(u.id));

  if (isLoadingUsers) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header info */}
      <div>
        <h3 className="text-lg font-semibold">{role.name}</h3>
        <p className="text-sm text-muted-foreground">{role.description}</p>
        <div className="flex items-center gap-3 mt-2">
          <Badge variant="outline" className="gap-1.5">
            <Users className="h-3 w-3" />
            {alreadyAssignedUserIds.length} assigned
          </Badge>
          {selectedUserIds.length > 0 && (
            <Badge className="gap-1.5 bg-primary">
              <UserPlus className="h-3 w-3" />
              {selectedUserIds.length} selected to assign
            </Badge>
          )}
        </div>
      </div>

      {/* Search and Select All */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0 h-9"
          onClick={handleSelectAll}
          disabled={assignableUsers.length === 0}
        >
          {allAssignableSelected ? 'Deselect All' : 'Select All'}
        </Button>
      </div>

      {/* User list */}
      <div className="border rounded-lg max-h-[400px] overflow-y-auto divide-y">
        {filteredUsers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <Users className="h-8 w-8 mb-2" />
            <p className="text-sm">No users found</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isAlreadyAssigned = alreadyAssignedUserIds.includes(user.id);
            const isSelected = selectedUserIds.includes(user.id);
            const displayName =
              user.firstName || user.lastName
                ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                : user.email;

            return (
              <Label
                key={user.id}
                htmlFor={`user-assign-${user.id}`}
                className={`flex items-center gap-3 px-4 py-3 transition-colors ${
                  isAlreadyAssigned
                    ? 'opacity-60 cursor-default bg-muted/30'
                    : isSelected
                      ? 'bg-primary/5 cursor-pointer'
                      : 'hover:bg-muted/40 cursor-pointer'
                }`}
              >
                {isAlreadyAssigned ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                ) : (
                  <Checkbox
                    id={`user-assign-${user.id}`}
                    checked={isSelected}
                    onCheckedChange={() => handleToggle(user.id)}
                    className="shrink-0 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium truncate">{displayName}</span>
                    {isAlreadyAssigned && (
                      <Badge
                        variant="outline"
                        className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800"
                      >
                        Assigned
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={`text-[10px] ${
                        user.status === 'ACTIVE'
                          ? 'bg-sky-50 text-sky-700 border-sky-200'
                          : 'bg-gray-100 text-gray-500 border-gray-200'
                      }`}
                    >
                      {user.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                </div>
              </Label>
            );
          })
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-2">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSave} disabled={selectedUserIds.length === 0 || isAssigning}>
          {isAssigning && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Assign {selectedUserIds.length > 0 ? `${selectedUserIds.length} User(s)` : 'Users'}
        </Button>
      </div>
    </div>
  );
}
