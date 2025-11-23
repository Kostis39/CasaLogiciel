"use client";

import { useEffect, useRef, useState } from "react";
import SignaturePad from "signature_pad";
import { Button } from "@/src/components/ui/button";
import { toast } from "react-toastify";
import { updateGrimpeurSignature } from "@/src/services/api";

export default function TestSignature() {
  const numClient = 1052; // exemple de numéro de client
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const padRef = useRef<SignaturePad | null>(null);
  const [isEmpty, setIsEmpty] = useState<boolean>(true);
  const [isUpdatingSignature, setIsUpdatingSignature] = useState(false);

  const handleSignatureSave = async () => {
    const pad = padRef.current;
    const canvas = canvasRef.current;
    if (!pad || !canvas || pad.isEmpty()) return;
      const signatureBase64 = canvasRef.current?.toDataURL("image/png");
    if (!signatureBase64) return toast.warning("Veuillez signer avant d'enregistrer !");
    setIsUpdatingSignature(true);
    try {
      const res = await updateGrimpeurSignature(
        numClient,
        signatureBase64,
        false
      );
      if (res.success) {
        toast.success("Signature mise à jour !");
        handleClear();
      } else toast.error(res.message || "Erreur lors de la mise à jour");
    }catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      toast.error(message || "Erreur ...");
    } finally {
      setIsUpdatingSignature(false);
    }
  };
  // initialise le canvas et le SignaturePad
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
    setIsEmpty(pad.isEmpty());
  };

  // initialisation (montage)
  useEffect(() => {
    initCanvasAndPad();

    return () => {
      // nettoyage : clear et nullify
      padRef.current?.clear();
      padRef.current = null;
    };
    // on veut exécuter une seule fois
  }, []);

  // gestion du redimensionnement : réinitialise le canvas proprement
  useEffect(() => {
    const handleResize = () => {
      // clear existing pad first
      padRef.current?.clear();
      padRef.current = null;
      initCanvasAndPad();
      setIsEmpty(true);
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
      setIsEmpty(false);
    };

    const handlePointerUp = () => {
      // quand on relâche, on vérifie réellement si le pad a des tracés
      const pad = padRef.current;
      setIsEmpty(pad ? pad.isEmpty() : true);
    };

    // Utilisation de pointer events (couvre souris + tactile)
    canvas.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, []); // on attache une seule fois au montage

  const handleClear = () => {
    padRef.current?.clear();
    setIsEmpty(true);
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6">Test de Signature</h1>

      <div className="border border-gray-300 rounded-lg p-4 bg-white shadow-sm w-full max-w-md">
        <canvas
          ref={canvasRef}
          className="border border-gray-200 w-full h-64 bg-white rounded"
          style={{ touchAction: "none" }}
        />
      </div>

      <div className="flex gap-4 mt-4">
        <Button type="button" variant="outline" onClick={handleClear}>
          Effacer
        </Button>
        <Button type="button" variant="default" onClick={handleSignatureSave} disabled={isUpdatingSignature}>
          {isUpdatingSignature ? "Enregistrement..." : "Mettre à jour la signature"}
        </Button>
      </div>

      <p className="mt-4 text-sm text-gray-600">
        {isEmpty ? "Aucune signature détectée." : "Signature prête à être sauvegardée !"}
      </p>
    </section>
  );
}
