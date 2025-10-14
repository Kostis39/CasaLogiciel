"use client";

import { ClientGrid } from "@/src/components/client_ui/clientInfo";
import { ClientListClientComponent } from "@/src/components/client_ui/clientListDefault";
import ClientEdit from "@/src/components/client_ui/clientModif";
import SearchClient from "@/src/components/client_ui/clientSearch";
import { useClientInfo } from "@/src/hooks/client_hook";
import { useSearchParams, useRouter } from "next/navigation";

export default function Saisies() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get("query") || "";
  const id = searchParams.get("id");
  const mode = searchParams.get("mode") || "view"; // 👈 récupère le mode depuis l’URL

  const num = id ? Number(id) : null;
  const clientInfo = useClientInfo(num);

  const setMode = (newMode: "view" | "edit") => {
    const params = new URLSearchParams(searchParams);
    params.set("mode", newMode);
    router.replace(`?${params.toString()}`);
  };

  const clearMode = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("mode");
    router.replace(`?${params.toString()}`);
  };

  const handleEdit = () => setMode("edit");
  const handleCancelEdit = () => setMode("view");

  return (
    <div className="flex flex-col gap-1">
      <div>
        <SearchClient />
      </div>

      <div className="grid gap-1" style={{ gridTemplateColumns: "1fr 5fr" }}>
        {/* Liste des clients */}
        <div className="flex flex-col overflow-auto h-[96vh]">
          <ClientListClientComponent query={query} />
        </div>

        {/* Zone de droite : Info / Édition */}
        {!clientInfo ? (
          <p className="text-gray-500 text-center py-8">Aucun client sélectionné.</p>
        ) : mode === "edit" ? (
			<div className="overflow-auto h-[96vh]">
          <ClientEdit clientInfo={clientInfo} onCancel={handleCancelEdit} /> </div>
        ) : (
          <ClientGrid clientInfo={clientInfo} onEdit={handleEdit} />
        )}
      </div>
    </div>
  );
}
