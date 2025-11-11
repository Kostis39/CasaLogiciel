"use client";

import { ClientGrid } from "@/src/components/client_ui/clientInfo";
import { ClientListClientComponent } from "@/src/components/client_ui/clientListDefault";
import ClientEdit from "@/src/components/client_ui/clientModif";
import SearchClient from "@/src/components/client_ui/clientSearch";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function ClientPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";
  const id = searchParams.get("id");
  const createSeance = searchParams.get("createSeance") === "true";
  const [mode, setMode] = useState(0);

  const num = id ? Number(id) : null;

  const handleEdit = () => setMode(1);

  const handleCancelEdit = () => setMode(0);

  return (
    <div className="flex flex-col gap-1 min-h-0">
      <div>
        <SearchClient />
      </div>

      <div className="grid gap-1" style={{ gridTemplateColumns: "1fr 5fr" }}>
        <div className="flex flex-col overflow-auto h-[96vh]">
          <ClientListClientComponent query={query} />
        </div>

        {!num ? (
          <p className="text-gray-500 text-center py-8">
            Aucun client sélectionné.
          </p>
        ) : mode === 1 ? (
        <div className="flex flex-col overflow-auto h-[96vh]">
            <ClientEdit numClient={num} onCancel={handleCancelEdit} />
          </div>
        ) : (
          <ClientGrid numClient={num} onEdit={handleEdit} createSeance={createSeance} />
        )}
      </div>
    </div>
  );
}
