'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';

export default function OperationsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to materials page as the default operations page
    router.push('/operations/materials');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600">Redirecting to Materials...</p>
      </div>
    </div>
  );
}
