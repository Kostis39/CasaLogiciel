import { realService } from "./real";
import { mockService } from "./mock";

const USE_MOCK = true;
const api = USE_MOCK ? mockService : realService;

export const {
//------- Fetchers -------
  fetchGrimpeurById,
  fetchGrimpeurSearch,
  fetchAbonnements,
  fetchTickets,
  fetchProduits,

//------- Posters -------
  postSeanceClient,

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