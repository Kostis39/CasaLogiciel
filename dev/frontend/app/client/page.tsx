import "./client.css";
import { ClientHeader } from "@/src/components/client_ui/clientHeader";
import SearchClient from "@/src/components/client_ui/clientSearch";
import ClientList from "@/src/components/client_ui/clientList";
import { fetchGrimpeurById, isAlreadyEntered } from "@/src/services/api";
import { ClientMenu } from "@/src/components/client_ui/clientMenu";

const ClientHome = async ({
  searchParams,
}: {
    searchParams?: {
    query?: string;
    id?: string;
  };
}) => {
  const query = (await searchParams)?.query || '';
  const id = (await searchParams)?.id;
  const num = id ? Number(id) : null;
  const fields = await fetchGrimpeurById(num);

  return (
    <div className="mainClientContainer w-full h-screen">
      
      <div className=" bg-blue-50 ">
        <ClientHeader />
      </div>

      <div className="grid gap-2" style={{ gridTemplateColumns: "1fr 5fr" }}>
        <div>
          <SearchClient />
          <ClientList query={query} />
        </div>
        <div>
          {fields ? <ClientMenu fields={fields} />: <p>Veuillez vous connecter.</p>}
          
        </div>
      </div>

    </div>
  );
  }


export  default ClientHome;