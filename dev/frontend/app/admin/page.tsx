'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import React from 'react';

export default function ChoixPage() {
  const router = useRouter();

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-10 bg-gray-50 px-4">
      <div className="flex flex-col sm:flex-row gap-6">
        <Button
          onClick={() => router.push('/admin/ticket')}    
          className="w-60 h-20 text-xl font-semibold rounded-2xl shadow-lg"
        >
          Ticket
        </Button>
        <Button
          onClick={() => router.push('/admin/abonnement')}
          className="w-60 h-20 text-xl font-semibold rounded-2xl shadow-lg"
        >
          Abonnement
        </Button>
        <Button
          onClick={() => router.push('/admin/produit')}
          className="w-60 h-20 text-xl font-semibold rounded-2xl shadow-lg"
        >
          Produit
        </Button>
      </div>
    </main>
  );
}
