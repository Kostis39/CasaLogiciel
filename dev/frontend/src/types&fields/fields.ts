import { Client } from "./types";

export const clientFields: {
  label: string;
  key: keyof Client;
  format?: (v: any) => string;
}[] = [
  { label: "Nom", key: "NomGrimpeur" },
  { label: "Prénom", key: "PrenomGrimpeur" },
  { label: "Date de naissance", key: "DateNaissGrimpeur" },
  { label: "Numéro de licence", key: "NumLicenceGrimpeur" },
  { label: "Téléphone", key: "TelGrimpeur" },
  { label: "Email", key: "EmailGrimpeur" },
  { label: "Date d'inscription", key: "DateInscrGrimpeur" },
  { label: "Solde", key: "Solde" },
  { label: "Note", key: "Note" },
];
