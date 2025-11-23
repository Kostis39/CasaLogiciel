/* eslint-disable react/no-unescaped-entities */
"use client";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Button, buttonVariants } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/src/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Switch } from "@/src/components/ui/switch";
import { Textarea } from "@/src/components/ui/textarea";
import { Abonnement, ClientForm, Club, Ticket } from "@/src/types&fields/types";
import { fetchAbonnements, fetchClubs, fetchTickets, getStatutVoieBg, postClientData, postTransaction, updateGrimpeurSignature } from "@/src/services/api";
import SignaturePad from "signature_pad";
import { toast } from "react-toastify";
import Link from "next/link";
import { ConfirmButton } from "./buttonConfirm";

export function DraftForm() {
  const form = useForm<ClientForm>({
    defaultValues: {
      NomGrimpeur: "",
      PrenomGrimpeur: "",
      AccordReglement: false,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const [abonnements, setAbonnements] = useState<Abonnement[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);

  const [createdGrimpeurId, setCreatedGrimpeurId] = useState<number | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);

  const initCanvasAndPad = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // ajuster la résolution pour écrans haute densité
    const ratio = Math.max(window.devicePixelRatio || 1, 1);
    canvas.width = canvas.offsetWidth * ratio;
    canvas.height = canvas.offsetHeight * ratio;
    const ctx = canvas.getContext("2d");
    if (ctx) ctx.scale(ratio, ratio);

    // crée le pad et stocke dans la ref
    const pad = new SignaturePad(canvas, {
      penColor: "black",
      backgroundColor: "white",
    });
    padRef.current = pad;
  };
  // initialisation (montage)
  useEffect(() => {
    initCanvasAndPad();
  }, []);

  // gestion du redimensionnement : réinitialise le canvas proprement
  useEffect(() => {
    const handleResize = () => {
      // clear existing pad first
      padRef.current?.clear();
      padRef.current = null;
      initCanvasAndPad();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // écouteurs pointer pour détecter début/fin de dessin
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handlePointerDown = () => {
      // dès qu'on appuie, on considère qu'il y a une signature (temporaire)
    };

    const handlePointerUp = () => {
      // quand on relâche, on vérifie réellement si le pad a des tracés
      //const pad = padRef.current;
    };

    // Utilisation de pointer events (couvre souris + tactile)
    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []); // on attache une seule fois au montage


  useEffect(() => {
    const loadData = async () => {
      const aboRes = await fetchAbonnements();
      if (aboRes.success && aboRes.data) {
        setAbonnements(aboRes.data);
      }
      const ticketRes = await fetchTickets();
      if (ticketRes.success && ticketRes.data) {
        setTickets(ticketRes.data);
      }
      const clubRes = await fetchClubs();
      if (clubRes.success && clubRes.data) {
        setClubs(clubRes.data);
      }
    };
    loadData();
  }, []);

  const handleSubmit = form.handleSubmit(async (data: ClientForm) => {
    setIsSubmitting(true);
    try {
      if (!data.DateFinCoti) {
        toast.error("Veuillez cotiser avant de créer le grimpeur !");
        return;
      }
      if (padRef.current?.isEmpty()) {
        toast.error("Veuillez signer avant de créer le grimpeur !");
        return;
      }
      const result = await postClientData(data);
      if (!result.success || !result.data) {
        toast.error(result.message+"");
        return;
      };

      setCreatedGrimpeurId(result.data.NumGrimpeur);
      const grimpeur = result.data;

      // 2️⃣ Enregistrement de la signature
      const pad = padRef.current;
      const canvas = canvasRef.current;
      if (!pad || !canvas || pad.isEmpty()) return;
      const signatureBase64 = canvasRef.current?.toDataURL("image/png");
      if (!signatureBase64) return toast.warning("Veuillez signer avant d'enregistrer !");
      setIsSubmitting(true);
      try {
        const res = await updateGrimpeurSignature(
          grimpeur.NumGrimpeur,
          signatureBase64,
          data.AccordParental
        );
        if (!res.success) {
          toast.error(res.message);
          return;
          }
      }catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        toast.error(message || "Erreur ...");
      } finally {
        setIsSubmitting(false);
      }

      // 3️⃣ Création transaction si abonnement ou ticket choisi
      if (data.TypeAbo) {
        const abo = abonnements.find((a) => a.TypeAbo === data.TypeAbo);
        if (abo) {
          const transRes = await postTransaction({
            TypeObjet: "abonnement",
            IdObjet: abo.IdAbo,
            NumGrimpeur: grimpeur.NumGrimpeur,
            TypeAbo: abo.TypeAbo,
            DureeAbo: abo.DureeAbo,
            DateFinAbo: data.DateFinAbo,
          });
          if (!transRes.success) {
            toast.error(transRes.message);
            return;
          }
        }
    }

    if (data.TypeTicket) {
      const ticket = tickets.find((t) => t.TypeTicket === data.TypeTicket);
      if (ticket) {
        const transRes = await postTransaction({
          TypeObjet: "ticket",
          IdObjet: ticket.IdTicket,
          NumGrimpeur: grimpeur.NumGrimpeur,
          TypeTicket: ticket.TypeTicket,
          NbSeanceTicket: ticket.NbSeanceTicket,
          NbSeanceRest: data.NbSeanceRest,
        });
        if (!transRes.success) {
          toast.error(transRes.message);
          return;
        }
      }
    }

    // ✅ Succès
    setHasSucceeded(true);
    form.reset();
    handleClearSignature();

  } catch (err) {
    const message = (err as Error)?.message ?? "Erreur lors de la création du client";
    toast.error(message);
  } finally {
    setIsSubmitting(false);
  }
});

  const handleClearSignature = () => {
    padRef.current?.clear();
  };

  const handleToggleCoti = (checked: boolean, onChange: (value: string | undefined) => void) => {
    if (checked) {
      const date = new Date();
      date.setFullYear(date.getFullYear() + 1);
      onChange(date.toISOString().split("T")[0]);
    } else {
      onChange(undefined);
    }
  };


  if (hasSucceeded) {
    return (
      <div className="p-2 sm:p-5 md:p-8 w-full rounded-md gap-2 border">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, stiffness: 300, damping: 25 }}
          className="h-full py-6 px-3"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{
              delay: 0.3,
              type: "spring",
              stiffness: 500,
              damping: 15,
            }}
            className="mb-4 flex justify-center border rounded-full w-fit mx-auto p-2"
          >
            <Check className="size-8 text-green-600" />
          </motion.div>

          <h2 className="text-center text-2xl font-bold mb-2">
            Client enregistré ✅
          </h2>
          <p className="text-center text-lg text-muted-foreground mb-6">
            Le formulaire a bien été soumis.
          </p>

      <div className="flex justify-center gap-4">
          <Link
            href={`/client?query=${createdGrimpeurId}&id=${createdGrimpeurId}`}
            className={`${buttonVariants({variant: "default" })}`}
          >
            Voir le profil du grimpeur
          </Link>

          <Button
            variant="default"
            onClick={() => {
              form.reset();
              handleClearSignature();
              setHasSucceeded(false);
              setCreatedGrimpeurId(null);
            }}
          >
            Ajouter un autre client
          </Button>
      </div>
        </motion.div>
      </div>
    );
  }


return (
  <div className="flex flex-col min-h-0">
    <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
      Nouvelle inscription
    </h2>

    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 flex-1 pb-10"
      >
        {/* --- Informations Générales --- */}
        <section className="border border-gray-200 rounded-xl p-5 bg-gray-50 flex flex-col gap-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
            Informations générales
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Nom */}
            <FormField
              control={form.control}
              name="NomGrimpeur"
              rules={{ required: "Le nom du grimpeur est obligatoire" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Entrer le nom" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Prénom */}
            <FormField
              control={form.control}
              name="PrenomGrimpeur"
              rules={{ required: "Le prénom du grimpeur est obligatoire" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Entrer le prénom" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date de naissance */}
            <FormField
              control={form.control}
              name="DateNaissGrimpeur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date de Naissance</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Téléphone */}
            <FormField
              control={form.control}
              name="TelGrimpeur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel"   value={field.value ?? ""} placeholder="Numéro de téléphone" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <FormField
              control={form.control}
              name="EmailGrimpeur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} type="email" placeholder="Adresse email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Licence */}
            <FormField
              control={form.control}
              name="NumLicenceGrimpeur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Licence</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} placeholder="Numéro de licence" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Club */}
            <FormField
              control={form.control}
              name="ClubId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Club</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value?.toString() ?? ""}
                      onValueChange={(val) => {
                        if (val === "none" || val === "") {
                          field.onChange(undefined);
                        } else {
                          field.onChange(Number(val));
                        }
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Choisir un club" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Aucun</SelectItem>
                        {clubs.map((club) => (
                          <SelectItem key={club.IdClub} value={club.IdClub.toString()}>
                            {club.NomClub}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Accès au mur */}
          <div className="flex flex-col mt-2">
            <label className="text-sm font-semibold mb-1">Accès au mur</label>
            <FormField
              control={form.control}
              name="StatutVoie"
              render={({ field }) => (
                <FormControl>
                  <ToggleGroup
                    type="single"
                    value={field.value?.toString()}
                    onValueChange={(val) => field.onChange(val ? Number(val) : null)}
                    className="flex gap-2"
                  >
                    {[{ value: 1, label: "Bloc" }, { value: 2, label: "Moulinette" }, { value: 3, label: "Tête" }].map(({ value, label }) => (
                      <ToggleGroupItem
                        key={value}
                        value={value.toString()}
                        className={`px-3 py-1 rounded border ${getStatutVoieBg(value)} data-[state=on]:border-blue-500`}
                      >
                        {label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </FormControl>
              )}
            />
          </div>
        </section>

        {/* --- Abonnement & Tickets --- */}
        <section className="border border-gray-200 rounded-xl p-5 bg-gray-50 flex flex-col gap-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
            Abonnements & Tickets
          </h3>

          {/* Abonnement */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Select */}
            <FormField
              control={form.control}
              name="TypeAbo"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Type d'Abonnement</FormLabel>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(val) => {
                      if (val === "none") {
                        form.setValue("TypeAbo", undefined);
                        form.setValue("AboId", undefined); // ✅ on vide aussi
                        form.setValue("DateFinAbo", undefined);
                      } else {
                        const abo = abonnements.find((a) => a.TypeAbo === val);
                        if (abo) {
                          form.setValue("TypeAbo", abo.TypeAbo);
                          form.setValue("AboId", abo.IdAbo); // ✅ on stocke l’ID
                          const dateFin = new Date();
                          dateFin.setDate(dateFin.getDate() + abo.DureeAbo);
                          form.setValue("DateFinAbo", dateFin.toISOString().split("T")[0]);
                        }
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un abonnement" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      {abonnements.map((abo) => (
                        <SelectItem key={abo.IdAbo} value={abo.TypeAbo}>
                          {abo.TypeAbo} ({abo.PrixAbo} € / {abo.DureeAbo} jours)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Date fin */}
            <FormField
              control={form.control}
              name="DateFinAbo"
              render={({ field }) => (
                <FormItem className="w-48">
                  <FormLabel>Date fin</FormLabel>
                  <FormControl>
                    <Input type="date" value={field.value ?? ""} onChange={(e) => field.onChange(e.target.value)} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* Ticket */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Select */}
            <FormField
              control={form.control}
              name="TypeTicket"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel>Type de Ticket</FormLabel>
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(val) => {
                      if (val === "none") {
                        form.setValue("TypeTicket", undefined);
                        form.setValue("TicketId", undefined); // ✅ on vide aussi
                        form.setValue("NbSeanceRest", undefined);
                      } else {
                        const ticket = tickets.find((t) => t.TypeTicket === val);
                        if (ticket) {
                          form.setValue("TypeTicket", ticket.TypeTicket);
                          form.setValue("TicketId", ticket.IdTicket); // ✅ on stocke l’ID
                          form.setValue("NbSeanceRest", ticket.NbSeanceTicket);
                        }
                      }
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un ticket" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">Aucun</SelectItem>
                      {tickets.map((ticket) => (
                        <SelectItem key={ticket.IdTicket} value={ticket.TypeTicket}>
                          {ticket.TypeTicket} ({ticket.PrixTicket} € / {ticket.NbSeanceTicket} séances)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            {/* Nb séances */}
            <FormField
              control={form.control}
              name="NbSeanceRest"
              render={({ field }) => (
                <FormItem className="w-48">
                  <FormLabel>Séances</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value) || undefined)}
                      placeholder="Nb séances"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </section>

        {/* --- Cotisation --- */}
        <section className="border border-gray-200 rounded-xl p-5 bg-gray-50 flex flex-col gap-4">
          <h3 className="text-xl font-semibold mb-2 text-gray-700 border-b pb-2">
            Cotisation *
          </h3>

          <FormField
            control={form.control}
            name="DateFinCoti"
            render={({ field }) => {
              const isChecked = Boolean(field.value);

              const handleRowClick = () => {
                handleToggleCoti(!isChecked, field.onChange);
              };

              const handleSwitchClick = (event: React.MouseEvent) => {
                event.stopPropagation();
              };

              return (
                <div
                  className="
                    flex flex-row items-center justify-between
                    gap-4 p-4 bg-white rounded-xl shadow-sm
                    cursor-pointer select-none
                    hover:bg-gray-100 transition
                  "
                  onClick={handleRowClick}
                >
                  <p className="text-gray-700">Cotisation obligatoire</p>

                  <div onClick={handleSwitchClick}>
                    <Switch
                      checked={isChecked}
                      onCheckedChange={(checked) =>
                        handleToggleCoti(checked, field.onChange)
                      }
                    />
                  </div>
                </div>
              );
            }}
          />
        </section>



        {/* --- Signature --- */}
        <section className="border border-gray-200 rounded-xl p-5 bg-gray-50 flex flex-col gap-4">
          <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Signature du règlement *</h3>
          <FormField
            control={form.control}
            name="AccordReglement"
            render={() => (
              <FormItem className="flex flex-col sm:flex-row gap-4 justify-center-safe">
                <div className="flex flex-col">
                  <canvas
                    ref={canvasRef}
                    className="border border-gray-200 w-full h-64 bg-white rounded"
                    style={{ touchAction: "none" }}
                  />
                  <div className="flex gap-2 justify-center">
                    <Button type="button" variant="outline" onClick={handleClearSignature}>
                      Effacer
                    </Button>
                  </div>
                </div>
              </FormItem>
            )}
          />

          {/* Accord Parental */}
          <div className="flex flex-col items-center w-full mt-6">
            <FormField
              control={form.control}
              name="AccordParental"
              render={({ field }) => (
                <div className="flex flex-col items-center space-y-3 w-full">

                  {/* Ligne cliquable */}
                  <div
                    className="
                      flex justify-between items-center
                      w-full max-w-[500px]
                      cursor-pointer select-none
                      px-2 py-2
                      rounded-lg
                      hover:bg-gray-100 transition
                    "
                    onClick={() => field.onChange(!field.value)}
                  >
                    <FormLabel className="cursor-pointer text-gray-800">
                      Accord Parental
                    </FormLabel>

                    <FormControl>
                      <div
                        onClick={(e) => {
                          // Empêche la ligne de capturer le clic du switch
                          e.stopPropagation();
                        }}
                      >
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => field.onChange(checked)}
                        />
                      </div>
                    </FormControl>
                  </div>

                  {/* Texte explicatif sous la même largeur que le canvas */}
                  <p className="text-sm text-gray-600 text-center max-w-[500px]">
                    Votre signature ci-dessus vaut aussi pour l'autorisation parentale si elle est cochée.
                  </p>
                </div>
              )}
            />
          </div>



        </section>

        {/* --- Note --- */}
        <section className="border border-gray-200 rounded-xl p-5 bg-gray-50">
          <FormField
            control={form.control}
            name="Note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.value || null)}
                    placeholder="Entrer une note"
                    className="min-h-[80px]"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </section>

        {/* --- Actions --- */}
        <div className="flex gap-3 items-center justify-center pt-4">
          <ConfirmButton
            triggerText="Réinitialiser"
            title="Confirmer la réinitialisation"
            description="Êtes-vous sûr(e) de vouloir réinitialiser le formulaire ? Cette action ne peut pas être annulée."
            onConfirm={() => form.reset()}
          />

          <Button size="lg" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  </div>
);

}
