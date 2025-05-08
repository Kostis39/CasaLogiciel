import SearchClient from "@/src/components/client_ui/clientSearch"
import ClientList from "@/src/components/client_ui/clientList";

const ClientPage = async ({
  searchParams,
}: {
  searchParams?: { query?: string };
}) => {
  const query = (await searchParams)?.query || '';

  return (
    <div>
      <h1>Recherche de grimpeur:</h1>
      <SearchClient />
      <ClientList query={query} />
    </div>
  );
};

export default ClientPage;


/**
import "./client.css";
import { ClientHeader } from "@/src/components/client_ui/clientHeader";
import { ClientAside } from "@/src/components/client_ui/clientAside";
import { Content } from "@/src/components/client_ui/clientContent";
import { fetchGrimpeurById } from '@/src/services/api';
export  default async function ClientHome() {
  const data = await fetchGrimpeurById(1);

  return (
    <div className="mainClientContainer w-full h-screen">

      
      <div className="headerClient bg-blue-50 ">
        <ClientHeader />
      </div>

      <div className="bg-amber-400">
        <ClientAside />
      </div>

      <div className="bg-red-400">
      <p>{data.NomGrimpeur}</p>
        <Content/>

      </div>

    </div>
  );
}
*/