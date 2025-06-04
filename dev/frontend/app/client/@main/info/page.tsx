import { ClientGrid } from "@/src/components/client_ui/clientInfo";
import { buttonVariants } from "@/src/components/ui/button";
import { fetchGrimpeurById, isAlreadyEntered } from "@/src/services/api";
import Link from "next/link";

const InfoListPage = async ({
  searchParams,
}: {
    searchParams?: {
    id?: string;
    query?: string;
  };
}) => {
  const query = (await searchParams)?.query || "";
  const id = (await searchParams)?.id;
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
      { label: "Code postal", value: clientInfo.CodePostGrimpeur },
      { label: "Ville", value: clientInfo.VilleGrimpeur },
      { label: "Type d'abonnement", value: clientInfo.TypeAbo ?? "—" },
      { label: "Type de ticket", value: clientInfo.TypeTicket ?? "—" },
      { label: "Fin d'abonnement", value: clientInfo.DateFinAbo },
      { label: "Fin de cotisation", value: clientInfo.DateFinCoti },
      { label: "Nombre de séances restantes", value: clientInfo.NbSeanceRest },
      { label: "Solde", value: clientInfo.Solde + " €" },
      { label: "Date d'inscription", value: clientInfo.DateInscrGrimpeur },
      { label: "Accord règlement", value: clientInfo.AccordReglement ? "Oui" : "Non" },
    ];

return (
  <div className="pr-5 h-full w-full relative">
    {await isAlreadyEntered(clientInfo.NumGrimpeur) ? (
      <p className="absolute left-10 text-red-600">Est déjà rentré aujourd'hui</p>
        ) : (
      <p></p>
    )}

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

        {/* Boutons */}
        <Link
          href={`/client?query=${query}&id=${id}`}
          className="border border-dashed p-4 rounded flex items-center justify-center text-center text-sm col-span-full md:col-span-1"
        >
          Voir moins
        </Link>

        <Link
          href={`/client?query=${query}&id=${id}`}
          className={`${buttonVariants({ size: "lg" })} bg-blue-600 text-white col-span-full md:col-span-1`}
        >
          Modifier
        </Link>
      </div>
    </div>
  </div>
);

}

export default InfoListPage;

