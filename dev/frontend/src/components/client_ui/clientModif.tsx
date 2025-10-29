"use client";

import { useEffect, useRef, useState } from "react";
import { Client } from "@/src/types&fields/types";
import { Button } from "@/src/components/ui/button";
import {
  fetchAbonnements,
  fetchClientById,
  fetchTickets,
  fetchClubs,
  getTodayPlusOneYear,
  postTransaction,
  updateClientData,
  updateGrimpeurSignature,
} from "@/src/services/api";
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
import { Switch } from "../ui/switch";
import { ConfirmButton } from "./buttonConfirm";
import LoadingSpinner from "./LoadingSpinner";

interface ClientEditProps {
  numClient: number;
  onCancel?: () => void;
}


export default function ClientEdit({ numClient, onCancel }: ClientEditProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingAbo, setIsAddingAbo] = useState(false);
  const [isAddingTicket, setIsAddingTicket] = useState(false);
  const [abonnements, setAbonnements] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [clubs, setClubs] = useState<any[]>([]);
  const [newAbo, setNewAbo] = useState<string | null>(null);
  const [newAboDate, setNewAboDate] = useState<string>("");
  const [newTicket, setNewTicket] = useState<string | null>(null);
  const [newTicketSeances, setNewTicketSeances] = useState<number>(0);
  const sigCanvas = useRef<SignatureCanvas | null>(null);
  const [isUpdatingSignature, setIsUpdatingSignature] = useState(false);
  const [signatureDrawn, setSignatureDrawn] = useState(false);
  const [clientInfo, setClientInfo] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Client | null>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);
    const loadClient = async () => {
      try{
        const data = await fetchClientById(numClient);
        // clone to avoid shared references between clientInfo and formData
        const clone = JSON.parse(JSON.stringify(data));
        setClientInfo(clone);
        setFormData(JSON.parse(JSON.stringify(data)));
      } catch (error) {
        toast.error("Erreur de chargement client");
      }
    }
    loadClient();
    setLoading(false);
  }, [numClient]);

  useEffect(() => {
    setLoading(true);
    const loadData = async () => {
      const aboRes = await fetchAbonnements();
      if (aboRes.success && aboRes.data) setAbonnements(aboRes.data);
      const ticketRes = await fetchTickets();
      if (ticketRes.success && ticketRes.data) setTickets(ticketRes.data);
      const clubRes = await fetchClubs();
      if (clubRes.success && clubRes.data) setClubs(clubRes.data);
    };
    loadData();
    setLoading(false);
  }, []);

  if (!clientInfo || !formData){
    return (
      <LoadingSpinner/>
    );
  }

  const handleChange = (key: keyof Client, value: any) =>
    setFormData((prev) => (prev ? ({ ...prev, [key]: value } as Client) : prev));

  // Compute whether there are unsaved changes.
  const computeIsDirty = () => {
    if (!clientInfo || !formData) return false;

    // Basic compare of form fields
    try {
      if (JSON.stringify(formData) !== JSON.stringify(clientInfo)) return true;
    } catch {
      // fallback: consider dirty if stringify fails
      return true;
    }

    // New abonnement / ticket pending selection (not yet saved)
    if (newAbo) return true;
    if (newTicket) return true;
    if (newAboDate) return true;
    if (newTicketSeances && Number(newTicketSeances) !== (clientInfo.NbSeanceRest ?? 0)) return true;

    // Unsaved signature on canvas (user drew something but didn't save)
    try {
      // rely on signatureDrawn state which updates on canvas onEnd
      if (signatureDrawn) return true;
    } catch {
      // ignore errors
    }

    return false;
  };
  const isDirty = computeIsDirty();


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      let updated = { ...formData }; // snapshot local

      // --- Signature ---
      if (sigCanvas.current && !sigCanvas.current.isEmpty()) {
        await handleSignatureSave();
      }

      // --- Nouvel abonnement ---
      if (newAbo) {
        const abo = abonnements.find((a) => a.TypeAbo === newAbo);
        if (!abo) return toast.error("Abonnement introuvable.");

        const dateFin =
          newAboDate ||
          (() => {
            const d = new Date();
            d.setDate(d.getDate() + abo.DureeAbo);
            return d.toISOString().split("T")[0];
          })();
        
        const transRes = await postTransaction({
          TypeObjet: "abonnement",
          IdObjet: abo.IdAbo,
          NumGrimpeur: formData.NumGrimpeur,
          TypeAbo: abo.TypeAbo,
          DureeAbo: abo.DureeAbo,
          DateFinAbo: dateFin,
        });
        if (!transRes.success) return toast.error(transRes.message);

        updated = {
          ...updated,
          DateFinAbo: dateFin,
          TypeAbo: abo.TypeAbo,
        };
        toast.success("Nouvel abonnement ajouté !");
      }

      // --- Nouveau ticket ---
      if (newTicket) {
        const ticket = tickets.find((t) => t.TypeTicket === newTicket);
        if (!ticket) return toast.error("Ticket introuvable.");
        const nbRest = newTicketSeances || ticket.NbSeanceTicket;

        const transRes = await postTransaction({
          TypeObjet: "ticket",
          IdObjet: ticket.IdTicket,
          NumGrimpeur: formData.NumGrimpeur,
          TypeTicket: ticket.TypeTicket,
          NbSeanceTicket: ticket.NbSeanceTicket,
          NbSeanceRest: nbRest,
        });
        if (!transRes.success) return toast.error(transRes.message);

        updated = {
          ...updated,
          TypeTicket: ticket.TypeTicket,
          NbSeanceRest: nbRest,
        };
        toast.success("Nouveau ticket ajouté !");
      }

      // --- Envoi global ---
      const updateRes = await updateClientData(updated);
      if (!updateRes.success) return toast.error(updateRes.message);

      setFormData(updated); // on met à jour le state local pour affichage
      toast.success("Client mis à jour avec succès !");
      onCancel?.();
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'enregistrement");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAbo = async () => {
    if (!newAbo) return toast.error("Choisissez un abonnement avant d'ajouter.");
    setIsAddingAbo(true);
    try {
      const abo = abonnements.find((a) => a.TypeAbo === newAbo);
      if (!abo){
        return toast.error("Abonnement introuvable.");
      }

      const dateFin =
        newAboDate ||
        (() => {
          const d = new Date();
          d.setDate(d.getDate() + abo.DureeAbo);
          return d.toISOString().split("T")[0];
        })();

      const transRes = await postTransaction({
        TypeObjet: "abonnement",
        IdObjet: abo.IdAbo,
        NumGrimpeur: formData.NumGrimpeur,
        TypeAbo: abo.TypeAbo,
        DureeAbo: abo.DureeAbo,
        DateFinAbo: dateFin,
      });

      if (!transRes.success){
        return toast.error(transRes.message);;
      }

      const updatedClient = {
        ...formData,
        DateFinAbo: dateFin,
        TypeAbo: abo.TypeAbo,
      };
      const updateRes = await updateClientData(updatedClient);
      if (!updateRes.success) return toast.error(updateRes.message);

      setFormData(updatedClient);
      setNewAbo("");
      setNewAboDate("");
      toast.success("Nouvel abonnement ajouté !");
    } catch (err: any) {
      toast.error(err.message || "Erreur lors de l'ajout du nouvel abonnement");
    } finally {
      setIsAddingAbo(false);
    }
  };

  const handleAddTicket = async () => {
    if (!newTicket) return toast.error("Choisissez un ticket avant d'ajouter.");
    setIsAddingTicket(true);
    try {
      const ticket = tickets.find((t) => t.TypeTicket === newTicket);
      if (!ticket) return toast.error("Ticket introuvable.");

      const nbRest = newTicketSeances || ticket.NbSeanceTicket;

      const transRes = await postTransaction({
        TypeObjet: "ticket",
        IdObjet: ticket.IdTicket,
        NumGrimpeur: formData.NumGrimpeur,
        TypeTicket: ticket.TypeTicket,
        NbSeanceTicket: ticket.NbSeanceTicket,
        NbSeanceRest: nbRest,
      });
      if (!transRes.success) return toast.error(transRes.message);

      const updatedClient = {
        ...formData,
        TypeTicket: ticket.TypeTicket,
        NbSeanceRest: nbRest,
      };
      const updateRes = await updateClientData(updatedClient);
      if (!updateRes.success) return toast.error(updateRes.message);

      setFormData(updatedClient);
      setNewTicket("");
      setNewTicketSeances(0);
      toast.success("Nouveau ticket ajouté !");
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
    if (!signatureBase64) return toast.warning("Veuillez signer avant d'enregistrer !");
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
        setFormData((prev) => {
          if (!prev) return prev; // prev est null → on ne change rien
          return {
            ...prev,
            CheminSignature: res.data?.CheminSignature ?? prev.CheminSignature,
            AccordReglement: true,
          };
        });
        sigCanvas.current?.clear();
        setSignatureDrawn(false);
      } else toast.error(res.message || "Erreur lors de la mise à jour");
    } catch (err: any) {
      toast.error(err.message || "Erreur réseau");
    } finally {
      setIsUpdatingSignature(false);
    }
  };

  return (
  <div className="h-full flex flex-col">
    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
      Modifier : {clientInfo.PrenomGrimpeur} {clientInfo.NomGrimpeur}
    </h2>

    <form onSubmit={handleSubmit} className="flex flex-col gap-8 flex-1 pb-15">
      
        {/* --- Informations Générales --- */}
        <section className="border border-gray-200 rounded-xl p-5 bg-gray-50 flex flex-col gap-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Informations générales</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <InputField label="Numéro de Grimpeur" value={clientInfo.NumGrimpeur} onChange={() => {}} readOnly />
            <InputField label="Prénom" value={formData.PrenomGrimpeur} onChange={(v) => handleChange("PrenomGrimpeur", v)} />
            <InputField label="Nom" value={formData.NomGrimpeur} onChange={(v) => handleChange("NomGrimpeur", v)} />
            <InputField label="Date de naissance" type="date" value={formData.DateNaissGrimpeur || ""} onChange={(v) => handleChange("DateNaissGrimpeur", v)} />
            <InputField label="Téléphone" value={formData.TelGrimpeur || ""} onChange={(v) => handleChange("TelGrimpeur", v)} />
            <InputField label="Email" type="email" value={formData.EmailGrimpeur || ""} onChange={(v) => handleChange("EmailGrimpeur", v)} />
            <InputField label="Licence" value={formData.NumLicenceGrimpeur || ""} onChange={(v) => handleChange("NumLicenceGrimpeur", v)} />
            <div className="flex flex-col w-full">
              <label className="text-sm font-semibold text-gray-700 mb-1">Club</label>
              <Select
                value={formData.ClubId?.toString() ?? "none"}
                onValueChange={(val) => {
                  if (val === "none" || val === "") handleChange("ClubId", undefined as any);
                  else handleChange("ClubId", Number(val));
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choisir un club" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Aucun</SelectItem>
                  {clubs.map((club) => (
                    <SelectItem key={club.IdClub} value={club.IdClub.toString()}>
                      {club.NomClub}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <InputField label="Solde (€)" type="number" value={formData.Solde ?? ""} onChange={(v) => handleChange("Solde", Number(v))} />
          </div>

          {/* Accès au mur */}
          <div className="flex flex-col mt-2">
            <label className="text-sm font-semibold mb-1">Accès au mur</label>
            <div className="flex gap-2">
              {[{ value: 1, label: "Bloc" }, { value: 2, label: "Moulinette" }, { value: 3, label: "Tête" }].map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={`px-3 py-1 rounded border text-gray-700 ${getStatutVoieBg(value)} ${formData.StatutVoie === value ? "border-blue-500" : ""}`}
                  onClick={() => handleChange("StatutVoie", value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* --- Abonnements & Tickets --- */}
        <section className="border border-gray-200 rounded-xl p-5 bg-gray-50 flex flex-col gap-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Abonnements & Tickets</h3>

          {/* --- Fin abonnement actuelle --- */}
          <div className="flex flex-col gap-2">
            <InputField 
              label="Fin abonnement actuelle"
              type="date" 
              value={formData.DateFinAbo || ""} 
              onChange={(v) => handleChange("DateFinAbo", v)} 
            />
          </div>

          {/* --- Nouveau abonnement --- */}
          <div className="border border-gray-300 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-end bg-white shadow-sm">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Ajouter un nouvel abonnement</label>
              <Select
                value={newAbo || "none"}
                onValueChange={(val) => {
                  if (val === "none") { setNewAbo(null); setNewAboDate(""); }
                  else {
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
                <SelectTrigger className="w-full">
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
                label="Fin nouvel abonnement"
                type="date" 
                value={newAboDate} 
                onChange={(v) => setNewAboDate(v)} 
              />
            )}
            <div>
            <Button 
              type="button" 
              onClick={handleAddAbo} 
              disabled={isAddingAbo || !newAbo}
              className="self-start"
            >
              {isAddingAbo ? "Ajout..." : "Ajouter"}
            </Button>
            </div>
          </div>

          {/* --- Tickets restants actuel --- */}
          <div className="flex flex-col gap-2">
            <InputField 
              label="Séances restantes actuelles"
              type="number" 
              value={formData.NbSeanceRest ?? ""} 
              onChange={(v) => handleChange("NbSeanceRest", Number(v))} 
            />
          </div>

          {/* --- Nouveau ticket --- */}
          <div className="border border-gray-300 rounded-xl p-4 flex flex-col sm:flex-row gap-4 items-end bg-white shadow-sm">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-700 mb-1 block">Ajouter un nouveau ticket</label>
              <Select
                value={newTicket || "none"}
                onValueChange={(val) => {
                  if (val === "none") { setNewTicket(null); setNewTicketSeances(0); }
                  else {
                    setNewTicket(val);
                    const ticket = tickets.find((t) => t.TypeTicket === val);
                    if (ticket) setNewTicketSeances(ticket.NbSeanceTicket);
                  }
                }}
              >
                <SelectTrigger className="w-full">
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
                label="Séances du nouveau ticket" 
                type="number" 
                value={newTicketSeances} 
                onChange={(v) => setNewTicketSeances(Number(v))} 
              />
            )}
            <div>
            <Button 
              type="button" 
              onClick={handleAddTicket} 
              disabled={isAddingTicket || !newTicket}
              className="self-start"
            >
              {isAddingTicket ? "Ajout..." : "Ajouter ticket"}
            </Button>
            </div>
          </div>
        </section>



        {/* --- Cotisation --- */}
        <section className="border border-gray-200 rounded-xl p-5 bg-gray-50 flex items-end gap-3">
          <InputField label="Fin cotisation" type="date" value={formData.DateFinCoti || ""} onChange={(v) => handleChange("DateFinCoti", v)} />
          <Button type="button" variant="outline" size="sm" onClick={() => handleChange("DateFinCoti", getTodayPlusOneYear())}>+1 an</Button>
        </section>

        {/* --- Signature --- */}
        <section className="border border-gray-200 rounded-xl p-5 bg-gray-50 flex flex-col gap-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Signature du règlement</h3>
          <div className="flex flex-col sm:flex-row gap-4">
            {formData.CheminSignature && (
              <div className="flex flex-col">
                <p>Signature actuelle :</p>
                <img src={`${API_URL}/${formData.CheminSignature}`} alt="Signature" className="border w-64 h-auto mt-2" />
              </div>
            )}
            <div className="flex flex-col">
              <SignatureCanvas
                ref={sigCanvas}
                penColor="black"
                backgroundColor="white"
                canvasProps={{ className: "border w-full sm:w-96 h-40 bg-white rounded shadow-sm" }}
                onEnd={() => {
                  try {
                    const drawn = !!(sigCanvas.current && !sigCanvas.current.isEmpty());
                    setSignatureDrawn(drawn);
                  } catch {
                    setSignatureDrawn(true);
                  }
                }}
              />
              <div className="flex gap-2 mt-2">
                <Button type="button" variant="secondary" size="sm" onClick={() => { sigCanvas.current?.clear(); setSignatureDrawn(false); }}>Effacer</Button>
                <Button type="button" variant="default" size="sm" onClick={handleSignatureSave} disabled={isUpdatingSignature}>
                  {isUpdatingSignature ? "Enregistrement..." : "Mettre à jour la signature"}
                </Button>
              </div>
            </div>
          </div>
          <div>
            {formData.AccordReglement ? <p className="text-green-600 font-semibold">Règlement signé ✅</p> : <p className="text-red-500 font-semibold">Règlement non signé ❌</p>}
          </div>
          <div className="flex items-center justify-between gap-2 mt-4">
            <label>Accord Parental</label>
            <p>Votre signature ci-dessus vaut aussi pour l'autorisation parentale si elle est cochée.</p>
            <Switch checked={formData.AccordParental || false} onCheckedChange={(checked) => handleChange("AccordParental", checked)} />
          </div>
        </section>

        {/* --- Note --- */}
        <section className="border border-gray-200 rounded-xl p-5 bg-gray-50">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Note</label>
          <textarea value={formData.Note || ""} onChange={(e) => handleChange("Note", e.target.value)} className="w-full border rounded px-2 py-1 min-h-[80px]" />
        </section>

        {/* --- Actions --- */}
        <div className="flex gap-3 items-center justify-center">
          {/* Only show confirmation dialog when there are unsaved changes */}
          {isDirty ? (
            <ConfirmButton
              triggerText="Annuler"
              title="Confirmer l'annulation"
              description="Êtes-vous sûr(e) de vouloir annuler ? Toutes les modifications non enregistrées seront perdues."
              onConfirm={() => onCancel?.()}
              confirmText="Oui, annuler"
              cancelText="Non, continuer"
              variantConfirm="destructive"
            />
          ) : (
            <Button type="button" variant="outline" onClick={() => onCancel?.()}>
              Annuler
            </Button>
          )}
          <Button size="lg" type="submit" disabled={isSaving}>{isSaving ? "Enregistrement..." : "Enregistrer"}</Button>
        </div>

      </form>
    </div>
  );
}

/* --- InputField --- */
function InputField({
  label,
  type = "text",
  value,
  onChange,
  readOnly = false,
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
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
        className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all disabled:bg-gray-100 disabled:text-gray-500"
        disabled={readOnly}
      />
    </div>
  );
}
