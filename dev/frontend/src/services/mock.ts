import { Client } from "../types&fields/types";
import { getTodayPlusOneYear, isDateValid, haveDateJSON } from "./api";

export const mockService = {

//----------------------------------- Fetchers -----------------------------------
    fetchClientById: async (id: number) : Promise<Client | null> => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        const one = {
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
        "NbSeanceRest": 10,
        "AdresseGrimpeur": "12 Rue de la Montagne",
        "DateInscrGrimpeur": "2025-04-30",
        "VilleGrimpeur": "Grenoble",
        "DateFinAbo": "2025-10-30",
        "DateFinCoti": "2025-10-30",
        "TypeAbo": null,
        "AccesMur": 1,
        } as Client;
        const two = {
            "CodePostGrimpeur": 75015,
            "NumGrimpeur": 2,
            "NumLicenceGrimpeur": 87654321,
            "EmailGrimpeur": "benjamin.martin@example.com",
            "PrenomGrimpeur": "Benjamin",
            "TelGrimpeur": 698765432,
            "AccordReglement": true,
            "NomGrimpeur": "Martin",
            "TypeTicket": null,
            "Solde": 75,
            "DateNaissGrimpeur": "1985-11-20",
            "NbSeanceRest": 5,
            "AdresseGrimpeur": "45 Avenue des Champs",
            "DateInscrGrimpeur": "2025-05-05",
            "VilleGrimpeur": "Paris",
            "DateFinAbo": "2025-11-05",
            "DateFinCoti": "2025-11-05",
            "TypeAbo": null,
            "AccesMur": 2,
        } as Client;
        const three = {
            "CodePostGrimpeur": 69007,
            "NumGrimpeur": 3,
            "NumLicenceGrimpeur": 34567890,
            "EmailGrimpeur": "charlotte.lefevre@example.com",
            "PrenomGrimpeur": "Charlotte",
            "TelGrimpeur": 677889900,
            "AccordReglement": false,
            "NomGrimpeur": "Lefevre",
            "TypeTicket": "Entrée",
            "Solde": 32,
            "DateNaissGrimpeur": "1995-08-15",
            "NbSeanceRest": 3,
            "AdresseGrimpeur": "7 Rue des Fleurs",
            "DateInscrGrimpeur": "2025-06-12",
            "VilleGrimpeur": "Lyon",
            "DateFinAbo": "2025-12-12",
            "DateFinCoti": "2025-12-12",
            "TypeAbo": "Mensuel",
            "AccesMur": 3,
        } as Client;
        
        switch(id) {
            case 1: return one;
            case 2: return two;
            case 3: return three;
            default: return one;
        };
    },

    fetchClientSearch: async (query: string) => {
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
        },
        {
          CodePostGrimpeur: 38000,
          NumGrimpeur: 3,
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
          NumGrimpeur: 4,
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
    ];
    },

    fetchAbonnements: async () => {
        return [
            {
                "DureeAbo": 30,
                "TypeAbo": "Mensuel",
                "IdAbo": 1,
                "PrixAbo": 45.5
            },
            {
                "DureeAbo": 90,
                "TypeAbo": "Trimestriel",
                "IdAbo": 2,
                "PrixAbo": 130.0
            },
            {
                "DureeAbo": 365,
                "TypeAbo": "Annuel",
                "IdAbo": 3,
                "PrixAbo": 390.0
            }
        ];
    },

    fetchTickets: async () => {
        return [
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
        ];
    },

    fetchProduits: async () => {
        return [
            {
                "IdReduc": null,
                "IdProduitParent": 1,
                "PrixProduit": 2.0,
                "Visibilite": true,
                "NomProduit": "Chausson d'escalade",
                "IdProduit": 2
            },
            {
                "IdReduc": null,
                "IdProduitParent": 1,
                "PrixProduit": 2.0,
                "Visibilite": true,
                "NomProduit": "Baudrier + Descendeur",
                "IdProduit": 3
            },
        ];
    },

    fetchRacineProduits: async () => {
        return [
    {
        "IdReduc": null,
        "Visibilite": true,
        "PrixProduit": null,
        "NomProduit": "\u00c9quipement d'escalade",
        "IdProduitParent": null,
        "IdProduit": 1
    },
    {
        "IdReduc": null,
        "Visibilite": true,
        "PrixProduit": null,
        "NomProduit": "Boisson",
        "IdProduitParent": null,
        "IdProduit": 6
    },
    {
        "IdReduc": null,
        "Visibilite": true,
        "PrixProduit": null,
        "NomProduit": "Friandises",
        "IdProduitParent": null,
        "IdProduit": 19
    }
]
    },

    fetchSousProduits: async (idParent: number) => {
        return [
    {
        "IdReduc": null,
        "Visibilite": true,
        "PrixProduit": 2.0,
        "NomProduit": "Chausson d'escalade",
        "IdProduitParent": 1,
        "IdProduit": 2
    },
    {
        "IdReduc": null,
        "Visibilite": true,
        "PrixProduit": 2.0,
        "NomProduit": "Baudrier + Descendeur",
        "IdProduitParent": 1,
        "IdProduit": 3
    },
    {
        "IdReduc": null,
        "Visibilite": true,
        "PrixProduit": 10.9,
        "NomProduit": "Magn\u00e9sie liquide 150ml",
        "IdProduitParent": 1,
        "IdProduit": 4
    },
    {
        "IdReduc": null,
        "Visibilite": true,
        "PrixProduit": 15.9,
        "NomProduit": "Magn\u00e9sie liquide 250ml",
        "IdProduitParent": 1,
        "IdProduit": 5
    }
]
    },

//----------------------------------- Posters -----------------------------------
    postSeanceClient: async (id: number) => {
        const date = haveDateJSON();
        const body = {
            NumGrimpeur: id,
            DateSeance: date.date,
            HeureSeance: date.hour,
        };
        console.log("Mock POST Seance Client:", body);
    },

    postAbonnement: async (abonnementData: {
        TypeAbo: string;
        DureeAbo: number;
        PrixAbo: number;
    }) => {
        console.log("Mock POST Abonnement:", JSON.stringify(abonnementData));
    },

    postTicket: async (ticketData: {
        TypeTicket: string;
        NbSeanceTicket: number;
        PrixTicket: number;
    }) => {
        console.log("Mock POST Ticket:", JSON.stringify(ticketData));
    },

    postProduit: async (produitData: {
        IdProduitParent: number | null;
        NomProduit: string;
        IdReduc: number | null;
        PrixProduit: number | null;
    }) => {
        console.log("Mock POST Produit:", JSON.stringify(produitData));
    },

//----------------------------------- Putters -----------------------------------
    updateAbonnement: async (idAbonnement: number, abonnementData: {
        TypeAbo: string;
        DureeAbo: number;
        PrixAbo: number;
    }) => {
        console.log(`Mock PUT Abonnement ${idAbonnement}:`, JSON.stringify(abonnementData));
    },

    updateTicket: async (idTicket: number, ticketData: {
        TypeTicket: string;
        NbSeanceTicket: number;
        PrixTicket: number;
    }) => {
        console.log(`Mock PUT Ticket ${idTicket}:`, JSON.stringify(ticketData));
    },

    updateProduit: async (idProduit: number, produitData: {
        NomProduit: string;
        PrixProduit?: number;
    }) => {
        console.log(`Mock PUT Produit ${idProduit}:`, JSON.stringify(produitData));
    },

    updateCotisationClient: async (client: Client) =>{
        const newClient = client;
        newClient.DateFinCoti = isDateValid(newClient.DateFinCoti) ? null : getTodayPlusOneYear();
        console.log(`Mock Update client cotisation ${client.NumGrimpeur}:`, JSON.stringify(newClient));
    },

//----------------------------------- Deleters -----------------------------------
    deleteAbonnement: async (idAbonnement: number) => {
        console.log(`Mock DELETE Abonnement ${idAbonnement}`);
    },

    deleteTicket: async (idTicket: number) => {
        console.log(`Mock DELETE Ticket ${idTicket}`);
    },

    deleteProduit: async (idProduit: number) => {
        console.log(`Mock DELETE Produit ${idProduit}`);
    },
//----------------------------------- Others -----------------------------------
    isAlreadyEntered: async (id: number) => {
        return true;
    }

}
