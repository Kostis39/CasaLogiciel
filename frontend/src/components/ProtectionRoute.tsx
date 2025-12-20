'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const checkAuth = () => {
    const authFlag = localStorage.getItem('isAuthenticated') === 'true';
    const authDateStr = localStorage.getItem('authDate');

    if (!authFlag || !authDateStr) {
      setIsAuthenticated(false);
      return;
    }

    const authDate = new Date(authDateStr);
    const now = new Date();
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    if (authDate.getTime() < todayMidnight.getTime()) {
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('authDate');
      setIsAuthenticated(false);
      return;
    }

    const currentHour = now.getHours();
    if (currentHour < 4) {
      // Avant 4h : on considère que c'est encore "hier"
      localStorage.removeItem('isAuthenticated');
      localStorage.removeItem('authDate');
      setIsAuthenticated(false);
      return;
    }

    setIsAuthenticated(true);
  };

  useEffect(() => {
    checkAuth();

    // Écoute les changements (utile si plusieurs onglets)
    window.addEventListener('storage', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  useEffect(() => {
    if (isAuthenticated === false && pathname !== '/login') {
      router.push('/login');
    }
  }, [isAuthenticated, pathname, router]);

  if (isAuthenticated === null) {
    return null; // ou un loader
  }

  // Sur la page login, on affiche toujours le formulaire (même si déjà auth)
  if (pathname === '/login') {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}