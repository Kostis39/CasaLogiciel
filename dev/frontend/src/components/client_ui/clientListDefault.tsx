"use client";
import { useEffect, useState } from "react";
import { fetchClientSearch } from "@/src/services/api";
import { ClientCard } from "./clientCard";

export const ClientListClientComponent = ({ query }: { query: string }) => {
  const [grimpeurs, setGrimpeurs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const searchGrimpeurs = async () => {
      if (!query) {
        setGrimpeurs([]);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const rep = await fetchClientSearch(query);
        setGrimpeurs(rep || []);
      } catch (err) {
        console.error('Erreur lors de la recherche:', err);
        setError('Erreur lors de la recherche');
        setGrimpeurs([]);
      } finally {
        setLoading(false);
      }
    };

    searchGrimpeurs();
  }, [query]);

  if (!query) {
    return <div>Please provide an entry</div>;
  }

  if (loading) {
    return <div>Recherche en cours...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (grimpeurs.length === 0) {
    return <div>Pas de résultats</div>;
  }

  return (
    <div className="flex flex-col">
      {grimpeurs.map((grimpeur) => (
        <div key={grimpeur.NumGrimpeur} className="pl-2 pr-2 pt-2">
          <ClientCard 
            prenom={grimpeur.PrenomGrimpeur} 
            nom={grimpeur.NomGrimpeur} 
            num={grimpeur.NumGrimpeur}
          />
        </div>
      ))}
    </div>
  );
};