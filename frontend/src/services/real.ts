import { getTodayPlusOneYear, isDateValid } from "./api";
import { Client, ApiResponse, TransactionForm, ClientForm, Transaction, ClubForm, Abonnement, Ticket, Club, responsePostClientSignature } from "../types&fields/types";
export const API_URL = process.env.NEXT_PUBLIC_API_URL? process.env.NEXT_PUBLIC_API_URL : "http://localhost:5000";

export const realService = {
    // Récupère un ticket par son id
    fetchTicketById: async (id: number): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/ticket/${id}`);
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }
            const data = await response.json();

            return { success: true, message: "Ticket récupéré", data };
        } catch (error) {
            console.error("Erreur fetch clientById:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
        }
    },

    // Récupère un abonnement par son id
    fetchAbonnementById: async (id: number): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/abonnement/${id}`);
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }
            const data = await response.json();
            return { success: true, message: "Abonnement récupéré", data };
        } catch (error) {
            console.error("Erreur fecth abonnementById:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
        }
    },

//----------------------------------- Fetchers -----------------------------------
    fetchClientById: async (id: number) : Promise<ApiResponse<Client>> => {
        try {
            const response = await fetch(`${API_URL}/grimpeurs/${id}`);
            if (!response.ok) {
                console.error(`Erreur HTTP: ${response.status}`);
                return { success: false, message: `Erreur HTTP: ${response.status}` };
            }
            const json = await response.json();
            return { success: true, message: "Grimpeur récupéré", data: json };
        } catch (error) {
            console.error("Erreur fecth clientById:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
        }
    },

    fetchClientSearch: async (query: string, limit: number, offset: number): Promise<ApiResponse<Client[]>> => {
        try {
            const params = new URLSearchParams({
                query,
                limit: limit.toString(),
                offset: offset.toString(),
            });

            const response = await fetch(`${API_URL}/grimpeurs/search?${params.toString()}`);            
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`, data: []};
            }
            
            const json = await response.json();
            const data = Array.isArray(json.data) ? json.data : [];
            return { success: true, message: "Grimpeurs récupérés", data, total: json.total || 0 };
        } catch (error) {
            console.error('Échec de la récupération du grimpeur:', error);
            if (error instanceof TypeError) {
                return { success: false, message: `Impossible de contacter le serveur ${API_URL}`, data: [] };
            }
            if (error instanceof SyntaxError) {
                return { success: false, message: "Réponse du serveur invalide", data: [] };
            }
            return { success: false, message: "Erreur inconnue", data: [] };
        }
    },

    fetchClients: async (limit: number, offset: number): Promise<ApiResponse<Client[]>> => {
        try {
            const response = await fetch(`${API_URL}/grimpeurs?limit=${limit}&offset=${offset}`, {
                cache: "no-store",
            });

            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }

            const json = await response.json();
            const data = Array.isArray(json.data) ? json.data : [];

            return { success: true, message: "Grimpeurs récupérés", data, total: json.total || 0 };
        } catch (error) {
            console.error("Erreur fetch grimpeurs:", error);
            if (error instanceof TypeError) {
                return { success: false, message: `Impossible de contacter le serveur ${API_URL}`, data: [] };
            }
            if (error instanceof SyntaxError) {
                return { success: false, message: "Réponse du serveur invalide", data: [] };
            }
            return { success: false, message: "Erreur inconnue", data: [] };
        }
    },

    fetchAbonnements: async (): Promise<ApiResponse<Abonnement[]>> => {
        try {
            const response = await fetch(`${API_URL}/abonnements`);
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }
            const json = await response.json();
            const data = Array.isArray(json?.data) ? json.data : [];
            //const total = typeof json?.total === "number" ? json.total : 0;

            return { success: true, message: "Abonnements récupérés", data };
            
        } catch (error) {
            console.error("Erreur fetch abonnement:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
        }
    },

    fetchTickets: async (): Promise<ApiResponse<Ticket[]>> => {
        try {
            const response = await fetch(`${API_URL}/tickets`);
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }
            const json = await response.json();
            const data = Array.isArray(json?.data) ? json.data : [];
            //const total = typeof json?.total === "number" ? json.total : 0;
            return { success: true, message: "Tickets récupérés", data };

        } catch (error) {
            console.error("Erreur fetch ticket:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
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
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }
            const data = await response.json().catch(() => ({}));

            return {success: true, message: data.message || "Séance créée"};
        } catch (error) {
            console.error("Erreur post client:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
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
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }
            const data = await response.json().catch(() => ({}));

            return { success: true, message: "Abonnement créé", data };
        } catch (error) {
            console.error("Erreur post abonnement:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
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
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }
            const data = await response.json().catch(() => ({}));

            return { success: true, message: "Ticket créé", data };
        } catch (error) {
            console.error("Erreur post ticket:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
        }
    },

    postClientData: async (data: ClientForm): Promise<ApiResponse<Client>> => {
        try {
            // Copie des données sans TypeAbo ni TypeTicket
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { TypeAbo, TypeTicket, ...filteredData } = data;

            const response = await fetch(`${API_URL}/grimpeurs`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(filteredData),
            });
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }

            const json = await response.json().catch(() => ({}));

            return {
                success: true,
                message: json.message || "Client ajouté avec succès",
                data: json.grimpeur,
            };
        } catch (error) {
            console.error("Erreur post clientData:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
        }
    },


    postTransaction: async (data: TransactionForm): Promise<ApiResponse> => {
        try {
            const now = new Date();
            const date = now.toISOString().split("T")[0];
            const heure = now.toTimeString().split(" ")[0];

            let note = data.Note? data.Note : "";

            if (data.TypeObjet === "abonnement" && data.DureeAbo) {
                const today = new Date();
                const baseFin = new Date(today);
                baseFin.setDate(today.getDate() + data.DureeAbo);

                const userDateFin = data.DateFinAbo ? new Date(data.DateFinAbo) : baseFin;
                const diffDays = Math.ceil(
                (userDateFin.getTime() - baseFin.getTime()) / (1000 * 60 * 60 * 24)
                );

                if (diffDays > 0) {
                note += `Abonnement : ${data.TypeAbo} — +${diffDays} jours ajoutés (${data.DureeAbo + diffDays}j au lieu de ${data.DureeAbo}j)`;
                } else if (diffDays < 0) {
                note += `Abonnement : ${data.TypeAbo} — ${diffDays} jours retirés (${data.DureeAbo + diffDays}j au lieu de ${data.DureeAbo}j)`;
                }
            }

            if (!note && data.TypeObjet === "ticket" && data.NbSeanceTicket) {
                const diff = (data.NbSeanceRest ?? data.NbSeanceTicket) - data.NbSeanceTicket;

                if (diff > 0) {
                note += `Ticket : ${data.TypeTicket} — +${diff} séances ajoutées (${data.NbSeanceTicket + diff} au lieu de ${data.NbSeanceTicket})`;
                } else if (diff < 0) {
                note += `Ticket : ${data.TypeTicket} — ${diff} séances retirées (${data.NbSeanceTicket + diff} au lieu de ${data.NbSeanceTicket})`;
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
                if (!response.ok) {
                    console.error(`HTTP ${response.status}:`);
                    return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
                }
            const json = await response.json().catch(() => ({}));

            return { success: true, message: "Transaction enregistrée", data: json };
        } catch (error) {
            console.error("Erreur post transaction:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
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
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }
            const data = await response.json().catch(() => ({}));

            return { success: true, message: "Abonnement mis à jour", data };
        } catch (error) {
            console.error("Erreur update abonnement", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
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
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }
            const data = await response.json().catch(() => ({}));

            return { success: true, message: "Ticket mis à jour", data };
        } catch (error) {
            console.error("Erreur update:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
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
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }

            const data = await response.json().catch(() => ({}));

            return { success: true, message: "Cotisation mise à jour", data };
        } catch (error) {
            console.error("Erreur update cotisation client:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
        }
    },

    updateGrimpeurSignature: async (
        id: number,
        signatureBase64: string,
        accordParental?: boolean
    ): Promise<ApiResponse<responsePostClientSignature>> => {
        try {
            const params: Record<string, string> = {};
            if (accordParental !== undefined) params["AccordParental"] = String(accordParental);
                console.log("API_URL actuelle:", signatureBase64);
            const response = await fetch(`${API_URL}/grimpeurs/accord/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ CheminSignature: signatureBase64, ...params }),
            });
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }

            const json = await response.json().catch(() => ({}));

            if (!response.ok) {
                return { success: false, message: json.message || `Erreur HTTP: ${response.status}` };
            }

            return { success: true, message: json.message || "Signature enregistrée", data: json };
        } catch (error) {
            console.error("Erreur update signature grimpeur:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
        }
    },

    updateClientData: async (client: Client): Promise<ApiResponse<Client>> => {
        try {
            const response = await fetch(`${API_URL}/grimpeurs/${client.NumGrimpeur}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(client),
            });
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }
            const json = await response.json().catch(() => ({}));

            return { success: true, message: json.message || "Client mis à jour", data: json.grimpeur };
        } catch (error) {
            console.error("Erreur update client data:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
        }
    },

    updateTransaction: async (transaction: Transaction): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/transactions`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(transaction),
            });
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }
            const json = await response.json().catch(() => ({}));

            return {
                success: true,
                message: json.message || "Transaction mise à jour",
                data: json, // ou json.transaction si ton API renvoie { transaction: {...} }
            };
        } catch (error) {
            console.error("Erreur update transaction:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
        }
    },


//----------------------------------- Deleters -----------------------------------
    deleteAbonnement: async (idAbonnement: number): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/abonnement/${idAbonnement}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }

            const data = await response.json().catch(() => ({}));

            return { success: true, message: "Abonnement supprimé", data };
        } catch (error) {
            console.error("Erreur delete abonement:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
        }
    },

    deleteTicket: async (idTicket: number): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/ticket/${idTicket}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }
            const data = await response.json().catch(() => ({}));

            return { success: true, message: "Ticket supprimé", data };
        } catch (error) {
            console.error("Erreur delete ticket:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
        }
    },

    deleteSeance: async (NumGrimpeur: number): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/seances/grimpeur/${NumGrimpeur}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }
            const data = await response.json().catch(() => ({}));

            return { success: true, message: data.message || "Séance supprimée avec succès" };
        } catch (error) {
            console.error("Erreur delete seance:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
        }
    },

//----------------------------------- Others -----------------------------------
    isAlreadyEntered: async (id: number) : Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/seances/grimpeur/${id}/aujourdhui`);
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }
            const data = await response.json();
            return { success: true, message: "Vérification effectuée", data: data.est_la === true };

        } catch (error) {
            console.error("Erreur isAlreadyEntred:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
        }
    },

    // Fonctions pour les clubs
    fetchClubs: async (): Promise<ApiResponse<Club[]>> => {
        try {
            const response = await fetch(`${API_URL}/clubs`);
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }
            const json = await response.json();
            const data = Array.isArray(json.data) ? json.data : [];

            return { success: true, message: "Clubs récupérés", data };
        } catch (error) {
            console.error("Erreur fecth club:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
        }
    },

    postClub: async (clubData: ClubForm): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/clubs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clubData),
            });
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }
            const data = await response.json().catch(() => ({}));

            return { success: true, message: "Club créé", data };
        } catch (error) {
            console.error("Erreur post club:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
        }
    },

    updateClub: async (idClub: number, clubData: ClubForm): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/clubs/${idClub}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(clubData),
            });
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }
            const data = await response.json().catch(() => ({}));

            return { success: true, message: "Club mis à jour", data };
        } catch (error) {
            console.error("Erreur update club:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
        }
    },

    deleteClub: async (idClub: number): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/clubs/${idClub}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }
            const data = await response.json().catch(() => ({}));

            return { success: true, message: "Club supprimé", data };
        } catch (error) {
            console.error("Erreur delete club:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
        }
    },

    fetchClubById: async (clubId: number): Promise<ApiResponse> => {
        try {
            const response = await fetch(`${API_URL}/clubs/${clubId}`);
            if (!response.ok) {
                console.error(`HTTP ${response.status}:`);
                return {success: false, message: `Erreur serveur: ${response.status} ${response.statusText}`};
            }
            const data = await response.json();

            return { success: true, message: "Club du grimpeur récupéré", data };
        } catch (error) {
            console.error("Erreur fetch clubById:", error);
            if (error instanceof TypeError) {
                return {success: false, message: `Impossible de contacter le serveur ${API_URL}`};
            }
            if (error instanceof SyntaxError) {
                return {success: false, message: "Réponse du serveur invalide"};
            }
            return {success: false, message: "Erreur inconnue"};
        }
    },

};