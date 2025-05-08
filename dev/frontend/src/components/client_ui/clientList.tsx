import { fetchGrimpeurById } from "@/src/services/api"
import { ClientCard } from "./clientAside";

const ClientList = async ({ query }: { query: string }) => {
    if (!query) {
        return <div>Please provide an ID</div>;
    }

    const id = Number(query);
    
    if (isNaN(id)) {
        return <div>Invalid ID - must be a number</div>;
    }
    return (
            <ClientCard id={id} />
    );
}

export default ClientList;