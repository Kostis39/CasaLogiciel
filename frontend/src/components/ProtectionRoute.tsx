'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getStoredToken, clearAuth, isBackendAuthenticated } from '@/src/services/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const checkAuth = () => {
    // Le token signé par le backend est la source de vérité
    // (validité 24h, vérifiée à chaque requête authFetch)
    const authenticated = isBackendAuthenticated();
    if (!authenticated) {
      clearAuth();
    }
    setIsAuthenticated(authenticated);
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
