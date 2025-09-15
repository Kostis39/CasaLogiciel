import { updateCotisationClient } from "@/src/services/api";
import { clientFields } from "@/src/types&fields/fields";
import { Client } from "@/src/types&fields/types";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";


function getAccesMurBg(accesMur: number | undefined) {
  switch (accesMur) {
    case 1:
      return "bg-green-100";
    case 2:
      return "bg-violet-100";
    case 3:
      return "bg-blue-100";
    default:
      return "bg-green-100";
  }
}

function isEntered(num: number){
  return (
    <span className="mb-2 text-xs text-gray-500">Déjà rentrée (a faire)</span>
  );
}

function haveCotisation(dateFinCoti: string | undefined | null): boolean {
  if (!dateFinCoti) return false;
  const today = new Date();
  const cotiDate = new Date(dateFinCoti);
  return cotiDate >= today;
}

function checkBoxCotisation(client: Client){
  const [checked, setChecked] = useState<boolean>(haveCotisation(client.DateFinCoti));

  const handleCheckboxChange = () => {
    setChecked(!checked);
    updateCotisationClient(client);

  };

  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
        className="w-5 h-5 accent-blue-600"
      />
      <span>{"label"}</span>
    </label>
  );

}

export function ClientGrid( {clientInfo} : {clientInfo: Client | null} ) {
  if (!clientInfo) {
    return <p>Aucun client sélectionné.</p>;
  }

  const fieldInfoClient = clientFields.map(f => ({
    label: f.label,
    value: f.format ? f.format(clientInfo[f.key]) : clientInfo[f.key] ?? "—",
  }));

  return (
    <div className={`flex flex-col h-full ${getAccesMurBg(clientInfo.AccesMur)}`}>
      <div className="overflow-auto [flex:1] flex items-center">

        <div className="flex flex-col items-center gap-0.5 mr-4">
          {isEntered(clientInfo.NumGrimpeur)}
          <Image src="/avatar.png" alt="Avatar" width={200} height={200}/>
          <span>{clientInfo.NumGrimpeur}</span>
        </div>

        <div className="flex-1 grid grid-cols-4 gap-2 h-full">
          {fieldInfoClient.map(({ label, value }) => (
          <div key={label} className="flex flex-col justify-center break-words overflow-auto">
            <div className="break-words whitespace-pre-line w-full">
              <p className="text-sm font-semibold text-gray-700">{label}</p>
              <p>{value}</p>
            </div>
          </div>
          ))}

          <Link
          href="/inscription"
          className="flex items-center justify-center mr-3 border border-black rounded hover:bg-gray-100 transition"
          >
            <p className="text-sm font-semibold text-gray-700 ">
              Modifier
            </p>
          </Link>
        </div>
      </div>

      <div className="[flex:2] grid grid-rows-[3fr_1fr]">

        {/* Suite des infos du grimpeur*/}
        <div className="grid grid-cols-3 grid-rows-2">
          <div>
            {checkBoxCotisation(clientInfo)}
          </div>

          <div>
            Réglement
          </div>

          <div>
            Autorisation Parentale
          </div>

          <div>
            Fin abo
          </div>

          <div>
            nb Entrée
          </div>

          <div>
            Accès
          </div>
        </div>

        {/* Actions sur le profil du grimpeur */}
        <div className="grid grid-cols-2">
          <div>
            Annuler Entree
          </div>

          <div>
            Entree Unique
          </div>
        </div>





      </div>
    </div>
  );
}

