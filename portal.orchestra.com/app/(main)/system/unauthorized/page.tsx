'use client';

import Link from 'next/link';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center text-center px-4">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-600">
        <ShieldAlert size={40} />
      </div>

      <h1 className="mb-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        Access Denied
      </h1>

      <p className="mb-8 max-w-md text-lg text-muted-foreground">
        You don&apos;t have the required permissions to access this page. Please contact your
        administrator if you believe this is an error.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button variant="outline" asChild className="gap-2">
          <Link href="javascript:history.back()">
            <ArrowLeft size={18} />
            Go Back
          </Link>
        </Button>

        <Button asChild className="gap-2">
          <Link href="/system/dashboard">
            <Home size={18} />
            Return Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
