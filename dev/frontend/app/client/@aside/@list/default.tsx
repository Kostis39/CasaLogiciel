// app/client/@aside/@list/default.tsx
"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import ClientList from "@/src/components/client_ui/clientList";

const ListDefaultContent = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  return (
    <div className="overflow-auto max-h-[80vh]">
      <ClientList query={query} />
    </div>
  );
};

const ListDefault = () => {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <ListDefaultContent />
    </Suspense>
  );
};

export default ListDefault;