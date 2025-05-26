
const API_URL = 'http://localhost:5000';

const USE_MOCK = true;

export const fetchGrimpeurById = async (id: number) => {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    return [
      { label: "Nom", value: "Dupont" },
      { label: "Prénom", value: "Alice" },
      { label: "Date de naissance", value: "1990-05-12" },
      { label: "Numéro de grimpeur", value: 1 },
      { label: "Numéro de licence", value: 12345678 },
      { label: "Téléphone", value: 612345678 },
      { label: "Email", value: "alice.dupont@example.com" },
      { label: "Adresse", value: "12 Rue de la Montagne" },
      { label: "Code postal", value: 38000 },
      { label: "Ville", value: "Grenoble" },
      { label: "Type d'abonnement", value: "—" },
      { label: "Type de ticket", value: "—" },
      { label: "Fin d'abonnement", value: "2025-10-30" },
      { label: "Fin de cotisation", value: "2025-10-30" },
      { label: "Nombre de séances restantes", value: 10 },
      { label: "Solde", value: "50 €" },
      { label: "Date d'inscription", value: "2025-04-30" },
      { label: "Accord règlement", value: "Oui" },
    ];
  }
  // Code normal si USE_MOCK = false
  try {
    const response = await fetch(`${API_URL}/grimpeurs/${id}`);
    if (!response.ok) {
      console.log(`Erreur HTTP: ${response.status}`);
      return false;
    }
    const grimpeur = await response.json();
    return [
      { label: "Nom", value: grimpeur.NomGrimpeur },
      { label: "Prénom", value: grimpeur.PrenomGrimpeur },
      { label: "Date de naissance", value: grimpeur.DateNaissGrimpeur },
      { label: "Numéro de grimpeur", value: grimpeur.NumGrimpeur },
      { label: "Numéro de licence", value: grimpeur.NumLicenceGrimpeur },
      { label: "Téléphone", value: grimpeur.TelGrimpeur },
      { label: "Email", value: grimpeur.EmailGrimpeur },
      { label: "Adresse", value: grimpeur.AdresseGrimpeur },
      { label: "Code postal", value: grimpeur.CodePostGrimpeur },
      { label: "Ville", value: grimpeur.VilleGrimpeur },
      { label: "Type d'abonnement", value: grimpeur.TypeAbo ?? "—" },
      { label: "Type de ticket", value: grimpeur.TypeTicket ?? "—" },
      { label: "Fin d'abonnement", value: grimpeur.DateFinAbo },
      { label: "Fin de cotisation", value: grimpeur.DateFinCoti },
      { label: "Nombre de séances restantes", value: grimpeur.NbSeanceRest },
      { label: "Solde", value: grimpeur.Solde + " €" },
      { label: "Date d'inscription", value: grimpeur.DateInscrGrimpeur },
      { label: "Accord règlement", value: grimpeur.AccordReglement ? "Oui" : "Non" },
    ];
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
