import { ClientEntrance } from "@/src/components/client_ui/clientEntrance";
import { ClientGrid } from "@/src/components/client_ui/clientInfo";
import { Button } from "@/src/components/ui/button";
import { fetchGrimpeurById, isAlreadyEntered } from "@/src/services/api";
import Link from "next/link";

const MainPage = async ({
  searchParams,
}: {
    searchParams?: {
    id?: string;
    query?: string;
  };
}) => {
  const query = (await searchParams)?.query || "";
  const id = (await searchParams)?.id;

  if (!id) {
    return (
      <div className="container flex items-center justify-center h-full">
        <p className="text-gray-500">Aucun grimpeur sélectionné</p>
      </div>
    );
  }

  const num = id ? Number(id) : null;
  const clientInfo = num !== null ? await fetchGrimpeurById(num) : null;
  const fieldInfoClient = [
      { label: "Nom", value: clientInfo.NomGrimpeur },
      { label: "Prénom", value: clientInfo.PrenomGrimpeur },
      { label: "Date de naissance", value: clientInfo.DateNaissGrimpeur },
      { label: "Numéro de grimpeur", value: clientInfo.NumGrimpeur },
      { label: "Numéro de licence", value: clientInfo.NumLicenceGrimpeur },
      { label: "Téléphone", value: clientInfo.TelGrimpeur },
      { label: "Email", value: clientInfo.EmailGrimpeur },
      { label: "Adresse", value: clientInfo.AdresseGrimpeur },
    ];

  return (
    <div className="pr-5 flex flex-col gap-2 h-full relative">

      <div className="border rounded flex-1">
        {/* Petit message qui est sensé s'afficher seulement si le Bot ne 
        prends pas toute la place et si le grimpeur est déjà rentrée */}
        {await isAlreadyEntered(clientInfo.NumGrimpeur) ? (
          <p className="absolute left-10 text-red-600">Est déjà rentré aujourd'hui</p>
            ) : (
          <p></p>
        )}
        {/* Conteneur principal avec image + tableau */}
        <div className="flex gap-5 items-center justify-center h-full">
          
          {/* Image à gauche */}
          <div className="flex-[1]">
              <img 
              src="/avatar.png"
              alt="Grimpeur" 
              className="w-full h-auto rounded"
                />
          </div>

          {/* Grille des grimpeurs */}
          <div className="flex-[4] grid grid-cols-1 md:grid-cols-3 gap-6">
            <ClientGrid fieldInfoClient={fieldInfoClient} />
            <Link 
            href={`/client/info?query=${query}&id=${id}`}
            className="border border-dashed p-4 flex items-center justify-center"
            >
              +
            </Link>
          </div>
        </div>
      </div>

      <div className="border rounded flex-1 flex items-center justify-center">
        
        <ClientEntrance num={num}/>
        <Link href={`/client/market?query=${query}&id=${id}`}>
          <Button variant="outline">Achats</Button>
        </Link>

      </div>

    </div>
  );
}

export default MainPage;