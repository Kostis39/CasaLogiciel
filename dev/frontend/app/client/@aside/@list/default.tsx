"use client";

import { useSearchParams } from "next/navigation";
import { ClientListClientComponent } from "@/src/components/client_ui/clientListDefault";

const ListDefault = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || '';

  return (
    <div className="overflow-auto max-h-[83vh]">
      <ClientListClientComponent query={query} />
    </div>
  );
};

export default ListDefault;
