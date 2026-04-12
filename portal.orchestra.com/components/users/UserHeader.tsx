import { User } from '@/types';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle, Lock } from 'lucide-react';

export function UserHeader(formData: Record<string, unknown> | Partial<Record<string, unknown>>) {
  if (!formData || !('status' in formData)) {
    return null;
  }

  const user = formData as unknown as User;
  const status = user.status;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-700';
      case 'INACTIVE':
        return 'bg-gray-100 text-gray-700';
      case 'BANNED':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-4 h-4" />;
      case 'BANNED':
        return <Lock className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-3">
      {/* Status Badge */}
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(status)}`}>
        {getStatusIcon(status)}
        {status}
      </div>

      {/* BANNED status warning */}
      {status === 'BANNED' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">This user account has been banned and cannot be modified.</p>
        </div>
      )}

      {/* INACTIVE status message */}
      {status === 'INACTIVE' && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
          <p className="text-sm text-gray-700">This user account is inactive and cannot log in.</p>
        </div>
      )}

      {/* Tenant Admin badge */}
      {user.isTenantAdmin && (
        <div className="inline-flex">
          <Badge variant="default" className="bg-purple-600">
            Tenant Admin
          </Badge>
        </div>
      )}

      {/* User email */}
      <div className="text-sm text-gray-600">
        <span className="font-medium">Email:</span> {user.email}
      </div>
    </div>
  );
}
