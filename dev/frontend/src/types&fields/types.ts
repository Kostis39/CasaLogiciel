
export type Client = {
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
  Club?: string | null;

  TypeAbo: string | null;
  TypeTicket: string | null;
  DateFinAbo?: string;
  DateFinCoti?: string | undefined | null;
  NbSeanceRest?: number;
  DateInscrGrimpeur?: string;
  AccordReglement?: boolean;
  AccordParental?: boolean;
  CheminSignature?: string ;
};

export type ClientForm = {
  NomGrimpeur: string;
  PrenomGrimpeur: string;
  DateNaissGrimpeur: string;
  TelGrimpeur?: number;
  EmailGrimpeur?: string;
  NumLicenceGrimpeur?: number;
  Club?: string;
  StatutVoie?: number;
  TypeAbo?: string;
  DateFinAbo?: string;
  TypeTicket?: string;
  NbSeanceRest?: number;
  DateFinCoti?: string;
  AccordReglement: boolean;
  AccordParental?: boolean;
  CheminSignature?: string | null;
  Note?: string;
};

export type Ticket = {
  IdTicket: number;
  TypeTicket: string;
  PrixTicket: number;
  NbSeanceTicket: number;
};

export type Abonnement = {
        PrixAbo: number;
        DureeAbo: number;
        TypeAbo: string;
        IdAbo: number;
};

export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};
