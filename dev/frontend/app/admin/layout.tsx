'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import React from 'react';

export default function SectionLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    return (
        <>
        {/* Barre de navigation fixe */}
        <nav className="fixed top-0 left-0 w-full bg-white shadow h-16 flex items-center px-4">
            <Button
            onClick={() => router.push('/')}
            className="w-60 h-14 text-xl font-semibold rounded-2xl shadow-lg"
            >
            Menu
            </Button>
        </nav>
        {/* Contenu de la page en dessous (avec marge en haut pour ne pas être masqué par la nav) */}
        <main className="pt-16">
            {children}
        </main>
        </>
    );
}
