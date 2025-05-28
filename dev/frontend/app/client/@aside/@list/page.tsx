import ClientList from "@/src/components/client_ui/clientList";

const ListPage = async ({
    searchParams,
    }: {
        searchParams?: {
        query?: string;
    };}) => {
    const query = (await searchParams)?.query || '';
    return (
        <ClientList query={query} />
    );
}
export  default ListPage;