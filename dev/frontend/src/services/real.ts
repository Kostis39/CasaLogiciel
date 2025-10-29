import { fetchClients, getTodayPlusOneYear, isDateValid } from "./api";
import { Client, ApiResponse, TransactionForm, ClientForm, Transaction, ClubForm } from "../types&fields/types";
export const API_URL = "http://127.0.0.1:5000";

export const realService = {
    // Récupère un ticket par son id
    fetchTicketById: async (id: number): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/ticket/${id}`);
            const data = await response.json();
            if (!response.ok) {
                return { success: false, message: data.message || `Erreur HTTP: ${response.status}` };
            }
            return { success: true, message: "Ticket récupéré", data };
        } catch {
            return { success: false, message: "Impossible de contacter le serveur" };
        }
    },

    // Récupère un abonnement par son id
    fetchAbonnementById: async (id: number): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/abonnement/${id}`);
            const data = await response.json();
            if (!response.ok) {
                return { success: false, message: data.message || `Erreur HTTP: ${response.status}` };
            }
            return { success: true, message: "Abonnement récupéré", data };
        } catch {
            return { success: false, message: "Impossible de contacter le serveur" };
        }
    },

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

    fetchClientSearch: async (query: string, limit: number, offset: number) => {
        try {
            const params = new URLSearchParams({
                query,
                limit: limit.toString(),
                offset: offset.toString(),
            });

            const response = await fetch(`${API_URL}/grimpeurs/search?${params.toString()}`);            
            if (!response.ok) {
                console.log(`Erreur HTTP: ${response.status}`);
                return { data: [], total: 0 };
            }
            const json = await response.json();
            const data = Array.isArray(json.data) ? json.data : [];
            const total = typeof json.total === "number" ? json.total : 0;
            return { data, total };
        } catch (error) {
            console.error('Échec de la récupération du grimpeur:', error);
            return { data: [], total: 0 };
        }
    },

    fetchClients: async (limit: number, offset: number) => {
        try {
        const res = await fetch(`${API_URL}/grimpeurs?limit=${limit}&offset=${offset}`, {
            cache: "no-store", // toujours fetch côté serveur
        });

        if (!res.ok) {
            throw new Error(`Erreur HTTP ${res.status}`);
        }

        const json = await res.json();
        const data = Array.isArray(json.data) ? json.data : [];
        const total = typeof json.total === "number" ? json.total : 0;

        return { data, total };
        } catch (err) {
        console.error("Erreur dans fetchGrimpeurs:", err);
        return { data: [], total: 0 };
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
            // Copie des données sans TypeAbo ni TypeTicket
            const { TypeAbo, TypeTicket, ...filteredData } = data;

            const response = await fetch(`${API_URL}/grimpeurs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filteredData),
            });

            const json = await response.json().catch(() => ({}));

            if (!response.ok) {
                return {
                    success: false,
                    message: json.message || `Erreur HTTP: ${response.status}`,
                };
            }

            return {
                success: true,
                message: json.message || "Client ajouté avec succès",
                data: json.grimpeur,
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || "Erreur réseau inconnue",
            };
        }
    },


  postTransaction: async (data: TransactionForm): Promise<ApiResponse> => {
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

    updateClientData: async (client: Client): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/grimpeurs/${client.NumGrimpeur}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(client),
            });

            const json = await response.json().catch(() => ({}));

            if (!response.ok) {
                return { success: false, message: json.message || `Erreur HTTP: ${response.status}` };
            }

            return { success: true, message: json.message || "Client mis à jour", data: json.grimpeur };
        } catch (error: any) {
            return { success: false, message: error.message || "Erreur réseau inconnue" };
        }
    },

    updateTransaction: async (transaction: Transaction): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/transactions`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transaction),
            });

            const json = await response.json().catch(() => ({}));

            if (!response.ok) {
                return {
                    success: false,
                    message: json.message || `Erreur HTTP: ${response.status}`,
                };
            }

            return {
                success: true,
                message: json.message || "Transaction mise à jour",
                data: json, // ou json.transaction si ton API renvoie { transaction: {...} }
            };
        } catch (error: any) {
            return {
                success: false,
                message: error.message || "Erreur réseau inconnue",
            };
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

    // Fonctions pour les clubs
    fetchClubs: async (): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/clubs`);
            const json = await response.json();
            const data = Array.isArray(json.data) ? json.data : [];

            if (!response.ok) {
                return { success: false, message: `Erreur HTTP: ${response.status}` };
            }

            return { success: true, message: "Clubs récupérés", data };
        } catch {
            return { success: false, message: "Impossible de contacter le serveur" };
        }
    },

    postClub: async (clubData: ClubForm): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/clubs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clubData),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return { success: false, message: data.message || `Erreur HTTP: ${response.status}` };
            }

            return { success: true, message: "Club créé", data };
        } catch {
            return { success: false, message: "Impossible de contacter le serveur" };
        }
    },

    updateClub: async (idClub: number, clubData: ClubForm): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/clubs/${idClub}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clubData),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return { success: false, message: data.message || `Erreur HTTP: ${response.status}` };
            }

            return { success: true, message: "Club mis à jour", data };
        } catch {
            return { success: false, message: "Impossible de contacter le serveur" };
        }
    },

    deleteClub: async (idClub: number): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/clubs/${idClub}`, {
                method: 'DELETE',
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                return { success: false, message: data.message || `Erreur HTTP: ${response.status}` };
            }

            return { success: true, message: "Club supprimé", data };
        } catch {
            return { success: false, message: "Impossible de contacter le serveur" };
        }
    },

    fetchClubById: async (clubId: number): Promise<ApiResponse> => {
    try {
        const response = await fetch(`${API_URL}/clubs/${clubId}`);
        const data = await response.json();
        if (!response.ok) {
            return { success: false, message: data.message || `Erreur HTTP: ${response.status}` };
        }
        return { success: true, message: "Club du grimpeur récupéré", data };
    } catch {
        return { success: false, message: "Impossible de contacter le serveur" };
    }
    },

};