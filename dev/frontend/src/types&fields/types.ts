
export type Client = {
  NomGrimpeur: string;
  PrenomGrimpeur: string;
  DateNaissGrimpeur: string;
  NumGrimpeur: number;
  NumLicenceGrimpeur?: string;
  TelGrimpeur?: string;
  EmailGrimpeur?: string;
  Solde?: number;
  StatutVoie?: number;
  Note?: string | null;
  ClubId?: number | null;

  TypeAbo: string | null;
  TypeTicket: string | null;
  DateFinAbo?: string;
  DateFinCoti?: string | undefined | null;
  NbSeanceRest?: number;
  DateInscrGrimpeur?: string;
  AccordReglement?: boolean;
  AccordParental?: boolean;
  CheminSignature?: string ;

  TicketId?: number | null;
  AboId?: number | null;
};

export type ClientForm = {
  NomGrimpeur: string;
  PrenomGrimpeur: string;
  DateNaissGrimpeur: string;
  TelGrimpeur?: string;
  EmailGrimpeur?: string;
  NumLicenceGrimpeur?: string;
  ClubId?: number;
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
  TicketId?: number;
  AboId?: number;
};

export type Ticket = {
  IdTicket: number;
  TypeTicket: string;
  PrixTicket?: number;
  NbSeanceTicket: number;
};

export type Abonnement = {
        PrixAbo?: number;
        DureeAbo: number;
        TypeAbo: string;
        IdAbo: number;
};

export type ApiResponse<T = any> = {
  success: boolean;
  message: string;
  data?: T;
  total?: number;
};

export type TransactionForm ={
  TypeObjet: string;
  IdObjet: number;
  NumGrimpeur: number;
  Note?: string;
  TypeAbo?: string;
  DureeAbo?: number;
  DateFinAbo?: string;
  TypeTicket?: string;
  NbSeanceTicket?: number;
  NbSeanceRest?: number;
};

export type Transaction = {
    IdTransac: number;               
    TypeObjet: string;               
    IdObjet: number;                 
    ModePaiment?: string | null;     
    DateTransac: string;             
    HeureTransac: string;
    MontantFinalTransac?: number | null;
    Note?: string | null;
    NumGrimpeur?: number | null;
};

export type Seance = {
  IdSeance: number;
  DateSeance: string;
  HeureSeance: string;
  NumGrimpeur: number;
  TicketId?: number;
  AboId?: number;
};

export type ClubForm = {
  NomClub: string;
  CodePostClub: string;
  VilleClub: string;
  TelClub: string;
  EmailClub: string;
  AdresseClub: string;
  SiteInternet: string;
};

export type Club = {
  IdClub: number;
  NomClub: string;
  CodePostClub: string;
  VilleClub: string;
  TelClub: string;
  EmailClub: string;
  AdresseClub: string;
  SiteInternet: string;
};