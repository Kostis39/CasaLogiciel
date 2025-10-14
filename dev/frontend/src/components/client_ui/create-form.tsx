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
import { ClientForm } from "@/src/types&fields/types";
import { fetchAbonnements, fetchTickets, postClientData, postTransaction, updateGrimpeurSignature } from "@/src/services/api";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "react-toastify";
import Link from "next/link";
import { getStatutVoieBg } from "./clientInfo";



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

  const [abonnements, setAbonnements] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);

  const [createdGrimpeurId, setCreatedGrimpeurId] = useState<number | null>(null);

  const sigCanvas = useRef<SignatureCanvas>(null);

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
    };
    loadData();
  }, []);


  const handleSubmit = form.handleSubmit(async (data: ClientForm) => {
    setIsSubmitting(true);
    try {
      // 1️⃣ Création du grimpeur
      const result = await postClientData(data);
      if (!result.success || !result.data) {
        toast.error(result.message+"");
        return;
      };

      setCreatedGrimpeurId(result.data.NumGrimpeur);
      const grimpeur = result.data;

    const signatureBase64 = sigCanvas.current?.getTrimmedCanvas().toDataURL("image/png");
    if (signatureBase64) {
      const sigResult = await updateGrimpeurSignature(
        grimpeur.NumGrimpeur,
        signatureBase64,
        data.AccordReglement,
        data.AccordParental
      );

      if (!sigResult.success) {
        toast.error(sigResult.message);
        return; // stop ici
      }
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
    sigCanvas.current?.clear();

  } catch (err: any) {
    toast.error(err.message || "Erreur lors de la création du client");
    console.error("❌ Erreur:", err);
  } finally {
    setIsSubmitting(false);
  }
});

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
            href={`/client/saisies?query=${createdGrimpeurId}&id=${createdGrimpeurId}`}
            className={`${buttonVariants({variant: "default" })}`}
          >
            Voir le profil du grimpeur
          </Link>

          <Button
            variant="default"
            onClick={() => {
              form.reset();
              sigCanvas.current?.clear();
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
    <div>
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 "
      >
        {/* Nom */}
        <FormField
          control={form.control}
          name="NomGrimpeur"
          rules={{ required: "Le nom du grimpeur est obligatoire" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom *</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Entrer votre nom" />
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
                <Input {...field} placeholder="Entrer votre prénom" />
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
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value !== "" ? value : null); // <-- convertit '' en null
                  }}
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
                <Input {...field} type="tel" placeholder="Entrer un numéro" />
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
                <Input {...field} type="email" placeholder="Entrer un email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Numéro de licence */}
        <FormField
          control={form.control}
          name="NumLicenceGrimpeur"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Numéro de Licence</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="text"
                  placeholder="Numéro de licence"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Club */}
        <FormField
          control={form.control}
          name="Club"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Club</FormLabel>
              <FormControl>
              <Input
                value={field.value ?? ""}
                onChange={(e) =>
                  field.onChange(e.target.value === "" ? null : e.target.value)
                }
                placeholder="Entrer un club"
              />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Statut voie */}
        <FormField
          control={form.control}
          name="StatutVoie"
          render={({ field }) => {
            const options = [
              { value: 1, label: "Bloc" },
              { value: 2, label: "Moulinette" },
              { value: 3, label: "Tête" },
            ];

            return (
              <FormItem className="flex flex-col gap-1 w-full py-2">
                <FormLabel className="text-sm font-medium">Accès au mur</FormLabel>
              <FormControl>
                <ToggleGroup
                  type="single"
                  value={field.value?.toString()}
                  onValueChange={(val) => field.onChange(val ? Number(val) : null)}
                  className="inline-flex "
                  variant="outline"
                >
                  {options.map(({ label, value }) => (
                    <ToggleGroupItem
                      key={value}
                      value={value.toString()}
                      className={`min-w-[5rem] ${getStatutVoieBg(value)}
                        data-[state=on]:border-blue-500
                        transition-colors
                      `}
                    >
                      {label}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </FormControl>

                <FormMessage/>
              </FormItem>
            );
          }}
        />


      {/* Abonnement */}
      <div className="flex gap-2 w-full">
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
                    form.setValue("DateFinAbo", undefined);
                  } else {
                    const abo = abonnements.find((a) => a.TypeAbo === val);
                    if (abo) {
                      form.setValue("TypeAbo", abo.TypeAbo);

                      // calcule la date finale à partir de la durée en jours
                      const dateFin = new Date();
                      dateFin.setDate(dateFin.getDate() + abo.DureeAbo);
                      const formattedDateFin = dateFin.toISOString().split("T")[0];
                      form.setValue("DateFinAbo", formattedDateFin);
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
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Input manuel pour modifier la durée */}
        <FormField
          control={form.control}
          name="DateFinAbo"
          render={({ field }) => (
            <FormItem className="w-32">
              <FormLabel>Date Fin</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>


      {/* Ticket */}
      <div className="flex gap-2 w-full">
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
                    form.setValue("NbSeanceRest", undefined);
                  } else {
                    const ticket = tickets.find((t) => t.TypeTicket === val);
                    if (ticket) {
                      form.setValue("TypeTicket", ticket.TypeTicket);
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
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Input manuel pour modifier le nombre de séances */}
        <FormField
          control={form.control}
          name="NbSeanceRest"
          render={({ field }) => (
            <FormItem className="w-32">
              <FormLabel>Séances</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    field.onChange(val || undefined);
                  }}
                  placeholder="Nb séances"
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>



        {/* Cotisation */}
        <FormField
          control={form.control}
          name="DateFinCoti"
          rules={{ required: "La cotisation est obligatoire" }}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cotisation *</FormLabel>
              <FormControl>
                <Switch
                  checked={!!field.value}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      // Date actuelle + 1 jour
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      // Format YYYY-MM-DD pour MariaDB
                      const formatted = tomorrow.toISOString().split("T")[0];
                      field.onChange(formatted);
                    } else {
                      field.onChange(undefined); // décoché
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />


      {/* Accord Règlement + accord parental*/}
      <div className="flex flex-col gap-3 p-3 border rounded">
        <FormField
          control={form.control}
          name="AccordReglement"
          rules={{ required: "La signature est obligatoire" }}
          render={({ field }) => (
            <FormItem className="">
              <FormLabel>Accord de Règlement *</FormLabel>

              <div className="flex flex-col items-center gap-3 mt-2">
                <SignatureCanvas
                  ref={sigCanvas}
                  penColor="black"
                  backgroundColor="white"
                  canvasProps={{
                    className: "border w-full sm:w-80 h-40 bg-white rounded shadow-sm",
                  }}
                  onEnd={() => {
                    // !! pour forcer boolean (évite erreur TS 'boolean | null')
                    const hasDrawing = !!(sigCanvas.current && !sigCanvas.current.isEmpty());
                    // on notifie react-hook-form via field.onChange
                    field.onChange(hasDrawing);
                  }}
                />

                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      sigCanvas.current?.clear();
                      // on met à false le champ dans le form
                      field.onChange(false);
                    }}
                  >
                    Effacer
                  </Button>
                </div>

                {/* Affichage du message d'erreur lié au champ AccordReglement */}
                <FormMessage />
              </div>
            </FormItem>
          )}
        />


      {/* Accord Parental */}
        <FormField
          control={form.control}
          name="AccordParental"
          render={({ field }) => (
            <div className="flex items-center justify-between mt-4">
              <FormLabel>Accord Parental</FormLabel>
              <p className="text-sm text-gray-600">
                Votre signature ci-dessus vaut aussi pour l'autorisation parentale si elle est cochée.
              </p>
              <FormControl>
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
            </div>
          )}
        />
        </div>

        {/* Note */}
        <FormField
          control={form.control}
          name="Note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea
                  value={field.value ?? ""}
                  onChange={(e) =>
                    field.onChange(e.target.value === "" ? null : e.target.value)
                  }
                  placeholder="Entrer une note"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="flex justify-end pt-3">
          <Button className="rounded-lg min-w-[7rem]" size="sm" disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
    </div>
  );
}
