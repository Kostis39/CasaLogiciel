import SearchClient from "@/src/components/client_ui/clientSearch"
import ClientList from "@/src/components/client_ui/clientList";

const Admin = async ({
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

export default Admin;

