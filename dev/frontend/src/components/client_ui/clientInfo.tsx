"use client";
import { deleteSeance, fetchClientById, fetchClubById, isAlreadyEntered, isDateValid, postSeanceClient, postTransaction, updateClientData, updateCotisationClient } from "@/src/services/api";
import { clientFields } from "@/src/types&fields/fields";
import { Client, ApiResponse, Club } from "@/src/types&fields/types";
import Image from "next/image";
import {useEffect, useRef, useState } from "react";
import { Button } from "@/src/components/ui/button"
import { toast } from "react-toastify";
import { API_URL } from "@/src/services/real";
import { ConfirmButton } from "./buttonConfirm";
import LoadingSpinner from "@/src/components/ui/LoadingSpinner";

interface ClientGridProps {
  numClient: number;
  onEdit?: () => void;
}

export function ClientGrid({ numClient, onEdit }: ClientGridProps) {
  const [inCasa, setInCasa] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const lastNumRef = useRef<number | null>(null);
  const [clientInfo, setClientInfo] = useState<Client | null>(null);
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const [clubName, setClubName] = useState<string>("");

  useEffect(() => {
    // si même client, ne rien faire
    if (lastNumRef.current === numClient) return;
    lastNumRef.current = numClient;

    const fetchEnteredStatus = async () => {
      setLoading(true);

      if (numClient == null) {
        setInCasa(false);
        setLoading(false);
        return;
      }

      try {
        const status = await isAlreadyEntered(numClient);
        setInCasa(status);

        // ⚠️ Ne créer une séance que si non déjà entré
        if (!status) {
          const result = await postSeanceClient(numClient);
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
    const loadClient = async () => {
      try {
        const data = await fetchClientById(numClient);
        setClientInfo(data);
        
        if (data?.ClubId) {
          try {
            const clubResponse = await fetchClubById(data.ClubId) as ApiResponse<Club>;
            if (clubResponse.success && clubResponse.data) {
              setClubName(clubResponse.data.NomClub);
            } else {
              setClubName(`${data.ClubId}`);
            }
          } catch (error) {
            console.error("Error fetching club:", error);
            setClubName(`${data.ClubId}`);
          }
        } else {
          setClubName("—");
        }
      } catch (error) {
        toast.error("Erreur de chargement client");
      }
    }

    loadClient();
    fetchEnteredStatus();
    setCacheBuster(Date.now());
  }, [numClient]); // ne dépend que du NumGrimpeur

  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (!clientInfo){
    return (
      <p>Le Grimpeur n'existe pas ou est introuvable.</p>
    );
  }

    const handleClick1 = async () => {
      if (!clientInfo) return;

      setLoading(true);

      try {
        // 1️⃣ Ajouter 1 ticket au client
        const updatedClient: Client = {
          ...clientInfo,
          NbSeanceRest: (clientInfo.NbSeanceRest ?? 0) + 1,
        };

        const updateResult = await updateClientData(updatedClient);
        if (!updateResult.success) {
          toast.error(`Erreur mise à jour tickets : ${updateResult.message}`);
          setLoading(false);
          return;
        }

        // 2️⃣ Créer la transaction pour le ticket
        const ticketTransaction = await postTransaction({
          TypeObjet: "ticket",
          IdObjet: 1, // ticket unique
          NumGrimpeur: numClient,
          NbSeanceTicket: 1,
        });

        if (!ticketTransaction.success) {
          toast.error(`Erreur transaction ticket : ${ticketTransaction.message}`);
          setLoading(false);
          return;
        }

        // 3️⃣ Créer la séance associée
        const seanceResult = await postSeanceClient(numClient);

        if (!seanceResult.success) {
          toast.error(`Erreur création séance : ${seanceResult.message}`);
          setInCasa(false);
        } else {
          toast.success("Ticket ajouté et séance créée !");
          setInCasa(true);
        }

      } catch (error) {
        toast.error("Erreur lors de l'entrée unique");
        setInCasa(false);
      } finally {
        setLoading(false);
      }
    };



    const handleClick2 = async () => {
      const response = await deleteSeance(numClient);
      response.success ? toast.success(response.message) : toast.error(response.message), setInCasa(false);
    };


    const fieldInfoClient = clientFields.map(f => {
      if (f.key === "ClubId") {
        return { label: f.label, value: clubName };
      }
      return {
        label: f.label,
        value: f.format ? f.format(clientInfo[f.key]) : clientInfo[f.key] ?? "—",
      };
    });


  return (
    
    <div className={`flex flex-col h-full ${getStatutVoieBg(clientInfo.StatutVoie)} rounded-md relative`}>
      
      {onEdit && (
        <Button
          size="lg"
          variant="outline"
          onClick={onEdit}
          className="absolute top-4 right-4 p-2 w-12 h-12 flex items-center justify-center cursor-pointer"
        >
          <Image 
            src="/inscription.svg" 
            alt="Modifier" 
            width={24} 
            height={24} 
          />
        </Button>
      )}
      <div className="overflow-auto [flex:1] flex items-center">

        <div className="flex flex-col items-center gap-0.5 mr-4">
          {inCasa ? (
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

        </div>
      </div>

      <div className="[flex:2] grid grid-rows-[3fr_1fr]">

        {/* Suite des infos du grimpeur*/}
        <div className="grid grid-cols-3 grid-rows-2">
          <div className="flex flex-col items-center justify-center">
            {CotisationInfo(clientInfo)}
          </div>

          <div className="flex flex-col items-center justify-center">
            <SignatureClient
              typeSignature="Règlement Intérieur"
              accord={clientInfo.AccordReglement}
              cheminSignature={clientInfo.CheminSignature}
              cacheBuster={cacheBuster}
            />
          </div>

          <div className="flex flex-col items-center justify-center">
            <SignatureClient
              typeSignature="Autorisation Parentale"
              accord={clientInfo.AccordParental}
              cheminSignature={clientInfo.CheminSignature}
              cacheBuster={cacheBuster}
            />
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
              variant="default"
              className="w-3/4 h-3/4 text-lg cursor-pointer"
            >
              Entrée Unique
            </Button>
          </div>

          <div className="flex justify-center">
            <ConfirmButton
              triggerText="Annuler Entrée"
              title="Confirmer l'annulation de l'entrée"
              description="Êtes-vous sûr(e) de vouloir annuler cette entrée ? Cette action ne peut pas être annulée."
              onConfirm={handleClick2}
              confirmText="Oui, annuler"
              cancelText="Non, conserver"
              variantConfirm="destructive"
              triggerSize="lg"
              triggerVariant="outline"
              triggerClassName="w-3/4 h-3/4 text-lg cursor-pointer"
            />
          </div>
        </div>


      </div>
    </div>
  );
}

function SignatureClient({
  typeSignature,
  accord,
  cheminSignature,
  cacheBuster,
}: {
  typeSignature: string;
  accord: boolean | undefined;
  cheminSignature: string | undefined;
  cacheBuster: number;
}) {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="font-bold text-gray-700">{typeSignature}</p>
      {cheminSignature && accord && (
        <img
          src={`${API_URL}/${cheminSignature}?v=${cacheBuster}`} // ou ton endpoint pour servir les images
          alt="Si signature non visible verifier l'accord"
          className="mt-2 w-40 h-auto border"
        />
      )}
      {accord ? (
        <p></p>
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
      return "bg-orange-300";
    case 2: //Voie
      return "bg-green-300";
    case 3: // Tête
      return "bg-blue-300";
    default:
      return "bg-orange-300";
  }
}

