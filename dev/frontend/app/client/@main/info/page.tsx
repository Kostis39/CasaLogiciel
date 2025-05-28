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
    <div>
        <div className="flex-1 border border-amber-950">
            {await isAlreadyEntered(clientInfo.NumGrimpeur) ? (
            <p className=" left-10 text-red-600">Est déjà rentré aujourd'hui</p>
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
          {fieldInfoClient.map(({ label, value }) => (
            <div key={label} className="border p-2 rounded bg-white shadow">
              <strong className="block text-sm font-semibold text-gray-700">{label}</strong>
              <span className="text-base">{value}</span>
            </div>
          ))}
        <Link 
        href={`/client?query=${query}&id=${id}`}
        className="border border-dashed p-4 flex items-center justify-center">
            Voir moins
        </Link>

        <Link
        href={`/client?query=${query}&id=${id}`} //  Lien vers la page de modification
        className={`${buttonVariants({size: "lg"})}  right-2 bg-blue-600 text-white`}
        >
            Modifier
        </Link>
    </div>
    </div>
    </div>
    </div>
  );
}

export default InfoListPage;