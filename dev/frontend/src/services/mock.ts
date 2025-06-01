import { haveDateJSON } from "./api";

export const mockService = {

//----------------------------------- Fetchers -----------------------------------
    fetchGrimpeurById: async (id: number) => {
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
    },

    fetchGrimpeurSearch: async (query: string) => {
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

//----------------------------------- Others -----------------------------------
    isAlreadyEntered: async (id: number) => {
        return true;
    }

}
