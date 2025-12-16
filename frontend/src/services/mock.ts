import { Abonnement, ApiResponse, Client, ClientForm, Club, ClubForm, Ticket, Transaction, TransactionForm } from "../types&fields/types";
import { getTodayPlusOneYear, isDateValid, haveDateJSON } from "./api";

export const mockService = {

//----------------------------------- Fetchers -----------------------------------
    fetchTicketById: async (id: number): Promise<ApiResponse> => {
        return {
            success: true,
            message: "Mock ticket trouvé",
            data: {
                IdTicket: id,
                TypeTicket: "Entrée",
                NbSeanceTicket: 1,
                PrixTicket: 11.0
            }
        };
    },

    fetchAbonnementById: async (id: number): Promise<ApiResponse> => {
        return {
            success: true,
            message: "Mock abonnement trouvé",
            data: {
                IdAbo: id,
                TypeAbo: "Mensuel",
                DureeAbo: 30,
                PrixAbo: 45.5
            }
        };
    },

    fetchClientById: async (id: number): Promise<ApiResponse<Client>> => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        
        const clients: Record<number, Client> = {
            1: {
                CodePostGrimpeur: 38000,
                NumGrimpeur: 1,
                NumLicenceGrimpeur: "12345678",
                EmailGrimpeur: "alice.dupont@example.com",
                PrenomGrimpeur: "Alice",
                TelGrimpeur: "612345678",
                AccordReglement: true,
                NomGrimpeur: "Dupont",
                TypeTicket: null,
                Solde: 50,
                DateNaissGrimpeur: "1990-05-12",
                NbSeanceRest: 10,
                AdresseGrimpeur: "12 Rue de la Montagne",
                DateInscrGrimpeur: "2025-04-30",
                VilleGrimpeur: "Grenoble",
                DateFinAbo: "2025-10-30",
                DateFinCoti: "2025-10-30",
                TypeAbo: null,
                StatutVoie: 1,
            } as Client,
            2: {
                CodePostGrimpeur: 75015,
                NumGrimpeur: 2,
                NumLicenceGrimpeur: "87654321",
                EmailGrimpeur: "benjamin.martin@example.com",
                PrenomGrimpeur: "Benjamin",
                TelGrimpeur: "698765432",
                AccordReglement: true,
                NomGrimpeur: "Martin",
                TypeTicket: null,
                Solde: 75,
                DateNaissGrimpeur: "1985-11-20",
                NbSeanceRest: 5,
                AdresseGrimpeur: "45 Avenue des Champs",
                DateInscrGrimpeur: "2025-05-05",
                VilleGrimpeur: "Paris",
                DateFinAbo: "2025-11-05",
                DateFinCoti: "2025-11-05",
                TypeAbo: null,
                StatutVoie: 2,
            } as Client,
            3: {
                CodePostGrimpeur: 69007,
                NumGrimpeur: 3,
                NumLicenceGrimpeur: "34567890",
                EmailGrimpeur: "charlotte.lefevre@example.com",
                PrenomGrimpeur: "Charlotte",
                TelGrimpeur: "677889900",
                AccordReglement: false,
                NomGrimpeur: "Lefevre",
                TypeTicket: "Entrée",
                Solde: 32,
                DateNaissGrimpeur: "1995-08-15",
                NbSeanceRest: 3,
                AdresseGrimpeur: "7 Rue des Fleurs",
                DateInscrGrimpeur: "2025-06-12",
                VilleGrimpeur: "Lyon",
                DateFinAbo: "2025-12-12",
                DateFinCoti: "2025-12-12",
                TypeAbo: "Mensuel",
                StatutVoie: 3,
            } as Client,
        };

        const client = clients[id];
        
        if (client) {
            return {
                success: true,
                message: "Mock client trouvé",
                data: client
            };
        }

        return {
            success: false,
            message: "Client non trouvé",
            data: null as unknown as Client
        };
    },

    fetchClientSearch: async (query: string, limit = 20, offset = 0) => {
    // Simule un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Création d'une "base de données" fictive
    const allClients = Array.from({ length: 50 }, (_, i) => ({
        NumGrimpeur: i + 1,
        NumLicenceGrimpeur: 12345678 + i,
        EmailGrimpeur: `client${i + 1}@example.com`,
        PrenomGrimpeur: `Prénom${i + 1}`,
        TelGrimpeur: 600000000 + i,
        AccordReglement: true,
        NomGrimpeur: `Nom${i + 1}`,
        TypeTicket: null,
        Solde: 50 + i,
        DateNaissGrimpeur: "1990-01-01",
        SignaReglement: `S${i + 1}`,
        NbSeanceRest: 10,
        DateInscrGrimpeur: "2025-01-01",
        DateFinAbo: "2025-12-31",
        DateFinCoti: "2025-12-31",
        TypeAbo: null,
        DateFincCotisation: "2026-12-31",
    }));

    // Filtrage par query sur le prénom ou le nom
    const filtered = allClients.filter(
        (c) =>
        c.PrenomGrimpeur.toLowerCase().includes(query.toLowerCase()) ||
        c.NomGrimpeur.toLowerCase().includes(query.toLowerCase())
    );

    // Pagination
    const paginated = filtered.slice(offset, offset + limit);

    return {
        data: paginated,
        total: filtered.length,
    };
    },


    fetchClients: async (limit: number, offset: number) => {
        await new Promise((resolve) => setTimeout(resolve, 150)); // simule délai
        const TOTAL = 100; // total fictif
        const generated: Client[] = [];

        for (let i = 1; i <= TOTAL; i++) {
        generated.push({
            NumGrimpeur: i,
            NumLicenceGrimpeur: `LIC${1000 + i}`,
            EmailGrimpeur: `user${i}@example.com`,
            PrenomGrimpeur: `Prenom${i}`,
            NomGrimpeur: `Nom${i}`,
            TelGrimpeur: `6000000${i}`,
            AccordReglement: true,
            TypeTicket: null,
            Solde: 50 + i,
            DateNaissGrimpeur: "1990-01-01",
            NbSeanceRest: i % 10,
            DateInscrGrimpeur: "2025-01-01",
            DateFinAbo: "2025-12-31",
            DateFinCoti: "2025-12-31",
            TypeAbo: null,
            StatutVoie: i % 5,
        });
        }

        const data = generated.slice(offset, offset + limit);

        return { data, total: TOTAL };
    },

    fetchAbonnements: async (): Promise<ApiResponse<Abonnement[]>> => {
        return { success: true, message: "MockAbo", data:[
            {
                "DureeAbo": 30,
                "TypeAbo": "Mensuel",
                "IdAbo": 1,
                "PrixAbo": 45.5
            }
        ]}
    },

    fetchTickets: async (): Promise<ApiResponse<Ticket[]>> => {
        return  { success: true, message: "MockTicket", data:[
            {
                "PrixTicket": 11.0,
                "IdTicket": 1,
                "NbSeanceTicket": 1,
                "TypeTicket": "Entr\u00e9e"
            },
            {
                "PrixTicket": 85.0,
                "IdTicket": 2,
                "NbSeanceTicket": 10,
                "TypeTicket": "Carte de 10"
            }
        ]}
    },

//----------------------------------- Posters -----------------------------------
    postSeanceClient: async (id: number) => {
        const date = haveDateJSON();
        const body = {
            NumGrimpeur: id,
            DateSeance: date.date,
            HeureSeance: date.hour,
        };
        return {success: true, message: `Mock: ${JSON.stringify(body)}`};
    },

    postAbonnement: async (abonnementData: {
        TypeAbo: string;
        DureeAbo: number;
        PrixAbo: number;
    }) => {
        return {success: true, message: `Mock: ${JSON.stringify(abonnementData)}`};
    },

    postTicket: async (ticketData: {
        TypeTicket: string;
        NbSeanceTicket: number;
        PrixTicket: number;
    }) => {
        return {success: true, message: `Mock: ${JSON.stringify(ticketData)}`};
    },

    postProduit: async (produitData: {
        IdProduitParent: number | null;
        NomProduit: string;
        IdReduc: number | null;
        PrixProduit: number | null;
    }) => {
        return {success: true, message: `Mock: ${JSON.stringify(produitData)}`};
    },

    postClientData: async (data: ClientForm): Promise<ApiResponse<Client>> => {
        console.log("MOCK postClientData:", data);
        return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
            success: true,
            message: "Client ajouté avec succès (mock)",
            data: {
            ...data,
            NumGrimpeur: Math.floor(Math.random() * 1000) + 1,
            TypeAbo: data.TypeAbo ?? null,
            TypeTicket: data.TypeTicket ?? null,
            DateFinAbo: data.DateFinAbo,
            DateFinCoti: data.DateFinCoti ?? null,
            NbSeanceRest: data.NbSeanceRest,
            Note: data.Note ?? null,
            ClubId: data.ClubId ?? null,
            TicketId: data.TicketId ?? null,
            AboId: data.AboId ?? null,
            CheminSignature: data.CheminSignature ?? undefined
            },
            });
        }, 200);
        });
    },

    postTransaction: async (data: TransactionForm) => {
        return {
            success: true,
            message: `Mock: Transaction créée avec les données ${JSON.stringify(data)}`,
            data: { ...data, IdTransaction: 12345, DateTransac: new Date().toISOString().split("T")[0] }
        };
    },


//----------------------------------- Putters -----------------------------------
    updateAbonnement: async (idAbonnement: number, abonnementData: {
        TypeAbo: string;
        DureeAbo: number;
        PrixAbo: number;
    }) => {
        return {success: true, message: `Mock: ${JSON.stringify(abonnementData)}`};
    },

    updateTicket: async (idTicket: number, ticketData: {
        TypeTicket: string;
        NbSeanceTicket: number;
        PrixTicket: number;
    }) => {
        return {success: true, message: `Mock: ${JSON.stringify(ticketData)}`};
    },

    updateProduit: async (idProduit: number, produitData: {
        NomProduit: string;
        PrixProduit?: number;
    }) => {
        return {success: true, message: `Mock: ${JSON.stringify(produitData)}`};
    },

    updateCotisationClient: async (client: Client) =>{
        const newClient = client;
        newClient.DateFinCoti = isDateValid(newClient.DateFinCoti) ? null : getTodayPlusOneYear();
        return {success: true, message: `Mock: ${JSON.stringify(newClient.DateFinCoti)}`};
    },

    updateGrimpeurSignature: async (
        id: number,
        signatureBase64: string,
        accordReglement?: boolean,
        accordParental?: boolean
    ) => {
        return {
            success: true,
            message: `Mock: Signature enregistrée pour le grimpeur ${id}`,
            data: { CheminSignature: signatureBase64, AccordReglement: accordReglement, AccordParental: accordParental }
        };
    },

    updateClientData: async (client: Client): Promise<ApiResponse> => {
        return {
            success: true,
            message: `Mock: Données du client mises à jour avec succès`,
            data: { ...client, NumGrimpeur: client.NumGrimpeur},
        };
    },

    updateTransaction: async (transaction: Transaction): Promise<ApiResponse> => {
        return {
            success: true,
            message: `Mock: Transaction mise à jour avec succès`,
            data: { ...transaction, id: transaction.IdTransac },
        };
    },


//----------------------------------- Deleters -----------------------------------
    deleteAbonnement: async (idAbonnement: number) => {
        return {success: true, message: `Mock: ${JSON.stringify(idAbonnement)}`};
    },

    deleteTicket: async (idTicket: number) => {
        return {success: true, message: `Mock: ${JSON.stringify(idTicket)}`};
    },

    deleteProduit: async (idProduit: number) => {
        return {success: true, message: `Mock: ${JSON.stringify(idProduit)}`};
    },

    deleteSeance: async (NumGrimpeur: number) => {
        return { success: true, message: `Mock: Seance supprimée pour le client ${NumGrimpeur}` };
    },

//----------------------------------- Others -----------------------------------
    isAlreadyEntered: async (id: number) => {
        if (!id){return { success: false, message: "ID invalide", data: false };}
        return { success: true, message: "Mock: Vérification effectuée", data: id % 2 === 0 };
    },
    //----------------------------------- Clubs -----------------------------------
    fetchClubs: async (): Promise<ApiResponse<Club[]>> => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const clubs = [
            {
                IdClub: 1,
                NomClub: "Club Alpin Grenoble",
                CodePostClub: "38000",
                VilleClub: "Grenoble",
                TelClub: "0476000000",
                EmailClub: "contact@clubalpingrenoble.fr",
                AdresseClub: "12 rue des Alpes",
                SiteInternet: "https://clubalpingrenoble.fr"
            },
            {
                IdClub: 2,
                NomClub: "Club Vertical Paris",
                CodePostClub: "75015",
                VilleClub: "Paris",
                TelClub: "0145000000",
                EmailClub: "info@verticalparis.fr",
                AdresseClub: "45 avenue des Grimpeurs",
                SiteInternet: "https://verticalparis.fr"
            }
        ];
        return { success: true, message: "Mock clubs", data: clubs };
    },

    postClub: async (clubData: ClubForm) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return {
            success: true,
            message: "Club créé (mock)",
            data: { ...clubData, IdClub: Math.floor(Math.random() * 1000) + 3 }
        };
    },

    updateClub: async (idClub: number, clubData: ClubForm) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return {
            success: true,
            message: `Club ${idClub} mis à jour (mock)`,
            data: { ...clubData, IdClub: idClub }
        };
    },

    deleteClub: async (idClub: number) => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        return {
            success: true,
            message: `Club ${idClub} supprimé (mock)`
        };
    },

    fetchClubById: async (clubId: number): Promise<ApiResponse> => {
        await new Promise((resolve) => setTimeout(resolve, 100));

        if (clubId === 1) {
            return {
                success: true,
                message: "Mock club trouvé",
                data: {
                    IdClub: 1,
                    NomClub: "Club Alpin Grenoble"
                }
            };
        }

        return { success: false, message: "Aucun club trouvé", data: null };
    },


}
