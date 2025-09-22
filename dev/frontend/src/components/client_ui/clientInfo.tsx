"use client";
import { deleteSeance, isAlreadyEntered, isDateValid, postSeanceClient, updateCotisationClient } from "@/src/services/api";
import { clientFields } from "@/src/types&fields/fields";
import { Client, MResponse } from "@/src/types&fields/types";
import Image from "next/image";
import Link from "next/link";
import {useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu"
import { toast } from "react-toastify";

interface ClientGridProps {
  clientInfo: Client;
}

export function ClientGrid( {clientInfo} : ClientGridProps ) {
  
  const [inCasa, setInCasa] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchEnteredStatus = async () => {
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
          
          const result : MResponse = await postSeanceClient(clientInfo.NumGrimpeur);

          if (!result.success) {
            toast.warning(`${result.message}`);
            setInCasa(false);
          } else {
            toast.success(`${result.message}`);
            setInCasa(true);
          }
        }
      } catch (error) {
        console.error("Erreur lors de la vérification du statut d'entrée :", error);
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
  const handleClick2 = () => {
    setInCasa(!inCasa);
    deleteSeance(clientInfo.NumGrimpeur);
  };


  const fieldInfoClient = clientFields.map(f => ({
    label: f.label,
    value: f.format ? f.format(clientInfo[f.key]) : clientInfo[f.key] ?? "—",
  }));

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
          <div className="flex flex-col items-center justify-center">
            {checkBoxCotisation(clientInfo)}
          </div>

          <div>
            Réglement
          </div>

          <div>
            Autorisation Parentale
          </div>

          <div className="flex flex-col items-center">
            {abonnementInfo(clientInfo)}
          </div>

          <div className="flex flex-col items-center">
            {EntreeInfo(clientInfo)}
          </div>

          <div className="flex flex-col items-center">
            {StyledDropdown()}
          </div>
        </div>

        {/* Actions sur le profil du grimpeur */}
        <div className="grid grid-cols-2">
          <div>
            <Button
              onClick={handleClick1}
              disabled={isLoading} // ✅ désactive si en cours de chargement
              variant="outline"
            >
              Entrée
            </Button>
          </div>

          <div>
            <Button
              onClick={inCasa ? handleClick2 : undefined}
              disabled={!inCasa || isLoading} // ✅ désactive si en cours de chargement
              variant="outline"
            >
              Annuler Entrée
            </Button>
          </div>

        </div>

      </div>
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

function abonnementInfo(client: Client){
  let content;
  if (client.DateFinAbo === null || client.DateFinAbo === undefined) {
    content = <span className="text-sm font-semibold text-gray-700">Pas d'abonnement</span>;
  } else if (isDateValid(client.DateFinAbo)) {
    content = (
      <>
        <span className="text-green-500 font-bold">Abonnement Actif</span>
        <span>Fin le {client.DateFinAbo}</span>
      </>
    );
  } else {
    content = (
      <>
        <span className="text-red-500 font-bold">Abonnement Expiré</span>
        <span>Fin le {client.DateFinAbo}</span>
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
    content = <span className="text-sm font-semibold text-gray-700">Pas d'entrées</span>;
  } else {
    content = (
      <>
        <span className="text-green-500 font-bold">Nombre d'entrée restantes</span>
        <span>{client.NbSeanceRest}</span>
      </>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center">
      {content}
    </div>
  );
}



function acceeSalleDropdown() {
  const [position, setPosition] = useState("1");
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">{position}</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Accès Salle</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
          <DropdownMenuRadioItem value="1">Bloc</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="2">Moulinette</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="3">Tête</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function StyledDropdown() {
  return (
    <div className="flex flex-col items-center justify-center">
      {acceeSalleDropdown()}
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
