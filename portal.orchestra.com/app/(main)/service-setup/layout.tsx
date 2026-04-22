'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ServiceSetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const getActiveTab = () => {
    if (pathname.includes('/service-types')) return 'service-types';
    if (pathname.includes('/service-options')) return 'service-options';
    if (pathname.includes('/service-configurations')) return 'service-configurations';
    return 'service-types';
  };

  const handleTabChange = (value: string) => {
    router.push(`/service-setup/${value === 'service-types' ? 'services' : value}`);
  };

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Service Setup</h1>
          <p className="text-gray-600 mt-1">Manage service types, options, and pricing configurations</p>
        </div>
        
        <Tabs value={getActiveTab()} onValueChange={handleTabChange} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="service-types">Service Types</TabsTrigger>
            <TabsTrigger value="service-options">Service Options</TabsTrigger>
            <TabsTrigger value="service-configurations">Configurations</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <div className="space-y-4">
          {children}
        </div>
      </div>
    </div>
  );
}
