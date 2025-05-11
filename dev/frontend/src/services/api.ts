const API_URL = 'http://localhost:5000'; // Adresse de votre API Flask

interface Grimpeur {
  NumGrimpeur: number;
  NomGrimpeur: string;
  PrenomGrimpeur: string;
  EmailGrimpeur: string;
  TelGrimpeur: string; // Les numéros de tel sont mieux en string
  AdresseGrimpeur: string;
  VilleGrimpeur: string;
  CodePostGrimpeur: string; 
  DateNaissGrimpeur: string; 
  DateInscrGrimpeur: string;
  NbSeanceRest: number;
  Solde: number;
  DateFinCoti: string;
  DateFincCotisation: string;
  DateFinAbo: string;
  AccordReglement: boolean;
  SignaReglement: string;
  NumLicenceGrimpeur: number;
  TypeAbo: string | null;
  TypeTicket: string | null;
}

export const fetchGrimpeurById = async (id: number) => {
  try {
    const response = await fetch(`${API_URL}/grimpeurs/${id}`);
    if (!response.ok) {
      console.log(`Erreur HTTP: ${response.status}`);
      return false;
    }
    return await response.json();
    
  } catch (error) {
    console.error('Échec de la récupération du grimpeur:', error);
    throw error;
  }
};

export const fetchGrimpeurSearch = async (query: string) => {
  try {
    const response = await fetch(`${API_URL}/grimpeurs//search?query=${query}`);
    if (!response.ok) {
      console.log(`Erreur HTTP: ${response.status}`);
      return false;
    }
    const data = await response.json();
    if (Array.isArray(data) && data.length > 0) {
      return data;
    } else {
      console.log('Aucune donnée trouvée.');
      return false;
    }
  } catch (error) {
    console.error('Échec de la récupération du grimpeur:', error);
    throw error;
  }
};