
const API_URL = 'http://localhost:5000';

const USE_MOCK = true;

export const fetchGrimpeurById = async (id: number) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return {
    "CodePostGrimpeur": 38000,
    "NumGrimpeur": 1,
    "NumLicenceGrimpeur": 12345678,
    "EmailGrimpeur": "alice.dupont@example.com",
    "PrenomGrimpeur": "Alice",
    "TelGrimpeur": 612345678,
    "AccordReglement": true,
    "NomGrimpeur": "Dupont",
    "TypeTicket": null,
    "Solde": 50,
    "DateNaissGrimpeur": "1990-05-12",
    "SignaReglement": "ADupont",
    "NbSeanceRest": 10,
    "AdresseGrimpeur": "12 Rue de la Montagne",
    "DateInscrGrimpeur": "2025-04-30",
    "VilleGrimpeur": "Grenoble",
    "DateFinAbo": "2025-10-30",
    "DateFinCoti": "2025-10-30",
    "TypeAbo": null,
    "DateFincCotisation": "2026-04-30"
}
  }
  // Code normal si USE_MOCK = false
  try {
    const response = await fetch(`${API_URL}/grimpeurs/${id}`);
    if (!response.ok) {
      console.log(`Erreur HTTP: ${response.status}`);
      return {};
    }
    const grimpeur = await response.json();
    return grimpeur;
  } catch (error) {
    console.error('Échec de la récupération du grimpeur:', error);
    throw error;
  }
};


export const fetchGrimpeurSearch = async (query: string) => {
    if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return [{
      CodePostGrimpeur: 38000,
      NumGrimpeur: 1,
      NumLicenceGrimpeur: 12345678,
      EmailGrimpeur: "alice.dupont@example.com",
      PrenomGrimpeur: "Alice",
      TelGrimpeur: 612345678,
      AccordReglement: true,
      NomGrimpeur: "Dupont",
      TypeTicket: null,
      Solde: 50,
      DateNaissGrimpeur: "1990-05-12",
      SignaReglement: "ADupont",
      NbSeanceRest: 10,
      AdresseGrimpeur: "12 Rue de la Montagne",
      DateInscrGrimpeur: "2025-04-30",
      VilleGrimpeur: "Grenoble",
      DateFinAbo: "2025-10-30",
      DateFinCoti: "2025-10-30",
      TypeAbo: null,
      DateFincCotisation: "2026-04-30"
    },
  {
      CodePostGrimpeur: 38000,
      NumGrimpeur: 2,
      NumLicenceGrimpeur: 12345678,
      EmailGrimpeur: "alice.dupont@example.com",
      PrenomGrimpeur: "Alice",
      TelGrimpeur: 612345678,
      AccordReglement: true,
      NomGrimpeur: "Dupont",
      TypeTicket: null,
      Solde: 50,
      DateNaissGrimpeur: "1990-05-12",
      SignaReglement: "ADupont",
      NbSeanceRest: 10,
      AdresseGrimpeur: "12 Rue de la Montagne",
      DateInscrGrimpeur: "2025-04-30",
      VilleGrimpeur: "Grenoble",
      DateFinAbo: "2025-10-30",
      DateFinCoti: "2025-10-30",
      TypeAbo: null,
      DateFincCotisation: "2026-04-30"
    }];
  }
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

export const isAlreadyEntered = async (id: number) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return true;
  }else {
    return fetch(`${API_URL}/grimpeurs/seance/${id}`);
  }
};
