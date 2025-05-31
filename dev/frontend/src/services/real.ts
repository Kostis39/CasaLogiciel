import { haveDateJSON } from "./api";

const API_URL = "http://localhost:5000";

export const realService = {

//----------------------------------- Fetchers -----------------------------------
    fetchGrimpeurById: async (id: number) => {
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
    },

    fetchGrimpeurSearch: async (query: string) => {
        try {
            const response = await fetch(`${API_URL}/grimpeurs//search?query=${query}`);
            if (!response.ok) {
                console.log(`Erreur HTTP: ${response.status}`);
                return [];
            }
            const data = await response.json();
            if (Array.isArray(data) && data.length > 0) {
                return data;
            } else {
                console.log('Aucune donnée trouvée.');
                return [];
            }
        } catch (error) {
            console.error('Échec de la récupération du grimpeur:', error);
            throw error;
        }
    },

    fetchAbonnements: async () => {
        try {
            const response = await fetch(`${API_URL}/abonnements`);
            if (!response.ok) {
                console.log(`Erreur HTTP: ${response.status}`);
                return [];
            }
            const abonnements = await response.json();
            return abonnements;
        } catch (error) {
            console.error('Échec de la récupération des abonnements:', error);
            throw error;
        }
    },

    fetchTickets: async () => {
        try {
            const response = await fetch(`${API_URL}/tickets`);
            if (!response.ok) {
                console.log(`Erreur HTTP: ${response.status}`);
                return [];
            }
            const tickets = await response.json();
            return tickets;
        }catch (error) {
            console.error('Échec de la récupération des tickets:', error);
            throw error;
        }
    },
    
    fetchProduits: async () => {
        try {
            const response = await fetch(`${API_URL}/tickets`);
            if (!response.ok) {
                console.log(`Erreur HTTP: ${response.status}`);
                return [];
            }
            const produits = await response.json();
            return produits;
        } catch (error) {
            console.error('Échec de la récupération des produits:', error);
            throw error;
        }
    },

//----------------------------------- Posters -----------------------------------
    postSeanceClient: async (id: number) => {
        try {
            const date = haveDateJSON();
            const body = {
                NumGrimpeur: id,
                DateSeance: date.date,
                HeureSeance: date.hour,
            };
            const res = await fetch(`${API_URL}/seances`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                body),
            });
            if (res.ok) {
                return res;
            }
        } catch (error) {
            console.error('Echec post seance d"un grimpeur', error);
        }
    },

//----------------------------------- Others -----------------------------------
    isAlreadyEntered: async (id: number) => {
        try {
            const response = await fetch(`${API_URL}/grimpeurs/seances/${id}`);
            if (!response.ok) {
                return false;
            }
            const data = await response.json();
            return data.est_la === true;
        } catch (error) {
            console.error('Échec de la vérification d"entré d"un grimpeur', error);
            return false;
        }
    },

};


