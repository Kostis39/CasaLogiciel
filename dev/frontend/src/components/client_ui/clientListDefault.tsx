"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { fetchClients, fetchClientSearch } from "@/src/services/api";
import { ClientCard } from "./clientCard";
import { useSearchParams, useRouter } from "next/navigation";
import LoadingSpinner from "./LoadingSpinner";
import { Client } from "@/src/types&fields/types";

export const ClientListClientComponent = ({ query }: { query: string }) => {
  const [grimpeurs, setGrimpeurs] = useState<Client[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasNext, setHasNext] = useState(true);
  const [hasPrev, setHasPrev] = useState(false);
  const [offset, setOffset] = useState(0);

  const limit = 20;
  const BUFFER_SIZE = 60;

  const topSentinelRef = useRef<HTMLDivElement | null>(null);
  const bottomSentinelRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const fetchGrimpeurs = useCallback(
    async (direction: "next" | "prev", reset = false) => {
      if (loading) return;
      setLoading(true);

      try {
        let newOffset = offset;

        if (reset) {
          newOffset = 0;
        } else {
          newOffset =
            direction === "next"
              ? offset + limit
              : Math.max(offset - limit, 0);
        }

        let data: Client[] = [];
        let total = 0;

        if (query && query.trim() !== "") {
          ({ data, total } = await fetchClientSearch(query, limit, newOffset));
        } else {
          ({ data, total } = await fetchClients(limit, newOffset));
        }

        setGrimpeurs((prev) => {
          let combined: Client[] = [];

          if (reset) {
            combined = data;
          } else if (direction === "next") {
            combined = [...prev, ...data];
          } else {
            combined = [...data, ...prev];
          }

          const unique = combined.filter(
            (g, i, self) =>
              i === self.findIndex((x) => x.NumGrimpeur === g.NumGrimpeur)
          );

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
        setError(null);
      } catch (err) {
        console.error("Erreur fetchGrimpeurs:", err);
        setError("Une erreur est survenue lors du chargement.");
      } finally {
        setLoading(false);
      }
    },
    [offset, loading, query]
  );

  // --- Reset quand la recherche change ---
  useEffect(() => {
    setOffset(0);
    setGrimpeurs([]);
    setHasNext(true);
    setHasPrev(false);
    fetchGrimpeurs("next", true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  // --- Observer bas (scroll vers le bas) ---
  useEffect(() => {
    const bottom = bottomSentinelRef.current;
    if (!bottom) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNext && !loading) {
          fetchGrimpeurs("next");
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(bottom);
    return () => observer.disconnect();
  }, [fetchGrimpeurs, hasNext, loading]);

  // --- Observer haut (scroll vers le haut) ---
  useEffect(() => {
    const top = topSentinelRef.current;
    if (!top) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasPrev && !loading) {
          fetchGrimpeurs("prev");
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(top);
    return () => observer.disconnect();
  }, [fetchGrimpeurs, hasPrev, loading]);

  // --- Synchronisation du paramètre id ---
  useEffect(() => {
    if (grimpeurs.length > 0) {
      const shouldCreateSeance = searchParams.get("createSeance") === "true";
      const newId = grimpeurs[0].NumGrimpeur.toString();

      if (shouldCreateSeance || grimpeurs.length === 1) {
        const params = new URLSearchParams(searchParams);
        params.set("id", newId);
        if (shouldCreateSeance) {
          params.set("createSeance", "true");
        }
        router.replace(`?${params.toString()}`);
      }
    }
  }, [grimpeurs, searchParams, router]);

  if (grimpeurs.length === 0 && !loading && !error) {
    return (
      <div className="text-center text-gray-500 py-4">
        Aucun client trouvé.
      </div>
    );
  }
  // === UI ===
  return (
    <div ref={listRef} className="flex flex-col">
      <div ref={topSentinelRef} className="h-1" />

      {grimpeurs.map((g) => (
        <div key={g.NumGrimpeur} className="pl-2 pr-2 pt-2">
          <ClientCard
            prenom={g.PrenomGrimpeur}
            nom={g.NomGrimpeur}
            num={g.NumGrimpeur}
            statutVoie={g.StatutVoie}
          />
        </div>
      ))}

      <div ref={bottomSentinelRef} className="h-1" />

      {loading && (
        <LoadingSpinner/>
      )}

      {!hasNext && !loading && grimpeurs.length > 0 && (
        <div className="text-center text-gray-500 py-2">
          Vous avez atteint la fin de la liste.
        </div>
      )}

      {error && <div className="text-red-500 text-center py-2">{error}</div>}
    </div>
  );
};
