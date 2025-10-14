"use client";

import { useEffect, useRef, useState } from "react";
import { Client } from "@/src/types&fields/types";
import { Button } from "@/src/components/ui/button";
import { fetchAbonnements, fetchTickets, getTodayPlusOneYear, postTransaction, updateClientData, updateGrimpeurSignature } from "@/src/services/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { toast } from "react-toastify";
import SignatureCanvas from "react-signature-canvas";
import { API_URL } from "@/src/services/real";
import { getStatutVoieBg } from "./clientInfo";
interface ClientEditProps {
  clientInfo: Client;
  onCancel?: () => void;
}

export default function ClientEdit({ clientInfo, onCancel }: ClientEditProps) {
  const [formData, setFormData] = useState<Client>({ ...clientInfo });
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingAbo, setIsAddingAbo] = useState(false);
  const [isAddingTicket, setIsAddingTicket] = useState(false);

  const [abonnements, setAbonnements] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);

  const [newAbo, setNewAbo] = useState<string | null>(null);
  const [newAboDate, setNewAboDate] = useState<string>("");

  const [newTicket, setNewTicket] = useState<string | null>(null);
  const [newTicketSeances, setNewTicketSeances] = useState<number>(0);

  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [isUpdatingSignature, setIsUpdatingSignature] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const aboRes = await fetchAbonnements();
      if (aboRes.success && aboRes.data) setAbonnements(aboRes.data);

      const ticketRes = await fetchTickets();
      if (ticketRes.success && ticketRes.data) setTickets(ticketRes.data);
    };
    loadData();
  }, []);

  const handleChange = (key: keyof Client, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  /**Enregistrement général du client (sans transaction) */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updateRes = await updateClientData(formData);
      if (!updateRes.success) {
        toast.error(updateRes.message);
        return;
      }

      toast.success("Client mis à jour avec succès !");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  /**Création d'un nouvel abonnement via bouton dédié */
  const handleAddAbo = async () => {
    if (!newAbo) {
      toast.error("Choisissez un abonnement avant d'ajouter.");
      return;
    }

    setIsAddingAbo(true);
    try {
      const abo = abonnements.find((a) => a.TypeAbo === newAbo);
      if (!abo) {
        toast.error("Abonnement introuvable.");
        return;
      }

      const dateFin =
        newAboDate ||
        (() => {
          const d = new Date();
          d.setDate(d.getDate() + abo.DureeAbo);
          return d.toISOString().split("T")[0];
        })();

      //Création de la transaction
      const transRes = await postTransaction({
        TypeObjet: "abonnement",
        IdObjet: abo.IdAbo,
        NumGrimpeur: formData.NumGrimpeur,
        TypeAbo: abo.TypeAbo,
        DureeAbo: abo.DureeAbo,
        DateFinAbo: dateFin,
      });

      if (!transRes.success) {
        toast.error(transRes.message);
        return;
      }

      //Mise à jour directe du client
      const updatedClient = {
        ...formData,
        DateFinAbo: dateFin,
        TypeAbo: abo.TypeAbo,
      };
      const updateRes = await updateClientData(updatedClient);
      if (!updateRes.success) {
        toast.error(updateRes.message);
        return;
      }

      //Maj locale du state + reset des champs temporaires
      setFormData(updatedClient);
      setNewAbo("");        //reset le Select
      setNewAboDate("");    //reset la date de fin
      toast.success("Nouvel abonnement ajouté et client mis à jour !");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'ajout du nouvel abonnement");
    } finally {
      setIsAddingAbo(false);
    }
  };


  /**Création d'un nouveau ticket via bouton dédié */
  const handleAddTicket = async () => {
    if (!newTicket) {
      toast.error("Choisissez un ticket avant d'ajouter.");
      return;
    }

    setIsAddingTicket(true);
    try {
      const ticket = tickets.find((t) => t.TypeTicket === newTicket);
      if (!ticket) {
        toast.error("Ticket introuvable.");
        return;
      }

      const nbRest = newTicketSeances || ticket.NbSeanceTicket;

      //Création de la transaction
      const transRes = await postTransaction({
        TypeObjet: "ticket",
        IdObjet: ticket.IdTicket,
        NumGrimpeur: formData.NumGrimpeur,
        TypeTicket: ticket.TypeTicket,
        NbSeanceTicket: ticket.NbSeanceTicket,
        NbSeanceRest: nbRest,
      });

      if (!transRes.success) {
        toast.error(transRes.message);
        return;
      }

      // Mise à jour directe du client
      const updatedClient = {
        ...formData,
        TypeTicket: ticket.TypeTicket,
        NbSeanceRest: nbRest,
      };
      const updateRes = await updateClientData(updatedClient);
      if (!updateRes.success) {
        toast.error(updateRes.message);
        return;
      }

      //Maj locale du state + reset des champs temporaires
      setFormData(updatedClient);
      setNewTicket("");        // reset le Select
      setNewTicketSeances(0); //reset le nombre de séances
      toast.success("Nouveau ticket ajouté et client mis à jour !");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'ajout du ticket");
    } finally {
      setIsAddingTicket(false);
    }
  };

  const handleSignatureSave = async () => {
    if (!sigCanvas.current) return;

    const signatureBase64 = sigCanvas.current
      ?.getTrimmedCanvas()
      .toDataURL("image/png");

    if (!signatureBase64) {
      toast.warning("Veuillez signer avant d'enregistrer !");
      return;
    }

    setIsUpdatingSignature(true);

    try {
      const res = await updateGrimpeurSignature(
        formData.NumGrimpeur,
        signatureBase64,
        formData.AccordReglement,
        formData.AccordParental
      );

      if (res.success) {
        toast.success("Signature mise à jour !");
        // recharge la signature affichée sans recharger toute la page
        setFormData((prev) => ({
          ...prev,
          CheminSignature: res.data?.CheminSignature ?? prev.CheminSignature,
          AccordReglement: true,
        }));
        sigCanvas.current?.clear();
      } else {
        toast.error(res.message || "Erreur lors de la mise à jour de la signature");
      }
    } catch (err: any) {
      toast.error(err.message || "Erreur réseau lors de la mise à jour");
    } finally {
      setIsUpdatingSignature(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md overflow-auto h-full">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        Modifier: {clientInfo.PrenomGrimpeur} {clientInfo.NomGrimpeur}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-rows-auto gap-4">
        <div className="grid grid-cols-3 gap-4 pb-4 border-b-1">
        <div>
            <p className="text-center text-sm font-semibold text-gray-700 mb-1">Numéro de Grimpeur</p>
            <p className="text-center">{clientInfo.NumGrimpeur}</p>
        </div>
        <InputField
          label="Prénom"
          value={formData.PrenomGrimpeur}
          onChange={(v) => handleChange("PrenomGrimpeur", v)}
        />
        <InputField
          label="Nom"
          value={formData.NomGrimpeur}
          onChange={(v) => handleChange("NomGrimpeur", v)}
        />
        <InputField
          label="Date de naissance"
          type="date"
          value={formData.DateNaissGrimpeur || ""}
          onChange={(v) => handleChange("DateNaissGrimpeur", v)}
        />
        <InputField
          label="Téléphone"
          value={formData.TelGrimpeur || ""}
          onChange={(v) => handleChange("TelGrimpeur", v)}
        />
        <InputField
          label="Email"
          type="email"
          value={formData.EmailGrimpeur || ""}
          onChange={(v) => handleChange("EmailGrimpeur", v)}
        />
        <InputField
          label="Licence"
          value={formData.NumLicenceGrimpeur || ""}
          onChange={(v) => handleChange("NumLicenceGrimpeur", v)}
        />
        <InputField
          label="Club"
          value={formData.Club || ""}
          onChange={(v) => handleChange("Club", v)}
        />


        {/* Champs numériques */}
        <InputField
          label="Solde (€)"
          type="number"
          value={formData.Solde ?? ""}
          onChange={(v) => handleChange("Solde", Number(v))}
        />

<div className="flex flex-col gap-2 w-full py-2">
  <label className="text-sm font-medium">Accès au mur</label>
  <div className="inline-flex gap-2">
    {[
      { value: 1, label: "Bloc" },
      { value: 2, label: "Moulinette" },
      { value: 3, label: "Tête" },
    ].map(({ value, label }) => (
      <button
        key={value}
        type="button"
        className={`px-3 py-1 rounded border ${getStatutVoieBg(value)} ${
          formData.StatutVoie === value
            ? "border-blue-500"
            : "text-gray-700"
        }`}
        onClick={() => handleChange("StatutVoie", value)}
      >
        {label}
      </button>
    ))}
  </div>
</div>


        </div>

        <div className="flex flex-col gap-4">
                
          <div className="grid grid-cols-2 gap-4">
          <InputField
            label="Fin abonnement actuelle"
            type="date"
            value={formData.DateFinAbo || ""}
            onChange={(v) => handleChange("DateFinAbo", v)}
          />

          {/* NOUVEL ABONNEMENT */}
          <div className="flex gap-3 items-end">
            <div className="flex flex-col flex-1">
              <label className="text-sm font-semibold text-gray-700 mb-1">Nouvel abonnement</label>
              <Select
                value={newAbo || "none"}
                onValueChange={(val) => {
                  if (val === "none") {
                    setNewAbo(null);
                    setNewAboDate("");
                  } else {
                    setNewAbo(val);
                    const abo = abonnements.find((a) => a.TypeAbo === val);
                    if (abo) {
                      const dateFin = new Date();
                      dateFin.setDate(dateFin.getDate() + abo.DureeAbo);
                      setNewAboDate(dateFin.toISOString().split("T")[0]);
                    }
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un abonnement" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {abonnements.map((abo) => (
                    <SelectItem key={abo.IdAbo} value={abo.TypeAbo}>
                      {abo.TypeAbo} ({abo.PrixAbo} € / {abo.DureeAbo} jours)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newAbo && (
              <InputField
                label="Fin nouvel abo"
                type="date"
                value={newAboDate}
                onChange={(v) => setNewAboDate(v)}
              />
            )}

            <Button type="button" onClick={handleAddAbo} disabled={isAddingAbo || !newAbo}>
              {isAddingAbo ? "Ajout..." : "Ajouter abo"}
            </Button>
          </div>

          <InputField
            label="Séances restantes"
            type="number"
            value={formData.NbSeanceRest ?? ""}
            onChange={(v) => handleChange("NbSeanceRest", Number(v))}
          />

          {/* NOUVEAU TICKET */}
          <div className="flex gap-3 items-end">
            <div className="flex flex-col flex-1">
              <label className="text-sm font-semibold text-gray-700 mb-1">Nouveau ticket</label>
              <Select
                value={newTicket || "none"}
                onValueChange={(val) => {
                  if (val === "none") {
                    setNewTicket(null);
                    setNewTicketSeances(0);
                  } else {
                    setNewTicket(val);
                    const ticket = tickets.find((t) => t.TypeTicket === val);
                    if (ticket) setNewTicketSeances(ticket.NbSeanceTicket);
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un ticket" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {tickets.map((ticket) => (
                    <SelectItem key={ticket.IdTicket} value={ticket.TypeTicket}>
                      {ticket.TypeTicket} ({ticket.PrixTicket} € / {ticket.NbSeanceTicket} séances)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {newTicket && (
              <InputField
                label="Séances restantes"
                type="number"
                value={newTicketSeances}
                onChange={(v) => setNewTicketSeances(Number(v))}
              />
            )}

            <Button type="button" onClick={handleAddTicket} disabled={isAddingTicket || !newTicket}>
              {isAddingTicket ? "Ajout..." : "Ajouter ticket"}
            </Button>
          </div>
        </div>

        <div className="flex items-end gap-2 w-full">
          <div className="flex-1">
            <InputField
              label="Fin cotisation"
              type="date"
              value={formData.DateFinCoti || ""}
              onChange={(v) => handleChange("DateFinCoti", v)}
            />
          </div>

          <button
            type="button"
            onClick={() => {
              handleChange("DateFinCoti", getTodayPlusOneYear());
            }}
            className="px-3 py-1.5 border-1 border-black hover:text-black text-gray-700 rounded-md"
          >
            +1 an
          </button>
        </div>


        <div className="border rounded p-4 mt-4 flex flex-col gap-3">
          <h3 className="text-lg font-semibold">Signature du règlement</h3>

          <div className="flex gap-4">
            {/* Signature actuelle */}
            {formData.CheminSignature && (
              <div className="flex flex-col items-center">
                <p className="text-sm text-gray-600">Signature actuelle :</p>
                <img
                  src={`${API_URL}/${formData.CheminSignature}`}
                  alt="Signature du règlement"
                  className="border w-64 h-auto mt-2"
                />
              </div>
            )}

            {/* Nouveau canvas de signature */}
            <div className="flex flex-col">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                backgroundColor="white"
                canvasProps={{
                  className: "border w-full sm:w-96 h-40 bg-white rounded shadow-sm",
                }}
              />

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  className="bg-gray-300 hover:bg-gray-400 text-black px-3 py-1 rounded"
                  onClick={() => sigCanvas.current?.clear()}
                >
                  Effacer
                </button>

                <button
                  type="button"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                  onClick={handleSignatureSave}
                  disabled={isUpdatingSignature}
                >
                  {isUpdatingSignature ? "Enregistrement..." : "Mettre à jour la signature"}
                </button>
              </div>
            </div>
          </div>

          {/* Accord Règlement remplacé par un message */}
          <div className="mt-4">
            {formData.AccordReglement ? (
              <p className="text-green-600 font-semibold">Règlement signé ✅</p>
            ) : (
              <p className="text-red-500 font-semibold">Règlement non signé ❌</p>
            )}
          </div>

          {/* Accord Parental */}
          <div className="flex items-center justify-between">
            <label className="font-semibold">Accord Parental</label>
            <input
              type="checkbox"
              checked={formData.AccordParental || false}
              onChange={(e) => handleChange("AccordParental", e.target.checked)}
            />
          </div>
        </div>


            {/* Champ texte long */}
            <div className="col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Note</label>
              <textarea
                value={formData.Note || ""}
                onChange={(e) => handleChange("Note", e.target.value)}
                className="w-full border rounded px-2 py-1 min-h-[80px]"
              />
            </div>

            {/* Boutons d'action */}
          <div className="flex justify-end gap-2 mt-4">
            <button type="button" onClick={onCancel} className="btn-secondary border">
              Annuler
            </button>
            <button type="submit" disabled={isSaving} className="btn-primary border">
              {isSaving ? "Enregistrement..." : "Enregistrer"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

/* -- Sous-composants réutilisables -- */

function InputField({
  label,
  type = "text",
  value,
  onChange,
  readOnly = false, // 👈 nouvelle prop
}: {
  label: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-semibold text-gray-700 mb-1">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="border rounded px-2 py-1"
        disabled={readOnly}
      />
    </div>
  );
}


function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-4 h-4"
      />
      {label}
    </label>
  );
}
