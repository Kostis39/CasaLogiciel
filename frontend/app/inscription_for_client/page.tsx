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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Switch } from "@/src/components/ui/switch";
import { Textarea } from "@/src/components/ui/textarea";
import { ClientForm, Club } from "@/src/types&fields/types";
import { fetchClubs, postClientData, updateGrimpeurSignature } from "@/src/services/api";
import SignaturePad from "signature_pad";
import { toast } from "react-toastify";
import Link from "next/link";
import { ConfirmButton } from "@/src/components/client_ui/buttonConfirm";

export default function DraftForm() {
  const form = useForm<ClientForm>({
    defaultValues: {
      NomGrimpeur: "",
      PrenomGrimpeur: "",
      AccordReglement: false,
      StatutVoie: 1,
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSucceeded, setHasSucceeded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // Nouvelle state pour les étapes

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

  // Initialisation du canvas quand on arrive à l'étape 2
  useEffect(() => {
    if (currentStep === 2) {
      // Petit délai pour s'assurer que le canvas est bien dans le DOM
      const timer = setTimeout(() => {
        initCanvasAndPad();
      }, 100);
      
      return () => {
        clearTimeout(timer);
        // Nettoyer le pad quand on quitte l'étape 2
        if (padRef.current) {
          padRef.current.off();
          padRef.current = null;
        }
      };
    }
  }, [currentStep]); // Se déclenche quand currentStep change

  // gestion du redimensionnement : réinitialise le canvas proprement
  useEffect(() => {
    const handleResize = () => {
      // Ne réinitialiser que si on est à l'étape 2 et que le canvas existe
      if (currentStep === 2 && canvasRef.current) {
        // clear existing pad first
        padRef.current?.clear();
        padRef.current = null;
        initCanvasAndPad();
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentStep]); // Dépend de currentStep

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

    // ✅ Succès
    setHasSucceeded(true);
    form.reset();
    handleClearSignature();
    setCurrentStep(1); // Réinitialiser l'étape

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

  // Validation de l'étape 1 avant de passer à l'étape 2
const handleNextStep = () => {
  const nomValue = form.getValues("NomGrimpeur");
  const prenomValue = form.getValues("PrenomGrimpeur");
  
  if (!nomValue || !prenomValue) {
    toast.error("Veuillez remplir au minimum le nom et le prénom");
    return;
  }
  
  setCurrentStep(2);
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, 0);
};

  const handlePreviousStep = () => {
    setCurrentStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (hasSucceeded) {
    return (
      <div className="p-2 sm:p-4 md:p-6 lg:p-8 w-full rounded-md gap-2 border overflow-y-auto max-h-screen">
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
            className="mb-4 flex justify-center border rounded-full w-fit mx-auto p-2 md:p-3"
          >
            <Check className="size-8 md:size-10 text-green-600" />
          </motion.div>

          <h2 className="text-center text-xl md:text-2xl lg:text-3xl font-bold mb-2">
            Client enregistré ✅
          </h2>
          <p className="text-center text-base md:text-lg text-muted-foreground mb-6">
            Le formulaire a bien été soumis.
          </p>

      <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4">

          <Button
            variant="default"
            onClick={() => {
              form.reset();
              handleClearSignature();
              setHasSucceeded(false);
              setCreatedGrimpeurId(null);
              setCurrentStep(1);
            }}
            className="h-12 md:h-14 px-6 md:px-8 text-base"
          >
            Ajouter un autre client
          </Button>
      </div>
        </motion.div>
      </div>
    );
  }


return (
  <div className="flex flex-col min-h-0 px-2 md:px-4 overflow-y-auto max-h-screen pb-8">
    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 md:mb-6 text-center text-gray-800 pt-4">
      Nouvelle inscription
    </h2>

    {/* Indicateur d'étapes */}
    <div className="flex items-center justify-center mb-6 md:mb-8">
      <div className="flex items-center gap-2 md:gap-4">
        <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 font-semibold transition-colors ${
          currentStep === 1 ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-400 border-gray-300'
        }`}>
          1
        </div>
        <div className="h-1 w-12 md:w-20 bg-gray-300">
          <div className={`h-full transition-all duration-300 ${currentStep === 2 ? 'bg-blue-500 w-full' : 'w-0'}`} />
        </div>
        <div className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full border-2 font-semibold transition-colors ${
          currentStep === 2 ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-400 border-gray-300'
        }`}>
          2
        </div>
      </div>
    </div>

    <div className="text-center mb-4">
      <p className="text-sm md:text-base text-gray-600">
        {currentStep === 1 ? 'Étape 1 : Informations personnelles' : 'Étape 2 : Signature du règlement'}
      </p>
    </div>

    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 md:gap-8 flex-1 pb-10"
      >
        {/* ========== ÉTAPE 1 : INFORMATIONS PERSONNELLES ========== */}
        {currentStep === 1 && (
          <>
        {/* --- Informations Générales --- */}
        <section className="border border-black rounded-xl p-4 md:p-6 bg-gray-50 flex flex-col gap-4">
          <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-gray-700 border-b pb-2">
            Informations générales
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {/* Nom */}
            <FormField
              control={form.control}
              name="NomGrimpeur"
              rules={{ required: "Le nom du grimpeur est obligatoire" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm md:text-base">Nom *</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Entrer le nom"
                      className="border-black h-10 md:h-12 text-base"
                    />
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
                  <FormLabel className="text-sm md:text-base">Prénom *</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Entrer le prénom" className="border-black h-10 md:h-12 text-base"/>
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
                  <FormLabel className="text-sm md:text-base">Date de Naissance</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      className="border-black h-10 md:h-12 text-base"
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
                  <FormLabel className="text-sm md:text-base">Téléphone</FormLabel>
                  <FormControl>
                    <Input {...field} type="tel" value={field.value ?? ""} placeholder="Numéro de téléphone" className="border-black h-10 md:h-12 text-base"/>
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
                  <FormLabel className="text-sm md:text-base">Email</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} type="email" placeholder="Adresse email" className="border-black h-10 md:h-12 text-base"/>
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
                  <FormLabel className="text-sm md:text-base">Licence</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} placeholder="Numéro de licence" className="border-black h-10 md:h-12 text-base"/>
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
                  <FormLabel className="text-sm md:text-base">Club</FormLabel>
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
                        <SelectTrigger className="border-black h-10 md:h-12 text-base">
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
        </section>

        {/* Bouton Suivant pour l'étape 1 */}
        <div className="flex justify-center pt-4">
          <Button 
            type="button" 
            onClick={handleNextStep}
            size="lg"
            className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-12 text-base md:text-lg"
          >
            Suivant →
          </Button>
        </div>
          </>
        )}

        {/* ========== ÉTAPE 2 : SIGNATURE DU RÈGLEMENT ========== */}
        {currentStep === 2 && (
          <>
        {/* --- Affichage du PDF du règlement --- */}
        <section className="border border-black rounded-xl p-4 md:p-6 bg-gray-50 flex flex-col gap-4">
          <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-gray-700 border-b pb-2">
            Règlement intérieur
          </h3>
          <div className="w-full bg-white border border-gray-300 rounded-lg overflow-hidden">
            <iframe
              src="/reglement.pdf#page=1"
              className="w-full h-[400px] md:h-[500px] lg:h-[600px]"
              title="Règlement intérieur"
            />
            <p className="text-center text-sm text-gray-600 p-3 bg-gray-50">
              Veuillez lire le règlement intérieur avant de signer
            </p>
          </div>
        </section>

        {/* --- Signature --- */}
        <section className="border border-black rounded-xl p-4 md:p-6 bg-gray-50 flex flex-col gap-4">
          <h3 className="text-lg md:text-xl font-semibold mb-2 md:mb-4 text-gray-700 border-b pb-2">Signature du règlement *</h3>
          <FormField
            control={form.control}
            name="AccordReglement"
            render={() => (
              <FormItem className="flex flex-col sm:flex-row gap-4 justify-center-safe">
                <div className="flex flex-col">
                  <canvas
                    ref={canvasRef}
                    className="border border-black w-full h-64 md:h-80 lg:h-96 bg-white rounded"
                    style={{ touchAction: "none" }}
                  />
                  <div className="flex gap-2 justify-center mt-3">
                    <Button type="button" variant="outline" onClick={handleClearSignature} className="h-10 md:h-12 px-4 md:px-6 text-base">
                      Effacer
                    </Button>
                  </div>
                </div>
              </FormItem>
            )}
          />

          {/* Accord Parental */}
          {/*
          <div className="flex flex-col items-center w-full mt-4 md:mt-6">
            <FormField
              control={form.control}
              name="AccordParental"
              render={({ field }) => (
                <div className="flex flex-col items-center space-y-3 w-full">

                  <div
                    className="
                      flex justify-between items-center
                      w-full max-w-[500px]
                      cursor-pointer select-none
                      px-3 md:px-4 py-3 md:py-4
                      rounded-lg
                      hover:bg-gray-100 transition
                      border border-black
                    "
                    onClick={() => field.onChange(!field.value)}
                  >
                    <FormLabel className="cursor-pointer text-gray-800 text-sm md:text-base">
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

                  <p className="text-sm text-gray-600 text-center max-w-[500px]">
                    Votre signature ci-dessus vaut aussi pour l'autorisation parentale si elle est cochée.
                  </p>
                </div>
              )}
            />
          </div>
          */}



        </section>

        {/* --- Actions pour l'étape 2 --- */}
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 items-center justify-center pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={handlePreviousStep}
            className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-base md:text-lg border-black"
          >
            ← Précédent
          </Button>

          <ConfirmButton
            triggerText="Réinitialiser"
            title="Confirmer la réinitialisation"
            description="Êtes-vous sûr(e) de vouloir réinitialiser le formulaire ? Cette action ne peut pas être annulée."
            onConfirm={() => {
              form.reset();
              handleClearSignature();
              setCurrentStep(1);
            }}
            triggerClassName="border border-black w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-base md:text-lg"
          />

          <Button size="lg" type="submit" disabled={isSubmitting} className="w-full sm:w-auto h-12 md:h-14 px-6 md:px-8 text-base md:text-lg">
            {isSubmitting ? "Création..." : "Créer"}
          </Button>
        </div>
          </>
        )}
      </form>
    </Form>
  </div>
);

}