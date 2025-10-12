"use client";

import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import clsx from "clsx";
import { getStatutVoieBg } from "./clientInfo";
import { Client } from "@/src/types&fields/types";
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
  const searchParams = useSearchParams();
  const router = useRouter();

  const selectedId = searchParams.get("id");
  const isSelected = selectedId === client.NumGrimpeur.toString();

  const handleClick = () => {
    const params = new URLSearchParams(searchParams);
    params.set("id", client.NumGrimpeur.toString());
    router.replace(`?${params.toString()}`);  // utilise push pour garder historique
  };
return (
<tr
  onClick={handleClick}
  className={clsx(
    getStatutVoieBg(client.StatutVoie),
    "hover:scale-[1.01] hover:ring-1 hover:ring-blue-300 hover:ring-inset transition-all",
    { "ring-2 ring-blue-600 ring-inset" : isSelected }
    )}
>
  <td className=" text-center">
    <Image
      src="/avatar.png"
      alt="Avatar"
      width={40}
      height={40}
      className="rounded-full inline-block"
    />
  </td>
  <td>
    {client.NomGrimpeur}
  </td>
  <td >
    {client.PrenomGrimpeur}
  </td>
  <td className="text-center">{client.AccordReglement ? "✅" : "❌"}</td>
  <td className="text-center">{isDateValid(client.DateFinCoti) ? "✅" : "❌"}</td>
  <td>
    {client.Club || "_"}
  </td>
  <td >
    {client.NumLicenceGrimpeur || "_"}
  </td>
  <td className="text-center">{isDateValid(client.DateFinAbo) ? "✅" : "❌"}</td>
  <td className="text-center">{client.NbSeanceRest ? "✅" : "❌"}</td>
</tr>

  );
}
