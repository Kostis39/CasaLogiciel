import ClientList from "@/src/components/client_ui/clientList";

const ListPage = async ({
    searchParams,
    }: {
        searchParams?: {
        query?: string;
    };}) => {
    const query = (await searchParams)?.query || '';
    return (
        <div className="overflow-auto max-h-[83vh]">
            <ClientList query={query} />
        </div>
    );
}
export  default ListPage;