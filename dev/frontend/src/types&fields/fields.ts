import { Client } from "./types";

export const clientFields: {
  label: string;
  key: keyof Client;
  format?: (v: any) => string;
}[] = [
  { label: "Nom", key: "NomGrimpeur" },
  { label: "Prénom", key: "PrenomGrimpeur" },
  { 
    label: "Date de naissance", 
    key: "DateNaissGrimpeur",
    format: (dateStr: string) => {
      if (!dateStr) return "—";
      const birthDate = new Date(dateStr);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return `${dateStr} (${age} ans)`;
    }
  },
  { label: "Date d'inscription", key: "DateInscrGrimpeur" },
  { label: "Numéro de licence", key: "NumLicenceGrimpeur" },
  { label: "Club", key: "Club" },
  { label: "Téléphone", key: "TelGrimpeur" },
  { label: "Email", key: "EmailGrimpeur" },
  { label: "Solde", key: "Solde", format: (v: number) => v !== undefined ? `${v.toFixed(2)} €` : "—" },
];
