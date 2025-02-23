# Dictionnaire de données

## Schéma de Dictionnaire de Données

| Libellé                                             | Code de rubrique     |Nature| Type    |
| --------------------------------------------------- | -------------------- |------| ------- |
| Numéro unique identifiant un grimpeur               | NumGrimpeur          | élém | entier  |
| Nom du grimpeur                                     | NomGrimpeur          | élém | texte   |
| Prénom du grimpeur                                  | PrenomGrimpeur       | élém | texte   |
| Date de naissance du grimpeur                       | DateNaissgrimpeur    | élém | date    |
| Adresse mail du grimpeur                            | EmailGrimpeur        | élém | texte   |
| Numéro de téléphone du grimpeur                     | TelGrimpeur          | élém | texte   |
| Adresse du grimpeur                                 | AdresseGrimpeur      | élém | texte   |
| Ville du grimpeur                                   | VilleGrimpeur        | élém | texte   |
| Code postal du grimpeur                             | CodePostGrimpeur     | élém | texte   |
| Date de création du compte                          | DateInscr            | élém | date    |
| Nombre de séances à diposition du grimpeur          | NbSeanceRest         | élém | entier  |
| Accord règlement                                    | AccordReglement      | élém | booléen |
| Signature du règlement                              | SignatureReglement   | élém | texte   |
| Date de la fin de l'abonnement                      | DateFinAbo           | élém | date    |
| Date de fin de validité de la cotisation            | DateFinCoti          | élém | date    |
| NumLicence                                          | NumLicenceGrimpeur   | élém | entier  |

|                                                     |                      |      |         |
| --------------------------------------------------- | -------------------- |------| ------- |
| Identifiant de la séance                            | Id_Seance            | élém | entier  |
| Date de la séance                                   | DateSeance           | élém | date    |
| Heure de la séance                                  | HeureSeance          | élém | heure   |
| Type de l'entrée (Abo,Séance)                       | TypeEntree           | élém | texte   |

|                                                     |                      |      |         |
| --------------------------------------------------- | -------------------- |------| ------- |
| Type de l'abonnement                                | TypeAbo              | élém | texte   |
| Durée de l'abonnement                               | DureeAbo             | élém | entier  |

|                                                     |                      |      |         |
| --------------------------------------------------- | -------------------- |------| ------- |
| Type de ticket/seance (10 entrée/1 entrée)          | TypeTicket           | élém | texte   |
| Nombre de séance                                    | NbSeanceTicket       | élém | entier  |

|                                                     |                      |      |         |
| --------------------------------------------------- | -------------------- |------| ------- |
| Numéro unique à un club                             | IdClub               | élém | entier  |
| Nom du club                                         | NomClub              | élém | texte   |
| Adresse du club                                     | AdresseClub          | élém | texte   |
| Code postal du club                                 | CodePostClub         | élém | entier  |
| Ville de résidence du club                          | VilleClub            | élém | texte   |
| Téléphone du club                                   | TelClub              | élém | texte   |
| Adresse mail du club                                | EmailClub            | élém | texte   |

|                                                     |                      |      |         |
| --------------------------------------------------- | -------------------- |------| ------- |
| Nom de l'établissement (scolaire/particulier)       | NomEtabli            | élém  | texte  |
| Nom du référent                                     | NomRef               | élém  | texte  |

|                                                     |                      |      |         |
| --------------------------------------------------- | -------------------- |------| ------- |
| Identifiant du créneau                              | IdCreneau            | élém | entier  |
| Date du créneau                                     | DateCreneau          | élém | date    |
| Heure de debut de creneau                           | HeureDeb             | élém | heure   |
| Heure de fin de creneau                             | HeureFin             | élém | heure   |
| ??????                                              | TypeCreneau          |      |         |
| Le nombre de personne présent au créneau            | NbPersonne           | élém | entier  |

|                                                     |                      |      |         |
| --------------------------------------------------- | -------------------- |------| ------- |
| Identifiant du grimpeur en club                     | IdGrClub             | élém | entier  |
| Prénom du grimpeur en club                          | PrenomGrClub         | élém | texte   |
| Nom du grimpeur en club                             | NomGrClub            | élém | texte   |

|                                                     |                      |      |         |
| --------------------------------------------------- | -------------------- |------| ------- |
| Identifiant de la réduction                        | IdReduc               | élém | entier  |
| Nom de la réduction                                | NomReduc              | élém | texte   |
| Type du produit sur lequel est appliqué la réduc   | TypeReduc             | élém | texte   |
| Type de calcul a effectuer sur le prix actuel      | TypeCalcul            | élém | texte   |
| Montant du calcul a effectuer en fct de TypeCalcul | Calcul                | élém | réel    |

|                                                     |                      |      |         |
| --------------------------------------------------- | -------------------- |------| ------- |
| Identifiant de la transaction                      | IdTransac             | élém | entier  |
| Mode de paiement                                   | ModePaiement          | élém | texte   |
| Date de la transaction                             | DateTransac           | élém | date    |
| Heure de la Transaction                            | HeureTransac          | élém | heure   |
| Montant final de la transac aprés appli de réduc   | MontantFinalTransac   | élém | réel    |
| Note sur la transaction                            | NoteTransac           | élém | texte   |

|                                                     |                      |      |         |
| --------------------------------------------------- | -------------------- |------| ------- |
| Nom du produit                                     | NomProduit            | élém | texte   |
| Type de produit (abo/ticket/conso/...)             | TypeProduit           | élém | énum    |
| Prix du produit                                    | Prix                  | élém | réel    |