// src/services/api/postClientData.ts
import { ClientForm } from "@/src/types&fields/types";

const API_URL = "http://127.0.0.1:5000";

export async function postClientData(data: ClientForm): Promise<{ success: boolean; grimpeur?: any; message: string }>{
try {
      console.log("POST vers API:", `${API_URL}/grimpeurs`, data); // debug

      const response = await fetch(`${API_URL}/grimpeurs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`Erreur HTTP: ${response.status}`, errText);
        return { success: false, message: errText || `Erreur HTTP ${response.status}` };
      }

      const json = await response.json();
      return { success: true, grimpeur: json.grimpeur, message: json.message || "Client ajouté avec succès" };
    } catch (error: any) {
      console.error("Échec de la création du client:", error);
      return { success: false, message: error.message || "Erreur réseau inconnue" };
    }
}

export async function putGrimpeurSignature(
    id: number,
    signatureBase64: string,
    accordReglement?: boolean,
    accordParental?: boolean
  ){
    try {
      const params = new URLSearchParams();
      if (accordReglement !== undefined) params.append("AccordReglement", String(accordReglement));
      if (accordParental !== undefined) params.append("AccordParental", String(accordParental));

      const response = await fetch(`${API_URL}/grimpeurs/accord/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ CheminSignature: signatureBase64 }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.error(`Erreur HTTP: ${response.status}`, errText);
        return { success: false, message: errText || `Erreur HTTP ${response.status}` };
      }

      const json = await response.json();
      return { success: true, data: json, message: json.message || "Signature enregistrée" };
    } catch (error: any) {
      console.error("Échec de l'envoi de la signature:", error);
      return { success: false, message: error.message || "Erreur réseau inconnue" };
    }
}
