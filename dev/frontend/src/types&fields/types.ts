
export interface Client {
  NomGrimpeur: string;
  PrenomGrimpeur: string;
  DateNaissGrimpeur: string;
  NumGrimpeur: number;
  NumLicenceGrimpeur?: number;
  TelGrimpeur?: number;
  EmailGrimpeur?: string;
  Solde?: number;
  StatutVoie?: number;
  Note?: string | null;

  TypeAbo: string | null;
  TypeTicket: string | null;
  DateFinAbo?: string;
  DateFinCoti?: string | undefined | null;
  NbSeanceRest?: number;
  DateInscrGrimpeur?: string;
  AccordReglement?: boolean;
}

export interface MResponse {
  success: boolean;
  message: string;
}