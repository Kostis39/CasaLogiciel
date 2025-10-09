"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { getStatutVoieBg } from "./clientInfo";
import { Client } from "@/src/types&fields/types";
import { toast } from "react-toastify";
import { isDateValid } from "@/src/services/api";

export function ClientCard(
  { prenom, nom, num, statutVoie }: { prenom: string , nom: string , num: number, statutVoie: number | undefined }
) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedId = searchParams.get("id");
  const isSelected = selectedId === num.toString();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set("id", num.toString());
    router.replace(`?${params.toString()}`);  // utilise push pour garder historique
  };

  return (
    <button
      className={clsx(
        "flex w-full items-center gap-3 rounded-xl border py-3 px-3 shadow-sm",
        getStatutVoieBg(statutVoie),
        {
          "border-blue-600 border-2": isSelected,
          "hover:border-blue-300": !isSelected,
        }
      )}
      onClick={handleClick}
      aria-pressed={isSelected}
    >
      <div>
        <Image src="/avatar.png" alt="Avatar" width={70} height={70} />
      </div>
      <div>
        <p className="font-bold mb-2">{prenom} {nom}</p>
        <p className="text-sm">{num}</p>
      </div>
    </button>
  );
}


export function ClientCardForList({ client }: { client: Client }) {
  return (
    <div
      className={clsx(
        "flex items-center gap-3 rounded-xl border py-3 px-3",
        getStatutVoieBg(client.StatutVoie)
      )}
    >
      <div>
        <Image src="/avatar.png" alt="Avatar" width={40} height={40} />
      </div>
      <p>{client.NumGrimpeur}</p>
      <p>{client.NomGrimpeur}</p>
      <p>{client.PrenomGrimpeur}</p>
      <p>{client.AccordReglement ? "✅" : "❌"}</p>
      <p>{isDateValid(client.DateFinCoti) ? "✅" : "❌"}</p>
      <p>{client.Club ? client.Club : "_"}</p>
      <p>{client.NumLicenceGrimpeur ? client.NumLicenceGrimpeur : "_"}</p>
      <p>{isDateValid(client.DateFinAbo) ? "✅" : "❌"}</p>
      <p>{client.NbSeanceRest ? "✅" : "❌"}</p>

    </div>
  );
}

