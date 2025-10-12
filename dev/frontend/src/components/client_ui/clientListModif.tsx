"use client";
import { fetchClients } from "@/src/services/api";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ClientCardForList } from "./clientCard";
export function GrimpeurInfiniteList() {
  const [grimpeurs, setGrimpeurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [hasPrev, setHasPrev] = useState(false);

  const limit = 20;
  const [offset, setOffset] = useState(0);
  const BUFFER_SIZE = 60;

  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchGrimpeurs = useCallback(
    async (direction: "next" | "prev") => {
      if (loading) return;
      setLoading(true);

      try {
        const newOffset =
          direction === "next" ? offset + limit : Math.max(offset - limit, 0);

        // ✅ Appel à la Server Action
        const { data, total } = await fetchClients(limit, newOffset);

        setGrimpeurs((prev) => {
          let combined =
            direction === "next" ? [...prev, ...data] : [...data, ...prev];

          // Supprime les doublons
          const unique = combined.filter(
            (g, index, self) =>
              index === self.findIndex((x) => x.NumGrimpeur === g.NumGrimpeur)
          );

          // Limite la taille du buffer
          if (unique.length > BUFFER_SIZE) {
            return direction === "next"
              ? unique.slice(unique.length - BUFFER_SIZE)
              : unique.slice(0, BUFFER_SIZE);
          }

          return unique;
        });

        setOffset(newOffset);
        setHasPrev(newOffset > 0);
        setHasNext(newOffset + limit < total);
      } catch (err) {
        console.error("Erreur fetchGrimpeurs:", err);
      } finally {
        setLoading(false);
      }
    },
    [offset, loading]
  );

  useEffect(() => {
    fetchGrimpeurs("next");
  }, []);

  useEffect(() => {
    const bottom = bottomSentinelRef.current;
    if (!bottom) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext) {
          fetchGrimpeurs("next");
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(bottom);
    return () => observer.disconnect();
  }, [fetchGrimpeurs, hasNext]);

  useEffect(() => {
    const top = topSentinelRef.current;
    if (!top) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasPrev) {
          fetchGrimpeurs("prev");
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(top);
    return () => observer.disconnect();
  }, [fetchGrimpeurs, hasPrev]);

  return (
<table className="min-w-full border-separate border-spacing-y-1">
  <thead className="sticky top-0 bg-white text-gray-700">
    <tr>
      <th className="p-2">Photo</th>
      <th className="text-left pr-2">Nom</th>
      <th className="text-left pr-2">Prénom</th>
      <th className="text-left">Règlement</th>
      <th className="text-left">Cotisation</th>
      <th className="text-left pr-2">Club</th>
      <th className="text-left pr-2">Licence</th>
      <th className="text-left">Abonnement</th>
      <th className="text-left">Séances</th>
    </tr>
  </thead>

  <tbody>
    {/* Sentinelle haute */}
    <tr>
      <td colSpan={9}>
        <div ref={topSentinelRef} className="h-1" />
      </td>
    </tr>

    {/* Lignes de grimpeurs */}
    {grimpeurs.map((g) => (
      <ClientCardForList key={g.NumGrimpeur} client={g} />
    ))}

    {/* Sentinelle basse */}
    <tr>
      <td colSpan={9}>
        <div ref={bottomSentinelRef} className="h-1" />
      </td>
    </tr>

    {/* Indicateur de chargement */}
    {loading && (
      <tr>
        <td colSpan={9} className="text-center py-2">
          Chargement...
        </td>
      </tr>
    )}

    {/* Fin de la liste */}
    {!hasNext && !loading && (
      <tr>
        <td colSpan={9} className="text-center text-gray-500 py-2">
          Vous avez atteint la fin de la liste.
        </td>
      </tr>
    )}
  </tbody>

</table>

  );
}
