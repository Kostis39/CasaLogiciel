import { realService } from "./real";
import { mockService } from "./mock";

const USE_MOCK = false;
const api = USE_MOCK ? mockService : realService;

export const {
//------- Fetchers -------
  fetchTicketById,
  fetchAbonnementById,
  fetchClientById,
  fetchClientSearch,
  fetchClients,
  fetchAbonnements,
  fetchTickets,

//------- Posters -------
  postSeanceClient,
  postAbonnement,
  postTicket,
  postClientData,
  postTransaction,

//------- Putters -------
  updateAbonnement,
  updateTicket,
  updateCotisationClient,
  updateGrimpeurSignature,
  updateClientData,
  updateTransaction,

//------- Deleters -------
  deleteAbonnement,
  deleteTicket,
  deleteSeance,

  
//------- Others -------
  isAlreadyEntered,
  fetchClubs,
  postClub,
  updateClub,
  deleteClub,
  fetchClubById,
} = api;


export function haveDateJSON() {
  const date = new Date();
  const isoString = date.toISOString();
  const [fullDate, timeWithMs] = isoString.split('T');
  const time = timeWithMs.split('.')[0];
  return {
    date: fullDate,
    hour: time
  };
}

export function getToday(): string {
  const today = new Date();
  return today.toISOString().split("T")[0]; // format YYYY-MM-DD
}

export function getTodayPlusOneYear(): string {
  const today = new Date();
  today.setFullYear(today.getFullYear() + 1);
  return today.toISOString().split("T")[0]; // format YYYY-MM-DD
}

export function isDateValid(dateFinCoti: string | undefined | null): boolean {
  if (!dateFinCoti) return false;
  const today = new Date();
  const cotiDate = new Date(dateFinCoti);
  return cotiDate >= today;
}

export function getStatutVoieBg(StatutVoie: number | undefined) {
  switch (StatutVoie) {
    case 1: // Bloc
      return "bg-orange-300";
    case 2: //Voie
      return "bg-green-300";
    case 3: // Tête
      return "bg-blue-300";
    default:
      return "bg-orange-300";
  }
}
