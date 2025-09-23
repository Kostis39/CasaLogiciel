"use client";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { useState } from "react";
import { Check } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/src/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Switch } from "@/src/components/ui/switch";
import { Textarea } from "@/src/components/ui/textarea";
import { serverAction } from "@/src/services/t";

type Schema = {
  NomGrimpeur: string;
  PrenomGrimpeur: string;
  DateNaissGrimpeur?: string;
  TelGrimpeur?: string;
  EmailGrimpeur?: string;
  NumLicenceGrimpeur?: number;
  Club?: string;
  StatutVoie?: string;
  TypeAbo?: string;
  DateFinAbo?: string;
  TypeTicket?: string;
  NbSeanceRest?: number;
  DateFinCoti?: boolean;
  AccordReglement: boolean;
  AccordParental?: boolean;
  Note?: string;
};

export function DraftForm() {
  const form = useForm<Schema>({
    defaultValues: {
      NomGrimpeur: "",
      PrenomGrimpeur: "",
      AccordReglement: false,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSucceeded, setHasSucceeded] = useState(false);

  const handleSubmit = form.handleSubmit(async (data: Schema) => {
    setIsSubmitting(true);
    try {
      const result = await serverAction(data);
      if (result.success) {
        setHasSucceeded(true);
        form.reset();
      } else {
        console.error("❌ Erreur serveur:", result);
      }
    } catch (err) {
      console.error("❌ Erreur inattendue:", err);
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
            <Check className="size-8" />
          </motion.div>
          <h2 className="text-center text-2xl text-pretty font-bold mb-2">
            Thank you
          </h2>
          <p className="text-center text-lg text-pretty text-muted-foreground">
            Form submitted successfully, we will get back to you soon
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col p-2 sm:p-5 md:p-8 w-full rounded-md gap-2 border"
      >
        {/* Nom */}
        <FormField
          control={form.control}
          name="NomGrimpeur"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Nom *</FormLabel>
              <FormControl>
                <Input {...field} required placeholder="Entrer votre nom" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Prénom */}
        <FormField
          control={form.control}
          name="PrenomGrimpeur"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Prénom *</FormLabel>
              <FormControl>
                <Input {...field} required placeholder="Entrer votre prénom" />
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
            <FormItem className="w-full">
              <FormLabel>Date de Naissance</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Entrer votre date de naissance" />
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
            <FormItem className="w-full">
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
            <FormItem className="w-full">
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
            <FormItem className="w-full">
              <FormLabel>Numéro de Licence</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(+e.target.value)}
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
            <FormItem className="w-full">
              <FormLabel>Club</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Entrer un club" />
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
              { value: "1", label: "Bloc" },
              { value: "2", label: "Moulinette" },
              { value: "3", label: "Tête" },
            ];
            return (
              <FormItem className="flex flex-col gap-2 w-full py-1">
                <FormLabel>Accès au mur</FormLabel>
                <FormControl>
                  <ToggleGroup
                    variant="outline"
                    value={field.value}
                    onValueChange={field.onChange}
                    type="single"
                    className="flex flex-wrap gap-2"
                  >
                    {options.map(({ label, value }) => (
                      <ToggleGroupItem key={value} value={value}>
                        {label}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        />

        {/* Abonnement */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full">
          <FormField
            control={form.control}
            name="TypeAbo"
            render={({ field }) => {
              const options = [
                { label: "Mensuel", value: "mensuel" },
                { label: "Annuel", value: "annuel" },
                { label: "Occasionnel", value: "occasionnel" },
              ];
              return (
                <FormItem className="w-full">
                  <FormLabel>Type d'Abonnement</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {options.map(({ label, value }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="DateFinAbo"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Date de fin</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Date de fin d'abonnement" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Ticket */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full">
          <FormField
            control={form.control}
            name="TypeTicket"
            render={({ field }) => {
              const options = [
                { label: "Normal", value: "normal" },
                { label: "Réduit", value: "reduit" },
                { label: "Gratuit", value: "gratuit" },
              ];
              return (
                <FormItem className="w-full">
                  <FormLabel>Type de Ticket</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Choisir un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {options.map(({ label, value }) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="NbSeanceRest"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Nombre de Séances</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(+e.target.value)}
                    placeholder="Nombre de séances"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Cotisation */}
        <FormField
          control={form.control}
          name="DateFinCoti"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start gap-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <FormLabel>Cotisation</FormLabel>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Accord règlement */}
        <FormField
          control={form.control}
          name="AccordReglement"
          render={({ field }) => (
            <FormItem className="flex flex-col p-3 border rounded">
              <div className="flex items-center justify-between">
                <FormLabel>Accord de Règlement *</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} required />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        {/* Accord parental */}
        <FormField
          control={form.control}
          name="AccordParental"
          render={({ field }) => (
            <FormItem className="flex flex-col p-3 border rounded">
              <div className="flex items-center justify-between">
                <FormLabel>Accord Parental</FormLabel>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </div>
            </FormItem>
          )}
        />

        {/* Note */}
        <FormField
          control={form.control}
          name="Note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Entrer une note" className="resize-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit */}
        <div className="flex justify-end pt-3">
          <Button className="rounded-lg" size="sm" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
