import { getTodayPlusOneYear, haveDateJSON, isDateValid } from "./api";
import { Client, ApiResponse, Transaction, ClientForm } from "../types&fields/types";
export const API_URL = "http://127.0.0.1:5000";

export const realService = {

//----------------------------------- Fetchers -----------------------------------
    fetchClientById: async (id: number) : Promise<Client | null> => {
        try {
            const response = await fetch(`${API_URL}/grimpeurs/${id}`);
            if (!response.ok) {
            console.error(`Erreur HTTP: ${response.status}`);
            return null;
            }
            return await response.json();
        } catch (error) {
            console.error("Échec de la récupération du grimpeur:", error);
            return null;
        }
    },

    fetchClientSearch: async (query: string) => {
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

    fetchAbonnements: async (): Promise<ApiResponse<any[]>> => {
        try {
            const response = await fetch(`${API_URL}/abonnements`);
            const data = await response.json().catch(() => ([]));

            if (!response.ok) {
                return { success: false, message: `Erreur HTTP: ${response.status}` };
            }

            return { success: true, message: "Abonnements récupérés", data };
        } catch {
            return { success: false, message: "Impossible de contacter le serveur" };
        }
    },

    fetchTickets: async (): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/tickets`);
            const data = await response.json().catch(() => ([]));

            if (!response.ok) {
                return { success: false, message: `Erreur HTTP: ${response.status}` };
            }

            return { success: true, message: "Tickets récupérés", data };
        } catch {
            return { success: false, message: "Impossible de contacter le serveur" };
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
    postSeanceClient: async (id: number): Promise<ApiResponse> => {
        try {
            const body = { NumGrimpeur: id };
            const response = await fetch(`${API_URL}/seances`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return {success: false, message: data.message || "Erreur inconnue"};
            }
            return {success: true, message: data.message || "Séance créée"};
        } catch {
            return {success: false, message: "Impossible de contacter le serveur"};
        }
    },

    postAbonnement: async (abonnementData: {
        TypeAbo: string;
        DureeAbo: number;
        PrixAbo: number;
    }): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/abonnements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(abonnementData),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return { success: false, message: data.message || `Erreur HTTP: ${response.status}` };
            }

            return { success: true, message: "Abonnement créé", data };
        } catch {
            return { success: false, message: "Impossible de contacter le serveur" };
        }
    },

    postTicket: async (ticketData: {
        TypeTicket: string;
        NbSeanceTicket: number;
        PrixTicket: number;
    }): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticketData),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return { success: false, message: data.message || `Erreur HTTP: ${response.status}` };
            }

            return { success: true, message: "Ticket créé", data };
        } catch {
            return { success: false, message: "Impossible de contacter le serveur" };
        }
    },

    postProduit: async (produitData: {
        IdProduitParent: number | null;
        NomProduit: string;
        IdReduc: number | null;
        PrixProduit: number | null;
    }): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/produits`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produitData),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return { success: false, message: data.message || `Erreur HTTP: ${response.status}` };
            }

            return { success: true, message: "Produit créé", data };
        } catch {
            return { success: false, message: "Impossible de contacter le serveur" };
        }
    },

    postClientData: async (data: ClientForm): Promise<ApiResponse> => {
        try {
        const response = await fetch(`${API_URL}/grimpeurs`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        const json = await response.json().catch(() => ({}));

        if (!response.ok) {
            return { success: false, message: json.message || `Erreur HTTP: ${response.status}` };
        }

        return { success: true, message: json.message || "Client ajouté avec succès", data: json.grimpeur };
        } catch (error: any) {
        return { success: false, message: error.message || "Erreur réseau inconnue" };
        }
    },

  postTransaction: async (data: Transaction): Promise<ApiResponse> => {
    try {
      const now = new Date();
      const date = now.toISOString().split("T")[0];
      const heure = now.toTimeString().split(" ")[0];

      let note = data.Note;

      if (!note && data.TypeObjet === "abonnement" && data.DureeAbo) {
        const today = new Date();
        const baseFin = new Date(today);
        baseFin.setDate(today.getDate() + data.DureeAbo);

        const userDateFin = data.DateFinAbo ? new Date(data.DateFinAbo) : baseFin;
        const diffDays = Math.ceil(
          (userDateFin.getTime() - baseFin.getTime()) / (1000 * 60 * 60 * 24)
        );

        if (diffDays > 0) {
          note = `Abonnement : ${data.TypeAbo} — +${diffDays} jours ajoutés (${data.DureeAbo + diffDays}j au lieu de ${data.DureeAbo}j)`;
        } else if (diffDays < 0) {
          note = `Abonnement : ${data.TypeAbo} — ${diffDays} jours retirés (${data.DureeAbo + diffDays}j au lieu de ${data.DureeAbo}j)`;
        }
      }

      if (!note && data.TypeObjet === "ticket" && data.NbSeanceTicket) {
        const diff = (data.NbSeanceRest ?? data.NbSeanceTicket) - data.NbSeanceTicket;

        if (diff > 0) {
          note = `Ticket : ${data.TypeTicket} — +${diff} séances ajoutées (${data.NbSeanceTicket + diff} au lieu de ${data.NbSeanceTicket})`;
        } else if (diff < 0) {
          note = `Ticket : ${data.TypeTicket} — ${diff} séances retirées (${data.NbSeanceTicket + diff} au lieu de ${data.NbSeanceTicket})`;
        }
      }

      const payload = {
        TypeObjet: data.TypeObjet,
        IdObjet: data.IdObjet,
        NumGrimpeur: data.NumGrimpeur,
        DateTransac: date,
        HeureTransac: heure,
        Note: note,
      };

      const response = await fetch(`${API_URL}/transactions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await response.json().catch(() => ({}));

      if (!response.ok) {
        return { success: false, message: json.message || `Erreur HTTP: ${response.status}` };
      }

      return { success: true, message: "Transaction enregistrée", data: json };
    } catch (error: any) {
      return { success: false, message: error.message || "Erreur réseau inconnue" };
    }
  },

//----------------------------------- Putters -----------------------------------
    updateAbonnement: async (idAbonnement: number, abonnementData: {
        TypeAbo: string;
        DureeAbo: number;
        PrixAbo: number;
    }): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/abonnement/${idAbonnement}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(abonnementData),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return { success: false, message: data.message || `Erreur HTTP: ${response.status}` };
            }

            return { success: true, message: "Abonnement mis à jour", data };
        } catch {
            return { success: false, message: "Impossible de contacter le serveur" };
        }
    },

    updateTicket: async (idTicket: number, ticketData: {
        TypeTicket: string;
        NbSeanceTicket: number;
        PrixTicket: number;
    }): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/ticket/${idTicket}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ticketData),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return { success: false, message: data.message || `Erreur HTTP: ${response.status}` };
            }

            return { success: true, message: "Ticket mis à jour", data };
        } catch {
            return { success: false, message: "Impossible de contacter le serveur" };
        }
    },

    updateProduit: async (idProduit: number, produitData: {
        NomProduit: string;
        PrixProduit?: number;
    }): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/produit/${idProduit}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(produitData),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return { success: false, message: data.message || `Erreur HTTP: ${response.status}` };
            }

            return { success: true, message: "Produit mis à jour", data };
        } catch {
            return { success: false, message: "Impossible de contacter le serveur" };
        }
    },

    updateCotisationClient: async (client: Client): Promise<ApiResponse> => {
        try {
            const newClient = { ...client };
            if (isDateValid(newClient.DateFinCoti)) {
                newClient.DateFinCoti = null;
            } else {
                newClient.DateFinCoti = getTodayPlusOneYear();
            }

            const response = await fetch(`${API_URL}/grimpeurs/${client.NumGrimpeur}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newClient),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return { success: false, message: data.message || `Erreur HTTP: ${response.status}` };
            }

            return { success: true, message: "Cotisation mise à jour", data };
        } catch {
            return { success: false, message: "Impossible de contacter le serveur" };
        }
    },

    updateGrimpeurSignature: async (
        id: number,
        signatureBase64: string,
        accordReglement?: boolean,
        accordParental?: boolean
    ): Promise<ApiResponse> => {
        try {
        const params: Record<string, string> = {};
        if (accordReglement !== undefined) params["AccordReglement"] = String(accordReglement);
        if (accordParental !== undefined) params["AccordParental"] = String(accordParental);

        const response = await fetch(`${API_URL}/grimpeurs/accord/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ CheminSignature: signatureBase64, ...params }),
        });

        const json = await response.json().catch(() => ({}));

        if (!response.ok) {
            return { success: false, message: json.message || `Erreur HTTP: ${response.status}` };
        }

        return { success: true, message: json.message || "Signature enregistrée", data: json };
        } catch (error: any) {
            return { success: false, message: error.message || "Erreur réseau inconnue" };
        }
    },

//----------------------------------- Deleters -----------------------------------
    deleteAbonnement: async (idAbonnement: number): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/abonnement/${idAbonnement}`, {
                method: 'DELETE',
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return { success: false, message: data.message || `Erreur HTTP: ${response.status}` };
            }

            return { success: true, message: "Abonnement supprimé", data };
        } catch {
            return { success: false, message: "Impossible de contacter le serveur" };
        }
    },

    deleteTicket: async (idTicket: number): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/ticket/${idTicket}`, {
                method: 'DELETE',
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return { success: false, message: data.message || `Erreur HTTP: ${response.status}` };
            }

            return { success: true, message: "Ticket supprimé", data };
        } catch {
            return { success: false, message: "Impossible de contacter le serveur" };
        }
    },

    deleteProduit: async (idProduit: number): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/produit/${idProduit}`, {
                method: 'DELETE',
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return { success: false, message: data.message || `Erreur HTTP: ${response.status}` };
            }

            return { success: true, message: "Produit supprimé", data };
        } catch {
            return { success: false, message: "Impossible de contacter le serveur" };
        }
    },

    deleteSeance: async (NumGrimpeur: number): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/seances/${NumGrimpeur}`, {
                method: 'DELETE',
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return { success: false, message: data.message || `Erreur HTTP: ${response.status}` };
            }

            return { success: true, message: data.message || "Séance supprimée avec succès" };
        } catch {
            return { success: false, message: "Impossible de contacter le serveur" };
        }
    },

//----------------------------------- Others -----------------------------------
    isAlreadyEntered: async (id: number) => {
        try {
            const response = await fetch(`${API_URL}/seances/${id}`);
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