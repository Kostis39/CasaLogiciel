import { formatDate } from "../lib/utils";
import { Grimpeur } from "./types";

type GrimpeurField<K extends keyof Grimpeur = keyof Grimpeur> = {
  label: string;
  key: K;
  format?: (v: Grimpeur[K]) => string;
};

export const grimpeurFields: GrimpeurField[] = [
  { label: "Nom", key: "NomGrimpeur" },
  { label: "Prénom", key: "PrenomGrimpeur" },
  { 
    label: "Date de naissance", 
    key: "DateNaissGrimpeur",
    format: (dateStr) => {
      if (!dateStr) return "—";
      const birthDate = new Date(dateStr as string);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return `${formatDate(dateStr as string)} (${age} ans)`;
    }
  },
  { label: "Date d'inscription", key: "DateInscrGrimpeur",
    format: (dateStr) => {
      if (!dateStr) return "—";
      const birthDate = new Date(dateStr as string);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return `${formatDate(dateStr as string)} (${age} ans)`;
    }
  },
  { label: "Numéro de licence", key: "NumLicenceGrimpeur", format: (v) => (v as string) || "—" },
  { label: "Club", key: "ClubId", format: (v) => (v as string) || "—" },
  { label: "Téléphone", key: "TelGrimpeur", format: (v) => (v as string) || "—" },
  { label: "Email", key: "EmailGrimpeur", format: (v) => (v as string) || "—" },
  { label: "Solde", key: "Solde", format: (v) => (v !== undefined ? `${v} €` : "—") },
];
