détails club :
NUMCLUB    Club    Adresse du club    Code postal    Ville    N° de Téléphone    Contact    LIEN INTERNET

détails sp :
CATSP    Libellé SP

grimpeur :
N° grimpeur    Nom du grimpeur    Prénom    Sexe    Date de naissance    Adresse    Ville    Code postal    Téléphone    Tarif    Type d'abonnement    Numéro de club    N° de licence    N° de carte    Date inscription    Date fin de carte    Notes    E-mail    TRONCHE    image

séance :
Date de la séance    Heure début    Heure fin    N° grimpeur

détails typab :
Type d'abonnement    Description Abonnement

Mettre aucun accents

NumGrimpeur
NomGrimpeur
PrenomGrimpeur
SexeGrimpeur (pas mis)
DateNaisGrimpeur
EmailGrimpeur
TelGrimpeur
AdrGrimpeur
VilleGrimpeur
CodePostGrimpeur
DateInscrGrimpeur
LicenGrimpeur
NbSeanceGrimpeur
DateFinAboGrimpeur  (pas mis pcq a voir avec la gestion des entrées)
SignaReglementGrimpeur (pour réglement) (a voir le type de l'attribut)
DateFinCotiGrimpeur

DateSeance  | Deux en un
HeureSeance |
TypeEntree (Abo / Séance)

TypeAbo (Trimestre / Année)
PrixAbo
DureeAbo

TypeAchatSeance (Unité / Carte de 10)
PrixAchatSeance
NbAchatSeance (1 / 10)   

IdReduc
NomReduc (-10 ans / réduit / licence / 2ème abonnement ...)
TypeReduc (carte de 10 / abonnement / séance / achat / all / nouveau) (nom de l'entité, nom de l'instance d'un entité, all)
TypeCalculReduc (nouveau prix / en fonction du prix / pourcentage du prix)
CalculReduc (284 / -5 / -10%)

NomProduit (chausson / baudrier + descendeur / magnésie / bière ...)
TypeProduit (équipement / nourriture / boisson / alcool / autre)
PrixProduit

IdTransac
TypeTransac (abonnement / séance / achat annexe / conso / autre) (on peut peut-être récupérer l'entité de ce que pointe IdTransac)
DateTransac     | Same
HeureTransac    |
PrixTransac
TypePaiement (CB / espèce / chèque)
Note (pour justifier une transac)

IdCreneau
DateCreneau
HeureDebCreneau
HeureFinCreneau
TypeCreneau (club / scolaire)
NbPersCreneau

IdGrimpeurClub
NomGrimpeurClub
PrenomGrimpeurClub

NomEtabli
NomRefEtabli

IdClub
NomClub
AdrClub
CodePostClub
VilleClub
TelClub
SiteWebClub
EmailClub

DateSeanceClub  | Deux en un
HeureSeanceClub |





NumGrimpeur -> NomGrimpeur
NumGrimpeur -> PrenomGrimpeur
NumGrimpeur -> SexeGrimpeur
NumGrimpeur -> DateNaisGrimpeur
NumGrimpeur -> AdrGrimpeur
NumGrimpeur -> EmailGrimpeur
NumGrimpeur -> VilleGrimpeur
NumGrimpeur -> CodePostGrimpeur
NumGrimpeur -> TelGrimpeur
NumGrimpeur -> DateInscrGrimpeur
NumGrimpeur -> LicenGrimpeur
NumGrimpeur -> NbSeanceGrimpeur
NumGrimpeur -> DateFinAbo
NumGrimpeur -> SignaGrimpeur
NumGrimpeur -> DateFinCotiGrimpeur

{NumGrimpeur, DateSeance, HeureSeance} -> TypeEntree (NumGrimpeur | inconnue : 0 / membre club : 1 ...)

TypeAbo -> PrixAbo
TypeAbo -> DureeAbo

TypeAchatSeance -> PrixAchatSeance
TypeAchatSeance -> NbAchatSeance

IdReduc -> NomReduc
IdReduc -> TypeReduc
IdReduc -> TypeCalculReduc
IdReduc -> CalculReduc

NomProduit -> TypeProduit
NomProduit -> PrixProduit

IdTransac -> TypeTransac
IdTransac -> DateTransac
IdTransac -> HeureTransac
IdTransac -> PrixTransac
IdTransac -> TypePaiement
IdTransac -> Note

IdCreneau -> DateCreneau
IdCreneau -> HeureDebCreneau
IdCreneau -> HeureFinCreneau
IdCreneau -> TypeCreneau (club / scolaire)
IdCreneau -> NbPersCreneau

IdGrimpeurClub -> NomGrimpeurClub
IdGrimpeurClub -> PrenomGrimpeurClub

IdClub -> NomClub
IdClub -> AdrClub
IdClub -> CodePostClub
IdClub -> VilleClub
IdClub -> TelClub
IdClub -> SiteWebClub
IdClub -> EmailClub

NomEtabli -> NomRefEtabli

IdGrimpeurClub -> IdClub
IdClub -> IdGrimpeurClub

IdTransac -> NumGrimpeur (Si inconnue : 0 / membre club : 1 ...)
IdTransac -> (TypeAbo, TypeAchatSeance, NomProduit) type enum / Si null alors mettre note
IdTransac -> IdReduc

IdCreneau -> NomEtabli
IdCreneau -> NomClub

{IdGrimpeurClub, DateSeanceClub, HeureSeanceClub} -> IdCreneau