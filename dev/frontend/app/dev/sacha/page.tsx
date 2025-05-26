import SearchClient from "@/src/components/client_ui/clientSearch"
import ClientList from "@/src/components/client_ui/clientList";
import ClientInfo from "@/src/components/client_ui/clientInfo";

const Admin = async ({
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

  return (
    <div>
      <h1>Recherche de grimpeur:</h1>
      <SearchClient />
      <ClientList query={query} />
      <ClientInfo num={num}/>
    </div>
  );
};

export default Admin;

