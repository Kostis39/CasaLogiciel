import { realService } from "./real";
import { mockService } from "./mock";

const USE_MOCK = false;
const api = USE_MOCK ? mockService : realService;

export const {
//------- Fetchers -------
  fetchClientById,
  fetchClientSearch,
  fetchAbonnements,
  fetchTickets,
  fetchProduits,
  fetchRacineProduits,
  fetchSousProduits,

//------- Posters -------
  postSeanceClient,
  postAbonnement,
  postTicket,
  postProduit,
  postClientData,
  postTransaction,

//------- Putters -------
  updateAbonnement,
  updateTicket,
  updateProduit,
  updateCotisationClient,
  updateGrimpeurSignature,

//------- Deleters -------
  deleteAbonnement,
  deleteTicket,
  deleteProduit,
  deleteSeance,

  
//------- Others -------
  isAlreadyEntered,
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