/* eslint-disable react/no-unescaped-entities */
"use client";
import {
  deleteSeance, fetchGrimpeurById, fetchClubById,
  isAlreadyEntered, isDateValid, postSeanceGrimpeur,
  postTransaction, updateGrimpeurData
} from "@/src/services/api";
import { grimpeurFields } from "@/src/types&fields/fields";
import { Grimpeur, ApiResponse, Club } from "@/src/types&fields/types";
import Image from "next/image";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/src/components/ui/button";
import { toast } from "react-toastify";
import { API_URL } from "@/src/services/real";
import { AuthImage } from "./authImage";
import { ConfirmButton } from "./buttonConfirm";
import LoadingSpinner from "@/src/components/grimpeur_ui/LoadingSpinner";
import { formatDate } from "@/src/lib/utils";

// --------------------------------------------------------------------

interface GrimpeurGridProps {
  numGrimpeur: number;
  onEdit: () => void;
  createSeance?: boolean;
  onSeanceCanceled?: () => void;
}

export function GrimpeurGrid({ numGrimpeur, onEdit, createSeance = false, onSeanceCanceled }: GrimpeurGridProps) {
  const [inCasa, setInCasa] = useState(false);
  const [isLoading, setLoading] = useState(true);
  const [grimpeurInfo, setGrimpeurInfo] = useState<Grimpeur | null>(null);
  const [cacheBuster, setCacheBuster] = useState(Date.now());
  const [clubName, setClubName] = useState<string>("");
  const lastNumRef = useRef<number | null>(null);
  const [isLoadingEntree, setLoadingEntree] = useState(false);
  const seanceProcessedRef = useRef(false);
  const createSeanceRef = useRef(createSeance);
  const [isFFME63, setIsFFME63] = useState(false);

  // ✅ Mettre à jour le ref quand createSeance change
  useEffect(() => {
    createSeanceRef.current = createSeance;
  }, [createSeance]);

  // -------------------------------------------------------------
  // ✅ Fonction factorisée pour recharger les infos du grimpeur
  // -------------------------------------------------------------
  const reloadGrimpeurInfo = useCallback(async () => {
    if (!numGrimpeur) return;
    try {
      const response = await fetchGrimpeurById(numGrimpeur);

      // ✅ Vérifier le succès ET extraire les données
      if (!response.success || !response.data) {
        toast.error(response.message || "Erreur lors du rechargement du grimpeur");
        return;
      }

      setGrimpeurInfo(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Erreur lors du rechargement du grimpeur");
    }
  }, [numGrimpeur]);

  // -------------------------------------------------------------
  // Chargement initial du grimpeur + statut
  // -------------------------------------------------------------
  useEffect(() => {
    if (lastNumRef.current === numGrimpeur) return;
    lastNumRef.current = numGrimpeur;

    const loadGrimpeur = async () => {
      setLoading(true);
      try {
        const response = await fetchGrimpeurById(numGrimpeur);

        // ✅ Vérifier le succès ET extraire les données
        if (!response.success || !response.data) {
          toast.error(response.message || "Erreur de chargement grimpeur");
          setLoading(false);
          return;
        }

        const data = response.data;
        setGrimpeurInfo(data);

        if (data?.ClubId) {
          try {
            const clubResponse = await fetchClubById(data.ClubId) as ApiResponse<Club>;
            if (clubResponse.success && clubResponse.data) {
              setClubName(clubResponse.data.NomClub);
              setIsFFME63(clubResponse.data.PuyDeDome === true);
            } else {
              setIsFFME63(false);
              setClubName(`${data.ClubId}`);
            }
          } catch {
            setIsFFME63(false);
            setClubName(`${data.ClubId}`);
          }
        } else {
          setIsFFME63(false);
          setClubName("—");
        }
      } catch {
        toast.error("Erreur de chargement grimpeur");
        setLoading(false);
        return;
      } finally {
        setLoading(false);
      }
    };

    if (numGrimpeur != null) {
      loadGrimpeur();
    } else {
      setInCasa(false);
    }
    setCacheBuster(Date.now());
  }, [numGrimpeur]);

  // ✅ SÉPARATION : Un useEffect pour vérifier le statut d'entrée
  useEffect(() => {
    const fetchEnteredStatus = async () => {
      setLoadingEntree(true);
      if (numGrimpeur == null || !grimpeurInfo) {
        setInCasa(false);
        setLoadingEntree(false);
        return;
      }

      try {
        const status = await isAlreadyEntered(numGrimpeur);
        setInCasa(status.success && status.data ? true : false);
      } catch {
        toast.warning("Erreur lors de la vérification du statut d'entrée");
        setInCasa(false);
      } finally {
        setLoadingEntree(false);
      }
    };

    fetchEnteredStatus();
  }, [numGrimpeur, grimpeurInfo]);

  useEffect(() => {
    if (!createSeanceRef.current) {
      seanceProcessedRef.current = false;
      return;
    }

    // ✅ Ne créer la séance QUE UNE FOIS
    if (seanceProcessedRef.current) return;
    if (!numGrimpeur || !grimpeurInfo || inCasa) return;

    const createSeanceAuto = async () => {
      seanceProcessedRef.current = true;

      if (isNotAllowedForEntrance(grimpeurInfo, isFFME63)) {
        toast.warning("Le grimpeur n'est pas autorisé à entrer en salle.");
        setInCasa(false);
        return;
      }

      try {
        const result = await postSeanceGrimpeur(numGrimpeur);
        if (!result.success) {
          toast.warning(result.message);
          setInCasa(false);
        } else {
          toast.success(result.message);
          setInCasa(true);
          await reloadGrimpeurInfo();
        }
      } catch {
        toast.error("Erreur lors de la création de la séance");
        setInCasa(false);
      }
    };

    createSeanceAuto();
  }, [createSeanceRef.current, numGrimpeur, grimpeurInfo, inCasa, reloadGrimpeurInfo]);

  // -------------------------------------------------------------
  // Boutons d’action
  // -------------------------------------------------------------
  const handleTicketUnique = async () => {
    if (!grimpeurInfo) return;
    setLoadingEntree(true);
    try {
      const updatedGrimpeur: Grimpeur = {
        ...grimpeurInfo,
        NbSeanceRest: (grimpeurInfo.NbSeanceRest ?? 0) + 1,
        TicketId: 1,
      };

      const updateResult = await updateGrimpeurData(updatedGrimpeur);
      if (!updateResult.success) {
        toast.error(`Erreur mise à jour tickets : ${updateResult.message}`);
        return;
      }

      const ticketTransaction = await postTransaction({
        TypeObjet: "ticket",
        IdObjet: 1,
        NumGrimpeur: numGrimpeur,
        NbSeanceTicket: 1,
      });

      if (!ticketTransaction.success) {
        toast.error(`Erreur transaction ticket : ${ticketTransaction.message}`);
        return;
      }

      const seanceResult = await postSeanceGrimpeur(numGrimpeur);
      if (!seanceResult.success) {
        toast.error(`Erreur création séance : ${seanceResult.message}`);
        setInCasa(false);
      } else {
        toast.success("Ticket ajouté et séance créée !");
        setInCasa(true);
      }

      // ✅ Rechargement du grimpeur à la fin
      await reloadGrimpeurInfo();

    } catch {
      toast.error("Erreur lors de l'entrée unique");
      setInCasa(false);
    } finally {
      setLoadingEntree(false);
    }
  };

  const handleAnnulerEntree = async () => {
    const response = await deleteSeance(numGrimpeur);
    if (response.success) {
      toast.success(response.message);
      setInCasa(false);
      setTimeout(async () => {
        await reloadGrimpeurInfo();
        onSeanceCanceled?.();
      }, 100);
      await reloadGrimpeurInfo();
      onSeanceCanceled?.();
    } else {
      toast.error(response.message);
    }
  };

  const handleEntreeSimple = async () => {
    setLoadingEntree(true);
    try {
      if (inCasa) {
        toast.warning("Le grimpeur est déjà en salle");
      }
      const result = await postSeanceGrimpeur(numGrimpeur);
      if (!result.success) {
        toast.warning(result.message);
        setInCasa(false);
      } else {
        toast.success(result.message);
        setInCasa(true);
        await reloadGrimpeurInfo(); // ✅ refresh ici aussi
      }
    } catch {
      toast.error("Erreur lors de la création de la séance");
    } finally {
      setLoadingEntree(false);
    }
  };

  // -------------------------------------------------------------
  // Rendu
  // -------------------------------------------------------------
  if (!grimpeurInfo) return <p>Le Grimpeur n'existe pas ou est introuvable.</p>;
  if (isLoading) return <LoadingSpinner />;

  const fieldInfoGrimpeur = grimpeurFields.map(f => {
    if (f.key === "ClubId") {
      return { label: f.label, value: clubName };
    }
    return {
      label: f.label,
      value: f.format ? f.format(grimpeurInfo[f.key]) : grimpeurInfo[f.key] ?? "—",
    };
  });


  return (

    <div className={`flex flex-col h-full rounded-md relative`}>

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
          <Image src="/avatar.png" alt="Avatar" width={200} height={200} priority />
          <p>{grimpeurInfo.NumGrimpeur}</p>
        </div>

        <div className="flex-1 grid grid-cols-4 gap-2 h-full">
          {fieldInfoGrimpeur.map(({ label, value }) => (
            <div key={label} className="flex flex-col justify-center break-words overflow-auto">
              <div className="break-words whitespace-pre-line w-full">
                <p className={`text-sm font-semibold ${label === 'Club' && isFFME63 ? 'text-blue-600' : 'text-gray-700'
                  }`}>{label}</p>
                <p>{value}</p>
              </div>
            </div>
          ))}

          <div className="flex flex-col justify-center break-words col-span-2">
            <p className="text-sm font-semibold text-gray-700">Note</p>
            <div className="border border-gray-700 rounded p-2 max-h-24 overflow-y-auto whitespace-pre-line">
              {grimpeurInfo.Note || "—"}
            </div>
          </div>

        </div>
      </div>

      <div className="[flex:2] grid grid-rows-[3fr_1fr]">

        {/* Suite des infos du grimpeur*/}
        <div className="grid grid-cols-3 grid-rows-2">
          <div className="flex flex-col items-center justify-center">
            {CotisationInfo(grimpeurInfo, isFFME63)}
          </div>

          <div className="flex flex-col items-center justify-center">
            <SignatureGrimpeur
              typeSignature="Règlement Intérieur"
              accord={grimpeurInfo.AccordReglement}
              cheminSignature={grimpeurInfo.CheminSignature}
              cacheBuster={cacheBuster}
            />
          </div>

          <div className="flex flex-col items-center justify-center">
            <SignatureGrimpeur
              typeSignature="Autorisation Parentale"
              accord={grimpeurInfo.AccordParental}
              cheminSignature={grimpeurInfo.CheminSignature}
              cacheBuster={cacheBuster}
            />
          </div>

          <div className="flex flex-col items-center">
            {AbonnementInfo(grimpeurInfo)}
          </div>

          <div className="flex flex-col items-center">
            {EntreeInfo(grimpeurInfo)}
          </div>

          <div className="flex flex-col items-center">
            {AccesSalleInfo(grimpeurInfo)}
          </div>
        </div>

        {/* Actions sur le profil du grimpeur */}
        <div className="grid grid-cols-3">
          <div className="flex justify-center">
            <Button
              onClick={handleEntreeSimple}
              disabled={isLoadingEntree ||
                isNotAllowedForEntrance(grimpeurInfo, isFFME63)}
              variant="default"
              className="w-3/4 h-3/4 text-lg cursor-pointer"
            >
              {isLoadingEntree ? (
                <LoadingSpinner small color="white" />
              ) : (
                "Entrée"
              )}
            </Button>
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleTicketUnique}
              disabled={
                isLoadingEntree ||
                inCasa ||
                (
                  (
                    !(isDateValid(grimpeurInfo.DateFinCoti) || !!grimpeurInfo.NumLicenceGrimpeur) &&
                    !grimpeurInfo.AccordReglement
                  ) ||
                  (isDateValid(grimpeurInfo.DateFinAbo) || !!grimpeurInfo.NbSeanceRest)
                )
              }
              variant="default"
              className="w-3/4 h-3/4 text-lg cursor-pointer"
            >
              {isLoadingEntree ? (
                <LoadingSpinner small color="white" />
              ) : (
                "Ticket unique"
              )}
            </Button>
          </div>

          <div className="flex justify-center">
            <ConfirmButton
              triggerText="Annuler Entrée"
              title="Confirmer l'annulation de l'entrée"
              description="Êtes-vous sûr(e) de vouloir annuler cette entrée ? Cette action ne peut pas être annulée."
              onConfirm={handleAnnulerEntree}
              confirmText="Oui, annuler"
              cancelText="Non, conserver"
              variantConfirm="destructive"
              triggerSize="lg"
              triggerVariant="outline"
              triggerClassName="w-3/4 h-3/4 text-lg cursor-pointer"
              disabled={isLoadingEntree || !inCasa}
            />
          </div>
        </div>


      </div>
    </div>
  );
}

function SignatureGrimpeur({
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
        <AuthImage
          src={`${API_URL}/${cheminSignature}?v=${cacheBuster}`}
          alt="Signature"
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


function CotisationInfo(grimpeur: Grimpeur, isFFME63: boolean) {
  let content;
  if (isFFME63) {
    content = (
      <>
        <p className="text-green-500 font-bold">Licence dans club du</p>
        <p className="text-green-500 font-bold">CT63 en cours</p>
      </>
    );
  } else if (grimpeur.DateFinCoti !== null && grimpeur.DateFinCoti !== undefined) {
    content = (
      <>
        {isDateValid(grimpeur.DateFinCoti) ? (
          <>
            <p className="text-green-500 font-bold">Cotisation Active</p>
            <p>Fin le {formatDate(grimpeur.DateFinCoti)}</p>
          </>
        ) : (
          <>
            <p className="text-red-500 font-bold">Cotisation Expirée</p>
            <p>Fin le {formatDate(grimpeur.DateFinCoti)}</p>
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

function AbonnementInfo(grimpeur: Grimpeur) {
  let content;
  if (grimpeur.DateFinAbo === null || grimpeur.DateFinAbo === undefined) {
    content = <p className="font-bold text-gray-700">Pas d'abonnement</p>;
  } else if (isDateValid(grimpeur.DateFinAbo)) {
    content = (
      <>
        <p className="text-green-500 font-bold">Abonnement Actif</p>
        <p>Fin le {formatDate(grimpeur.DateFinAbo)}</p>
      </>
    );
  } else {
    content = (
      <>
        <p className="text-red-500 font-bold">Abonnement Expiré</p>
        <p>Fin le {formatDate(grimpeur.DateFinAbo)}</p>
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      {content}
    </div>
  );
}

function EntreeInfo(grimpeur: Grimpeur) {
  let content;
  if (!grimpeur.NbSeanceRest || grimpeur.NbSeanceRest <= 0) {
    content = <p className="font-bold text-gray-700">Pas d'entrées</p>;
  } else {
    content = (
      <>
        <p className="text-green-500 font-bold">Nombre d'entrée restantes</p>
        <p>{grimpeur.NbSeanceRest}</p>
      </>
    );
  }
  return (
    <div className="flex flex-col items-center justify-center">
      {content}
    </div>
  );
}

function AccesSalleInfo(grimpeur: Grimpeur) {
  let content;
  if (grimpeur.StatutVoie === 3) {
    content = <p className="font-bold">Tête</p>;
  } else if (grimpeur.StatutVoie === 2) {
    content = <p className="font-bold">Moulinette</p>;
  } else {
    content = <p className="font-bold">Bloc</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <p className="font-bold text-gray-700">Accès Salle</p>
      {content}
    </div>
  );
}

function isNotAllowedForEntrance(grimpeur: Grimpeur, isFFME63: boolean): boolean {
  const hasValidSubscription =
    isDateValid(grimpeur.DateFinAbo) ||
    (grimpeur.NbSeanceRest && grimpeur.NbSeanceRest > 0);

  const hasSignature = !!grimpeur.AccordReglement;

  const hasMembership =
    isDateValid(grimpeur.DateFinCoti) ||
    isFFME63;

  return !(hasValidSubscription && hasSignature && hasMembership);
}