import { realService } from "./real";
import { mockService } from "./mock";

const USE_MOCK = false;
const api = USE_MOCK ? mockService : realService;

export const {
//------- Fetchers -------
  fetchGrimpeurById,
  fetchGrimpeurSearch,
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

//------- Putters -------
  updateAbonnement,
  updateTicket,
  updateProduit,

//------- Deleters -------
  deleteAbonnement,
  deleteTicket,
  deleteProduit,
  
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