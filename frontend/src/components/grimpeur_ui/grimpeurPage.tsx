"use client";
import { GrimpeurGrid } from "@/src/components/grimpeur_ui/grimpeurInfo";
import { GrimpeurListGrimpeurComponent } from "@/src/components/grimpeur_ui/grimpeurListDefault";
import GrimpeurEdit from "@/src/components/grimpeur_ui/grimpeurModif";
import SearchGrimpeur from "@/src/components/grimpeur_ui/grimpeurSearch";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function GrimpeurPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const query = searchParams.get("query") || "";
  const id = searchParams.get("id");
  const createSeance = searchParams.get("createSeance") === "true";
  const [mode, setMode] = useState(0);
  const num = id ? Number(id) : null;

  const handleEdit = () => setMode(1);
  const handleCancelEdit = () => setMode(0);
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    setMode(0);
  }, [id]);

  const handleGrimpeurUpdated = () => {
    setRefreshKey(prev => prev + 1); // Force le re-render
  };

  // ✅ Fonction pour nettoyer l'URL après annulation d'entrée
  const handleSeanceCanceled = () => {
    const newUrl = `?id=${id}${query ? `&query=${query}` : ""}`;
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex flex-col gap-1 min-h-0">
      <div>
        <SearchGrimpeur />
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: "1fr 5fr" }}>
        <div className="flex flex-col overflow-auto h-[96vh]">
          <GrimpeurListGrimpeurComponent query={query} refreshKey={refreshKey}/>
        </div>
        {!num ? (
          <p className="text-gray-500 text-center py-8">
            Aucun grimpeur sélectionné.
          </p>
        ) : mode === 1 ? (
          <div className="flex flex-col overflow-auto h-[96vh]">
            <GrimpeurEdit numGrimpeur={num} onCancel={handleCancelEdit} onGrimpeurUpdated={handleGrimpeurUpdated}/>
          </div>
        ) : (
          <GrimpeurGrid 
            numGrimpeur={num} 
            onEdit={handleEdit}
            createSeance={createSeance}
            onSeanceCanceled={handleSeanceCanceled} // ✅ Passer la fonction
          />
        )}
      </div>
    </div>
  );
}