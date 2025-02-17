# Dictionnaire de données

## Schéma de Dictionnaire de Données

| Libellé                                             | Code de rubrique     | Nature      | Type    | Calcul | Intégrité |
| --------------------------------------------------- | -------------------- | ----------- | ------- | ------ | --------- |
| Numéro unique identifiant un grimpeur               | NumGrimpeur          | élémentaire | entier  |        |           |
| Nom du grimpeur                                     | NomGrimpeur          | élémentaire | texte   |        |           |
| Prénom du grimpeur                                  | PrenomGrimpeur       | élémentaire | texte   |        |           |
| Genre du grimpeur                                   | genreGrimpeur        | élémentaire | énum    |        | M/F/Null  |
| Date de naissance du grimpeur                       | DateNaissgrimpeur    | élémentaire | date    |        |           |
| Nombre de séances à diposition du grimpeur          | NbSeanceRestGrimpeur | élémentaire | entier  |        |           |
| Adresse du grimpeur                                 | AdresseGrimpeur      | élémentaire | texte   |        |           |
| Code postal du grimpeur                             | CodePostalGrimpeur   | élémentaire | texte   |        |           |
| Ville du grimpeur                                   | VilleGrimpeur        | élémentaire | texte   |        |           |
| Numéro de téléphone du grimpeur                     | TelGrimpeur          | élémentaire | texte   |        |           |
| Adresse mail du grimpeur                            | EmailGrimpeur        | élémentaire | texte   |        |           |
| Accord règlement                                    | AccordReglement      | élémentaire | booléen |        |           |
| Date de création du compte                          | DateCompte           | élémentaire | date    |        |           |
| Signature du règlement                              | SignatureReglement   | élémentaire | texte   |        |           |
| Date de la fin de l'abonnement                      | DateFinAboGrimpeur   | élémentaire | date    |        |           |
| Numéro unique à un club                             | IdClub               | élémentaire | entier  |        |           |
| Nom du club                                         | NomClub              | élémentaire | texte   |        |           |
| Adresse du club                                     | AdresseClub          | élémentaire | texte   |        |           |
| Code postal du club                                 | CodePostClub         | élémentaire | texte   |        |           |
| Contact du club                                     | ContactClub          | élémentaire | texte   |        |           |
| Date de la séance                                   | DateSeance           | élémentaire | date    |        |           |
| Heure de la séance                                  | HeureSeance          | élémentaire | heure   |        |           |
| Type de l'entrée (Abo,Séance,club)                  | TypeEntrée           | élémentaire | texte   |        |           |
| Prix de la séance                                   | PrixSeance           | calculée    | réel    | ?      |           |
| Type de l'abonnement                                | TypeAbo              | élémentaire | texte   |        |           |
| Prix de l'abonnement                                | PrixAbo              | élémentaire | réel    |        |           |
| Date de début de l'abonnement en cours              | DateDebutAbo         | calculé     | date    | ?      |           |
| Durée de l'abonnement                               | DureeAbo             | élémentaire | entier  |        |           |
| identifiant de la réduction                         | IdReduction          | élémentaire | entier  |        |           |
| Type d'achat de la séance (carte ou unité)          | TypeAchatSeance      | élémentaire | texte   |        |           |
| Type de la réduction                                | TypeReduction        | élémentaire | texte   |        |           |
| Montant de la réduction                             | MontantReduction     | élémentaire | réel    |        |           |
| Nom exact de la consommation                        | NomConso             | élémentaire | texte   |        |           |
| TypeConsommation                                    | TypeConsommation     | élémentaire | énum    |        |           |
| Prix de la consommation                             | PrixConso            | élémentaire | réel    |        |           |
| Achat annexe (topo, location de matériel, magnésie) | NomAchatAnnexe       | élémentaire | énum    |        |           |
| Prix de l'achat annexe                              | PrixAchatAnnexe      | élémentaire | réel    |        |           |
| identifiant de la transaction                       | IdTransaction        | élémentaire | entier  |        |           |
| Type de la transaction                              | TypeTransaction      | élémentaire | énum    |        |           |
| Date de la transaction                              | DateTransaction      | élémentaire | date    |        |           |
| Montant de la transaction                           | MontantTransaction   | élémentaire | réel    |        |           |
| Mode de paiement                                    | ModePaiement         | élémentaire | texte   |        |           |
| Heure de la Transaction                             | HeureTransaction     | élémentaire | heure   |        |           |



