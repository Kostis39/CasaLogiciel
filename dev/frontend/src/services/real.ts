import { haveDateJSON } from "./api";

const API_URL = "http://127.0.0.1:5000";

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
            const response = await fetch(`${API_URL}/grimpeurs/search?query=${query}`);
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
            const response = await fetch(`${API_URL}/produits`);
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

    fetchRacineProduits: async () => {
        try {
            const response = await fetch(`${API_URL}/racineproduits`);
            if (!response.ok) {
                console.log(`Erreur HTTP: ${response.status}`);
                return [];
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Échec de la récupération des produits racines:', error);
            throw error;
        }
    },

    fetchSousProduits: async (idParent: number) => {
        try {
            const response = await fetch(`${API_URL}/sousproduits/${idParent}`);
            if (!response.ok) {
                console.log(`Erreur HTTP: ${response.status}`);
                return [];
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Échec de la récupération des sous-produits:', error);
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
                body: JSON.stringify(body),
            });
            if (res.ok) {
                return res;
            }
        } catch (error) {
            console.error('Echec post seance d"un grimpeur', error);
        }
    },

    postAbonnement: async (abonnementData: {
        TypeAbo: string;
        DureeAbo: number;
        PrixAbo: number;
    }) => {
        try {
            const response = await fetch(`${API_URL}/abonnements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(abonnementData),
            });
            if (!response.ok) {
                console.log(`Erreur HTTP: ${response.status}`);
                return null;
            }
            return response;
        } catch (error) {
            console.error('Échec de la création de l\'abonnement:', error);
            throw error;
        }
    },

    postTicket: async (ticketData: {
        TypeTicket: string;
        NbSeanceTicket: number;
        PrixTicket: number;
    }) => {
        try {
            const response = await fetch(`${API_URL}/tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticketData),
            });
            if (!response.ok) {
                console.log(`Erreur HTTP: ${response.status}`);
                return null;
            }
            return response;
        } catch (error) {
            console.error('Échec de la création du ticket:', error);
            throw error;
        }
    },

    postProduit: async (produitData: {
        IdProduitParent: number | null;
        NomProduit: string;
        IdReduc: number | null;
        PrixProduit: number | null;
    }) => {
        try {
            const response = await fetch(`${API_URL}/produits`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produitData),
            });
            if (!response.ok) {
                console.log(`Erreur HTTP: ${response.status}`);
                return null;
            }
            return response;
        } catch (error) {
            console.error('Échec de la création du produit:', error);
            throw error;
        }
    },

//----------------------------------- Putters -----------------------------------
    updateAbonnement: async (idAbonnement: number, abonnementData: {
        TypeAbo: string;
        DureeAbo: number;
        PrixAbo: number;
    }) => {
        try {
            const response = await fetch(`${API_URL}/abonnement/${idAbonnement}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(abonnementData),
            });
            if (!response.ok) {
                console.log(`Erreur HTTP: ${response.status}`);
                return null;
            }
            return response;
        } catch (error) {
            console.error('Échec de la mise à jour de l\'abonnement:', error);
            throw error;
        }
    },

    updateTicket: async (idTicket: number, ticketData: {
        TypeTicket: string;
        NbSeanceTicket: number;
        PrixTicket: number;
    }) => {
        try {
            const response = await fetch(`${API_URL}/ticket/${idTicket}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticketData),
            });
            if (!response.ok) {
                console.log(`Erreur HTTP: ${response.status}`);
                return null;
            }
            return response;
        } catch (error) {
            console.error('Échec de la mise à jour du ticket:', error);
            throw error;
        }
    },

    updateProduit: async (idProduit: number, produitData: {
        NomProduit: string;
        PrixProduit?: number;
    }) => {
        try {
            const response = await fetch(`${API_URL}/produit/${idProduit}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produitData),
            });
            if (!response.ok) {
                console.log(`Erreur HTTP: ${response.status}`);
                return null;
            }
            return response;
        } catch (error) {
            console.error('Échec de la mise à jour du produit:', error);
            throw error;
        }
    },

//----------------------------------- Deleters -----------------------------------
    deleteAbonnement: async (idAbonnement: number) => {
        try {
            const response = await fetch(`${API_URL}/abonnement/${idAbonnement}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                console.log(`Erreur HTTP: ${response.status}`);
                return null;
            }
            return response;
        } catch (error) {
            console.error('Échec de la suppression de l\'abonnement:', error);
            throw error;
        }
    },

    deleteTicket: async (idTicket: number) => {
        try {
            const response = await fetch(`${API_URL}/ticket/${idTicket}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                console.log(`Erreur HTTP: ${response.status}`);
                return null;
            }
            return response;
        } catch (error) {
            console.error('Échec de la suppression du ticket:', error);
            throw error;
        }
    },

    deleteProduit: async (idProduit: number) => {
        try {
            const response = await fetch(`${API_URL}/produit/${idProduit}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                console.log(`Erreur HTTP: ${response.status}`);
                return null;
            }
            return response;
        } catch (error) {
            console.error('Échec de la suppression du produit:', error);
            throw error;
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