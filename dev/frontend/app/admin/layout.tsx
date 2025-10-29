'use client';

import { useRouter, usePathname } from 'next/navigation';
import React from 'react';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';

export default function SectionLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-background">
            {/* Barre de navigation fixe */}
            <nav 
                className="fixed top-0 left-0 w-full bg-card z-50 border-b hover:bg-accent/10 transition-colors cursor-pointer"
                onClick={() => router.push(pathname !== '/admin' ? '/admin' : '/')}
            >
                <div className="container mx-auto px-4">
                    <div className="h-16 flex items-center">
                        <div className="flex items-center gap-2">
                            {pathname !== '/admin' ? (
                                <div className="flex items-center gap-2 text-lg font-semibold">
                                    <ArrowLeft className="w-5 h-5" />
                                    Retour
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-lg font-semibold">
                                    <Image
                                        src="/menu.svg"
                                        alt="Menu"
                                        width={24}
                                        height={24}
                                        className="w-6 h-6"
                                    />
                                    Menu
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
            {/* Contenu de la page */}
            <main className="pt-16 min-h-screen container mx-auto">
                {children}
            </main>
        </div>
    );
}
