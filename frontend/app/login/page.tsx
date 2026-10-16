/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Label } from '@/src/components/ui/label';
import { login } from '@/src/services/auth';

const PASSWORD = process.env.NEXT_PUBLIC_PASSWORD;

export default function LoginPage() {
  const [input, setInput] = useState('');
  const [error, setError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setError(false);
    try {
      // Vérification locale (UX) puis échange contre un token signé côté backend
      if (input !== PASSWORD) {
        setError(true);
        return;
      }
      await login();
      window.location.href = '/';
    } catch {
      setError(true);
    } finally {
      setIsSubmitting(false);
    }
    };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-gray-800">
            Accès restreint
          </CardTitle>
          <CardDescription className="text-center">
            Entrez le mot de passe pour accéder à l'application Casamur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setError(false);
                }}
                placeholder=""
                required
                className={error ? 'border-red-500 focus-visible:ring-red-500' : ''}
              />
              {error && (
                <p className="text-sm text-red-500">Mot de passe incorrect</p>
              )}
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Application interne Casamur © 2025
          </div>
        </CardContent>
      </Card>
    </div>
  );
}