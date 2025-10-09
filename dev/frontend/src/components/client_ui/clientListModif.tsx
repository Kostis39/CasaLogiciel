"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { ClientCard, ClientCardForList } from "@/src/components/client_ui/clientCard";
import { API_URL } from "@/src/services/real";
import { Client } from "@/src/types&fields/types";

export function GrimpeurInfiniteList() {
  const [grimpeurs, setGrimpeurs] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [hasPrev, setHasPrev] = useState(false);

  const limit = 20;
  const [offset, setOffset] = useState(0);

  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);
  const BUFFER_SIZE = 60;

const fetchGrimpeurs = useCallback(
  async (direction: "next" | "prev") => {
    if (loading) return;
    setLoading(true);

    try {
      const newOffset =
        direction === "next" ? offset + limit : Math.max(offset - limit, 0);

      const res = await fetch(`${API_URL}/grimpeurs?limit=${limit}&offset=${newOffset}`);
      const json = await res.json();
      const data: any[] = json.data || [];
      const total: number = json.total || 0;

      setGrimpeurs((prev) => {
        let combined = direction === "next" ? [...prev, ...data] : [...data, ...prev];

        // Supprimer doublons
        const unique = combined.filter(
          (g, index, self) =>
            index === self.findIndex((x) => x.NumGrimpeur === g.NumGrimpeur)
        );

        // Limiter la mémoire
        if (unique.length > BUFFER_SIZE) {
          if (direction === "next") return unique.slice(unique.length - BUFFER_SIZE);
          else return unique.slice(0, BUFFER_SIZE);
        }

        return unique;
      });

      setOffset(newOffset);

      // ✅ Calcul correct de hasNext et hasPrev
      setHasPrev(newOffset > 0);
      setHasNext(newOffset + limit < total);
    } catch (err) {
      console.error("Erreur lors du fetch:", err);
    } finally {
      setLoading(false);
    }
  },
  [offset, loading]
);


  useEffect(() => {
    fetchGrimpeurs("next"); // initial
  }, []);

  // Détection bas de page → charger la suite
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

  // Détection haut de page → recharger anciens grimpeurs
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
    <div className="overflow-auto flex flex-col gap-1">
      <div ref={topSentinelRef}/>

      {grimpeurs.map((g) => (
        <ClientCardForList key={g.NumGrimpeur} client={g} />
      ))}

      <div ref={bottomSentinelRef} className="h-1" />

      {loading && <p className="col-span-full text-center">Chargement...</p>}

      {!hasNext && !loading && (
        <p className="text-center text-gray-500">
          Vous avez atteint la fin de la liste.
        </p>
      )}
    </div>
  );
}
