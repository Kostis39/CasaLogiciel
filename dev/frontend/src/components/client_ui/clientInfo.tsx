"use client";
import { deleteSeance, isAlreadyEntered, isDateValid, postSeanceClient, updateCotisationClient } from "@/src/services/api";
import { clientFields } from "@/src/types&fields/fields";
import { Client, ApiResponse } from "@/src/types&fields/types";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button"
import { toast } from "react-toastify";

interface ClientGridProps {
  clientInfo: Client;
}

export function ClientGrid( {clientInfo} : ClientGridProps ) {
  
  const [inCasa, setInCasa] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let alreadyCalled = false;

    const fetchEnteredStatus = async () => {
      if (alreadyCalled) return;
      alreadyCalled = true;

      setLoading(true);

      if (clientInfo.NumGrimpeur === null) {
        setInCasa(false);
        setLoading(false);
        return;
      }

      try {
        const status = await isAlreadyEntered(clientInfo.NumGrimpeur);
        setInCasa(status);

        if (!status) {
          const result = await postSeanceClient(clientInfo.NumGrimpeur);

          if (!result.success) {
            toast.warning(result.message);
            setInCasa(false);
          } else {
            toast.success(result.message);
            setInCasa(true);
          }
        }
      } catch (error) {
        toast.warning("Erreur lors de la vérification du statut d'entrée");
        setInCasa(false);
      } finally {
        setLoading(false);
      }
    };

    fetchEnteredStatus();
  }, [clientInfo.NumGrimpeur]);



    const handleClick1 = () => {
      setInCasa(!inCasa);
      alert("Fiare entrée unique");
      postSeanceClient(clientInfo.NumGrimpeur);
    };
    const handleClick2 = async () => {
      const response = await deleteSeance(clientInfo.NumGrimpeur);
      response.success ? toast.success(response.message) : toast.error(response.message), setInCasa(false);
    };


    const fieldInfoClient = clientFields.map(f => ({ label: f.label, value: f.format ? f.format(clientInfo[f.key]) : clientInfo[f.key] ?? "—", }));


  return (
    <div className={`flex flex-col h-full ${getStatutVoieBg(clientInfo.StatutVoie)}`}>
      <div className="overflow-auto [flex:1] flex items-center">

        <div className="flex flex-col items-center gap-0.5 mr-4">
          {isLoading ? (
            <div>Chargement...</div>
          ) : inCasa ? (
            <div className="text-green-500 font-bold">En salle</div>
          ) : (
            <div className="text-red-500 font-bold">Hors salle</div>
          )}
          <Image src="/avatar.png" alt="Avatar" width={200} height={200}/>
          <p>{clientInfo.NumGrimpeur}</p>
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

          <div className="flex flex-col justify-center break-words col-span-2">
            <p className="text-sm font-semibold text-gray-700">Note</p>
            <div className="border border-gray-700 rounded p-2 max-h-24 overflow-y-auto whitespace-pre-line">
              {clientInfo.Note || "—"}
            </div>
          </div>



          <Link
          href={`./grimpeurs/?id=${clientInfo.NumGrimpeur}`}
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
          <div className="flex flex-col items-center justify-center">
            {CotisationInfo(clientInfo)}
          </div>

          <div className="flex flex-col items-center justify-center">
            {signatureClient("Règlement Intérieur", clientInfo.AccordReglement, clientInfo.CheminSignature)}
          </div>

          <div className="flex flex-col items-center justify-center">
            {signatureClient("Autorisation Parentale", clientInfo.AccordParental, clientInfo.CheminSignature)}
          </div>

          <div className="flex flex-col items-center">
            {AbonnementInfo(clientInfo)}
          </div>

          <div className="flex flex-col items-center">
            {EntreeInfo(clientInfo)}
          </div>

          <div className="flex flex-col items-center">
            {AccesSalleInfo(clientInfo)}
          </div>
        </div>

        {/* Actions sur le profil du grimpeur */}
        <div className="grid grid-cols-2">
          <div className="flex justify-center">
            <Button
              onClick={handleClick1}
              disabled={isLoading}
              variant="outline"
              className="w-3/4 h-3/4 text-lg"
            >
              Entrée
            </Button>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={inCasa ? handleClick2 : undefined}
              disabled={!inCasa || isLoading}
              variant="outline"
              className="w-3/4 h-3/4 text-lg"
            >
              Annuler Entrée
            </Button>
          </div>
        </div>


      </div>
    </div>
  );
}

function signatureClient(typeSignature: string, accord: boolean | undefined, cheminSignature: string | undefined){
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="font-bold text-gray-700">{typeSignature}</p>
      {accord ? (
          <p className="text-green-500 font-bold">Signé</p>
      ) : (
        <p className="text-red-500 font-bold">Non Signé</p>
      )}
    </div>
  );

}

function CotisationInfo(client: Client){
  let content;
  if (client.DateFinCoti !== null && client.DateFinCoti !== undefined) {
    content = (
      <>
      {isDateValid(client.DateFinCoti) ? (
        <>
          <p className="text-green-500 font-bold">Cotisation Active</p>
          <p>Fin le {client.DateFinCoti}</p>
        </>
      ) : (
        <>
          <p className="text-red-500 font-bold">Cotisation Expirée</p>
          <p>Fin le {client.DateFinCoti}</p>
        </>
      )}
      </>
    );
    } else {
      content = <p className="text-red-500 font-bold">Pas de cotisation</p>;
    }
    return (
      <div className="flex flex-col items-center justify-center">
        {content}
      </div>
    );
  }

function checkBoxCotisation(client: Client){
  const [checked, setChecked] = useState<boolean>(isDateValid(client.DateFinCoti));

  const handleCheckboxChange = () => {
    setChecked(!checked);
    updateCotisationClient(client);
  };

  return (
    <label className="flex flex-col items-center justify-center">
      <p className={`${client.DateFinCoti ? "" : "text-red-300"} text-sm font-bold text-gray-700`}>Cotisation</p>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleCheckboxChange}
        className="w-5 h-5 accent-blue-600"
      />
      <p className={isDateValid(client.DateFinCoti) ? "" : "text-red-300"}>{client.DateFinCoti}</p>
    </label>
  );
}

function AbonnementInfo(client: Client){
  let content;
  if (client.DateFinAbo === null || client.DateFinAbo === undefined) {
    content = <p className="font-bold text-gray-700">Pas d'abonnement</p>;
  } else if (isDateValid(client.DateFinAbo)) {
    content = (
      <>
        <p className="text-green-500 font-bold">Abonnement Actif</p>
        <p>Fin le {client.DateFinAbo}</p>
      </>
    );
  } else {
    content = (
      <>
        <p className="text-red-500 font-bold">Abonnement Expiré</p>
        <p>Fin le {client.DateFinAbo}</p>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {content}
    </div>
  );
}

function EntreeInfo(client: Client){
  let content;
  if (!client.NbSeanceRest || client.NbSeanceRest <= 0) {
    content = <p className="font-bold text-gray-700">Pas d'entrées</p>;
  } else {
    content = (
      <>
        <p className="text-green-500 font-bold">Nombre d'entrée restantes</p>
        <p>{client.NbSeanceRest}</p>
      </>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center">
      {content}
    </div>
  );
}



function AccesSalleInfo(client: Client){
  let content;
  if (client.StatutVoie === 3) {
    content = <p className="font-bold">Tête</p>;
  }else if (client.StatutVoie === 2) {
    content = <p className="font-bold">Moulinette</p>;
  }else{
    content = <p className="font-bold">Bloc</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="font-bold text-gray-700">Accées Salle</p>
      {content}
    </div>
  );
}

export function getStatutVoieBg(StatutVoie: number | undefined) {
  switch (StatutVoie) {
    case 1: // Bloc
      return "bg-orange-300"; // orange a faire 
    case 2: //Voie
      return "bg-green-300";
    case 3: // Tête
      return "bg-blue-300";
    default:
      return "bg-orange-300";
  }
}
