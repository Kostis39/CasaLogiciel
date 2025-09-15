"use client";
import "./client.css";

// import react

// import next
import Link from "next/link";
import { useSearchParams } from "next/navigation";

// import ui components
import SearchClient from "@/src/components/client_ui/clientSearch";
import { ClientListClientComponent } from "@/src/components/client_ui/clientListDefault";
import { ClientGrid } from "@/src/components/client_ui/clientInfo";

// import shadcnui
import { buttonVariants } from "@/src/components/ui/button";

// import hook
import { useClientInfo } from "@/src/hooks/client_hook";



const Page = () => {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || '';
  const id = searchParams.get("id") || '';
  const num = id ? Number(id) : null;

  const clientInfo = useClientInfo(num);

  return (
    <div className="mainClientContainer">

      {/* Side bar with all menu button */}
      <div className="aside">
        1
      </div>
      
      {/* Top bar with searchs bar for client and products */}
      <div className="topbar">
        <SearchClient />
      </div>

      {/* Market section with product list */}
      <div className="market">
        4
      </div>

      {/* Bank section with cart and option for payement */}
      <div className="bank">
        5
      </div>

      {/* Climber section with client list, client info and history of actions */}
      <div className="climber">
        {/* Client List */}
        <div className="bg-amber-50">
          <ClientListClientComponent query={query} />
        </div>

        {/* Client Info */}
        <div className="bg-amber-400 flex-[4] grid grid-cols-1 md:grid-cols-3 gap-6">
          <ClientGrid clientInfo={clientInfo} />

          <Link
            href={`/client?query=${query}&id=${id}`}
            className={`${buttonVariants({ size: "lg" })} bg-blue-600 text-white col-span-full md:col-span-1`}>
            Modifier
          </Link>
        </div>

        {/* History of actions */}
        <div className="bg-amber-950">
          Historique
        </div>
      </div>
    </div>
    );
};

export default Page;
