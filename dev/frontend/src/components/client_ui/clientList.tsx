import { fetchGrimpeurById, fetchGrimpeurSearch } from "@/src/services/api"
import { ClientCard } from "./clientCard";

const ClientList = async ({ query }: { query: string }) => {
    if (!query) {
        return <div>Please provide an entry</div>;
    }

    const rep = await fetchGrimpeurSearch(query);
    
    if (!rep) {
        return <div>Pas de résultats</div>;
    }
    return (
        <div className="flex flex-col">
            {rep.map((grimpeur) => (
                <div key={grimpeur.NumGrimpeur} className="pl-2 pr-2 pt-2">
                <ClientCard prenom={grimpeur.PrenomGrimpeur} nom={grimpeur.NomGrimpeur} num={grimpeur.NumGrimpeur}/>
                </div>
            ))}
        </div>
    );
}

export default ClientList;