'use client';

import { useRouter } from 'next/navigation';
import { Card } from '@/src/components/ui/card';
import React from 'react';
import Image from 'next/image';

export default function ChoixPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Administration</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/admin/ticket')}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Image
                src="/ordinateur.svg"
                alt="Tickets"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <h2 className="text-xl font-semibold">Tickets</h2>
            <p className="text-sm text-muted-foreground text-center">
              Gérer les tickets et leurs paramètres
            </p>
          </div>
        </Card>

        <Card 
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/admin/abonnement')}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Image
                src="/grimpeurs.svg"
                alt="Abonnements"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <h2 className="text-xl font-semibold">Abonnements</h2>
            <p className="text-sm text-muted-foreground text-center">
              Gérer les abonnements et leurs paramètres
            </p>
          </div>
        </Card>

        <Card 
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/admin/club')}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Image
                src="/grimpeurs.svg"
                alt="Clubd"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <h2 className="text-xl font-semibold">Clubs</h2>
            <p className="text-sm text-muted-foreground text-center">
              Gérer les abonnements et leurs paramètres
            </p>
          </div>
        </Card>

        {/** 
        <Card 
          className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push('/admin/produit')}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Image
                src="/menu.svg"
                alt="Produits"
                width={32}
                height={32}
                className="w-8 h-8"
              />
            </div>
            <h2 className="text-xl font-semibold">Produits</h2>
            <p className="text-sm text-muted-foreground text-center">
              Gérer les produits et leurs paramètres
            </p>
          </div>
        </Card>
        */}
      </div>
    </div>
  );
}
