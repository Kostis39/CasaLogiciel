/**
 * Composant pour afficher une image protégée par authentification
 * (ex: signatures). Un <img src> classique ne peut pas envoyer de header
 * Authorization, donc on fetch l'image avec authFetch puis on la convertit
 * en blob URL.
 */
"use client";

import { useEffect, useState } from "react";
import { authFetch, AuthError } from "@/src/services/auth";

export function AuthImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    let createdUrl: string | null = null;

    async function loadImage() {
      try {
        const response = await authFetch(src);
        if (!response.ok) {
          if (!cancelled) setFailed(true);
          return;
        }
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        if (cancelled) {
          URL.revokeObjectURL(url);
          return;
        }
        setObjectUrl(url);
      } catch (error) {
        if (error instanceof AuthError) {
          console.error("Image authentifiée inaccessible:", error.message);
        }
        if (!cancelled) setFailed(true);
      }
    }

    setFailed(false);
    setObjectUrl(null);
    if (src) {
      loadImage();
    }

    return () => {
      cancelled = true;
      setObjectUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return null;
      });
    };
  }, [src]);

  if (failed) {
    return (
      <p className="mt-2 text-xs text-gray-400">
        Signature non disponible (accord requis)
      </p>
    );
  }
  if (!objectUrl) {
    return <div className="mt-2 w-40 h-16 animate-pulse bg-gray-100 rounded" />;
  }
  return <img src={objectUrl} alt={alt} className={className} />;
}
