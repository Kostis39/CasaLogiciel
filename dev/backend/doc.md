# Documentation des Endpoints API

- [Documentation des Endpoints API](#documentation-des-endpoints-api)
  - [Guide](#guide)
  - [Grimpeurs](#grimpeurs)
    - [Ressource `GrimpeursListe`](#ressource-grimpeursliste)
      - [`GET /grimpeurs`](#get-grimpeurs)
      - [`POST /grimpeurs`](#post-grimpeurs)
    - [Ressource `Grimpeur`](#ressource-grimpeur)
      - [`GET /grimpeurs/<int:id>`](#get-grimpeursintid)
      - [`POST /grimpeurs/<int:id>`](#post-grimpeursintid)
      - [`DELETE /grimpeurs/<int:id>`](#delete-grimpeursintid)
    - [Ressource `GrimpeursSearch`](#ressource-grimpeurssearch)
      - [`GET /grimpeurs/search`](#get-grimpeurssearch)
  - [Séances](#séances)
    - [Ressource `Seances`](#ressource-seances)
      - [`GET /seances`](#get-seances)
      - [`POST /seances`](#post-seances)
    - [Ressource `SeancesSearch`](#ressource-seancessearch)
      - [`GET /seances/<int:id>`](#get-seancesintid)
    - [Ressource `SeancesByDate`](#ressource-seancesbydate)
      - [`GET /seancesbydate`](#get-seancesbydate)
    - [Ressource `Produit`](#ressource-produit)
      - [`GET /produit/<int:id>`](#get-produitintid)
      - [`DELETE /produit/<int:id>`](#delete-produitintid)
      - [`PUT /produit/<int:id>`](#put-produitintid)
    - [Ressource `SousProduit`](#ressource-sousproduit)
      - [`GET /sousproduit/<int:idParent>`](#get-sousproduitintidparent)
    - [Ressource `RacineProduits`](#ressource-racineproduits)
      - [`GET /racineproduits`](#get-racineproduits)
    - [Ressource `Produits`](#ressource-produits)
      - [`GET /produits`](#get-produits)
      - [`POST /produits`](#post-produits)
  - [Tickets](#tickets)
    - [Ressource `Tickets`](#ressource-tickets)
      - [`GET /tickets`](#get-tickets)
      - [`POST /tickets`](#post-tickets)
    - [Ressource `Ticket`](#ressource-ticket)
      - [`GET /tickets/<int:id>`](#get-ticketsintid)
      - [`PUT /tickets/<int:id>`](#put-ticketsintid)
      - [`DELETE /tickets/<int:id>`](#delete-ticketsintid)
  - [Abonnements](#abonnements)
    - [Ressource `Abonnements`](#ressource-abonnements)
      - [`GET /abonnements`](#get-abonnements)
      - [`POST /abonnements`](#post-abonnements)
    - [Ressource `Abonnement`](#ressource-abonnement)
      - [`GET /abonnements/<int:id>`](#get-abonnementsintid)
      - [`PUT /abonnements/<int:id>`](#put-abonnementsintid)
      - [`DELETE /abonnements/<int:id>`](#delete-abonnementsintid)
  - [Transactions](#transactions)
    - [Ressource `Transactions`](#ressource-transactions)
      - [`GET /transactions`](#get-transactions)
      - [`POST /transactions`](#post-transactions)
    - [Ressource `TransactionByDate`](#ressource-transactionbydate)
      - [`GET /transactions?date=<date>`](#get-transactionsdatedate)
  
## Guide
Une ressource `indiquée de cette façon` en titre de niveau 3 est une classe python située dans le dossier `backend/controllers`.
Le titre de niveau 4 indique la méthode HTTP et le chemin d'accès de l'endpoint.

## Grimpeurs

### Ressource `GrimpeursListe`

#### `GET /grimpeurs`
- **Description** : Donne une liste de tous les grimpeurs.
- **Réponse** : JSON de l'ensemble des objets grimpeur.

#### `POST /grimpeurs`
- **Description** : Crée un nouveau grimpeur.
- **Entrée** : JSON correctement formaté représentant un grimpeur.
- **Réponse** : Objet grimpeur créé avec son identifiant `HTTP 201 Created`.

### Ressource `Grimpeur`

#### `GET /grimpeurs/<int:id>`
- **Description** : Récupère les informations détaillées d'un grimpeur spécifique par son identifiant.
- **Paramètres** :
    - `id` (*int*) : Identifiant unique du grimpeur.
- **Réponse** : JSON du grimpeur et `HTTP 200 OK` si trouvé, `HTTP 404`{"message": "Grimpeur not found"} si non trouvé.

#### `POST /grimpeurs/<int:id>`
- **Description** : Met à jour les informations d'un grimpeur spécifique.
- **Paramètres** :
    - `id` (*int*) : Identifiant unique du grimpeur.
- **Entrée** : JSON correctement formaté représentant les nouvelles informations du grimpeur.
- **Réponse** : Objet grimpeur mis à jour avec son identifiant `HTTP 200 OK` si trouvé, `HTTP 404`{"message": "Grimpeur not found"} si non trouvé.
  
#### `DELETE /grimpeurs/<int:id>`
- **Description** : Supprime un grimpeur spécifique via son identifiant.
- **Paramètres** :
    - `id` (*int*) : Identifiant unique du grimpeur.
- **Réponse** : `HTTP 204 No Content` si la suppression est réussie, `HTTP 404`{"message": Grimpeur not found} si le grimpeur n'existe pas.

#### `PUT /grimpeurs/<int:id>`
- **Description** : Met à jour les accords et la signature d'un grimpeur spécifique identifié par son numéro.
- **Paramètres** :
    - `id` (*int*) : Identifiant unique du grimpeur.
    - *query strings* : `AccordReglement` et `AccordParental` (valeurs possibles : `true` ou `false`).
  - **Entrée** : JSON correctement formaté donnant l'image de la signature encodée en base64.
  - **Réponse** : Objet grimpeur mis à jour avec son identifiant `HTTP 200 OK` si trouvé, `HTTP 404`{"message": "Grimpeur not found"} si non trouvé.

  - **Effet de bord** : Décode l'image de la signature et la sauvegarde dans le système de fichiers.


### Ressource `GrimpeursSearch`

#### `GET /grimpeurs/search`
- **Description** : Recherche des grimpeurs par leur numéro, nom ou prénom.
- **Paramètres** : `?query=info` info pouvant être un nom ou un numéro.
- **Réponse** : Liste d'objets grimpeur correspondant aux critères de recherche `HTTP 200 OK`.

## Séances

### Ressource `Seances`

#### `GET /seances`
- **Description** : Récupère la liste de toutes les séances.
- **Réponse** : Liste d'objets séance.

#### `POST /seances`
- **Description** : Ajoute une nouvelle séance. Pour l'instant, il n'y a pas de vérification de la possibilité de création d'une séance.
- **Entrée** : JSON correctement formaté représentant une séance.
- **Réponse** : Objet séance créé avec son identifiant `HTTP 201 Created`.

### Ressource `SeancesSearch`
#### `GET /seances/<int:id>`
- **Description** : Indique si le grimpeur est déjà venu aujourd'hui.
- **Paramètres** :
    - `id` (*int*) : NumGrimpeur, identifiant unique du grimpeur.
- **Réponse** : `HTTP 200 OK` {"est_la": true/false} si le grimpeur est déjà venu aujourd'hui, `HTTP 404`{"message": "Grimpeur not found"} si le grimpeur n'existe pas.

### Ressource `SeancesByDate`
Ressource API pour filtrer les séances par date.

#### `GET /seancesbydate`
- **Description** : Récupère les séances filtrées par date selon les paramètres fournis dans la requête.
  - Si les paramètres `date_debut` et `date_fin` sont présents, retourne les séances dont la date est comprise entre ces deux dates (incluses).
  - Si seul `date_debut` est fourni, retourne les séances correspondant exactement à cette date.
  - Si aucun paramètre n'est fourni, aucune séance n'est retournée.
- **Paramètres de requête** :
  - `date_debut` (*str*, optionnel) : Date de début du filtre (format attendu : AAAA-MM-JJ).
  - `date_fin` (*str*, optionnel) : Date de fin du filtre (format attendu : AAAA-MM-JJ).
  - **Exemple de requête**

  `GET /seancesbydate?date_debut=2024-06-01&date_fin=2024-06-30`
- **Réponse** :
  - Liste de séances filtrées, chaque séance étant sérialisée sous forme de dictionnaire.
  - Code HTTP `200 OK` en cas de succès.

### Ressource `Produit`

#### `GET /produit/<int:id>`
- **Description** : Récupère un produit spécifique par son identifiant.
- **Paramètres** :
    - `id` (*int*) : Identifiant unique du produit.
- **Réponse** : JSON du produit et `HTTP 200 OK` si trouvé, `HTTP 404`{"message": "Produit not found"} si non trouvé.
  
#### `DELETE /produit/<int:id>`
- **Description** : Supprime un produit ainsi que tous ses descendants.
- **Paramètres** :
    - `id` (*int*) : Identifiant unique du produit.
- **Réponse** : `HTTP 204 No Content` si la suppression est réussie, `HTTP 404`{"message": Produit not found} si le produit n'existe pas.

#### `PUT /produit/<int:id>`
- **Description** : Met à jour un produit spécifique.
- **Paramètres** :
    - `id` (*int*) : Identifiant unique du produit.
    - **Entrée** : JSON correctement formaté représentant les nouvelles informations du produit.
- **Réponse** : Objet produit mis à jour avec son identifiant `HTTP 200 OK` si trouvé, `HTTP 404`{"message": "Produit not found"} si non trouvé.
  
### Ressource `SousProduit`

#### `GET /sousproduit/<int:idParent>`
- **Description** : Récupère tous les sous-produits d'un produit parent spécifique.
- **Paramètres** :
    - `idParent` (*int*) : Identifiant unique du produit parent.
- **Réponse** : Liste de sous-produits associés au produit parent `HTTP 200 OK`, `HTTP 404`{"message": "Produit not found"} si le produit parent n'existe pas.

### Ressource `RacineProduits`

#### `GET /racineproduits`
- **Description** : Récupère tous les produits racines.
- **Réponse** : Liste de produits racines `HTTP 200 OK`, `HTTP 404`{"message": "No root products not found"} si    def post(self):
aucun produit racine n'existe.
  
### Ressource `Produits`

#### `GET /produits`
- **Description** : Récupère tous les produits.
- **Réponse** : Liste de tous les produits `HTTP 200 OK`, `HTTP 404`{"message": "No products found"} si aucun produit n'existe.

#### `POST /produits`
- **Description** : Crée un nouveau produit.
- **Entrée** : JSON correctement formaté représentant un produit.
- **Réponse** : Objet produit créé avec son identifiant `HTTP 201 Created`, `HTTP 400 Bad Request` si le format du JSON est incorrect.

## Tickets

### Ressource `Tickets`

#### `GET /tickets`
- **Description** : Récupère la liste de tous les tickets.
- **Réponse** : Liste d'objets ticket `HTTP 200 OK`.

#### `POST /tickets`
- **Description** : Crée un nouveau ticket.
- **Entrée** : JSON correctement formaté représentant un ticket.
- **Réponse** : Objet ticket créé avec son identifiant `HTTP 201 Created`, `HTTP 400 Bad Request` si aucune donnée JSON n'est fournie.

### Ressource `Ticket`

#### `GET /tickets/<int:id>`
- **Description** : Récupère un ticket spécifique par son identifiant.
- **Paramètres** :
  - `id` (*int*) : Identifiant unique du ticket.
- **Réponse** : JSON du ticket et `HTTP 200 OK` si trouvé, `HTTP 404`{"message": "Ticket not found"} si non trouvé.

#### `PUT /tickets/<int:id>`
- **Description** : Met à jour un ticket spécifique.
- **Paramètres** :
  - `id` (*int*) : Identifiant unique du ticket.
- **Entrée** : JSON correctement formaté représentant les nouvelles informations du ticket.
- **Réponse** : Objet ticket mis à jour `HTTP 200 OK` si trouvé, `HTTP 404`{"message": "Ticket not found"} si non trouvé, `HTTP 400 Bad Request` si aucune donnée n'est fournie.

#### `DELETE /tickets/<int:id>`
- **Description** : Supprime un ticket spécifique via son identifiant.
- **Paramètres** :
  - `id` (*int*) : Identifiant unique du ticket.
- **Réponse** : `HTTP 200 OK`{"message": "Ticket deleted"} si la suppression est réussie, `HTTP 404`{"message": "Ticket not found"} si le ticket n'existe pas.

## Abonnements

### Ressource `Abonnements`

#### `GET /abonnements`
- **Description** : Récupère la liste de tous les abonnements.
- **Réponse** : Liste d'objets abonnement `HTTP 200 OK`.

#### `POST /abonnements`
- **Description** : Crée un nouvel abonnement.
- **Entrée** : JSON correctement formaté représentant un abonnement.
- **Réponse** : Objet abonnement créé avec son identifiant `HTTP 201 Created`, `HTTP 400 Bad Request` si aucune donnée JSON n'est fournie.

### Ressource `Abonnement`

#### `GET /abonnements/<int:id>`
- **Description** : Récupère un abonnement spécifique par son identifiant.
- **Paramètres** :
  - `id` (*int*) : Identifiant unique de l'abonnement.
- **Réponse** : JSON de l'abonnement et `HTTP 200 OK` si trouvé, `HTTP 404`{"message": "Abonnement not found"} si non trouvé.

#### `PUT /abonnements/<int:id>`
- **Description** : Met à jour un abonnement spécifique.
- **Paramètres** :
  - `id` (*int*) : Identifiant unique de l'abonnement.
- **Entrée** : JSON correctement formaté représentant les nouvelles informations de l'abonnement.
- **Réponse** : Objet abonnement mis à jour `HTTP 200 OK` si trouvé, `HTTP 404`{"message": "Abonnement not found"} si non trouvé, `HTTP 400 Bad Request` si aucune donnée n'est fournie.

#### `DELETE /abonnements/<int:id>`
- **Description** : Supprime un abonnement spécifique via son identifiant.
- **Paramètres** :
  - `id` (*int*) : Identifiant unique de l'abonnement.
- **Réponse** : `HTTP 200 OK`{"message": "Abonnement deleted"} si la suppression est réussie, `HTTP 404`{"message": "Abonnement not found"} si l'abonnement n'existe pas.

## Transactions

### Ressource `Transactions`
#### `GET /transactions`
- **Description** : Récupère la liste de toutes les transactions.
- **Réponse** : Liste d'objets transaction `HTTP 200 OK`.

#### `POST /transactions`
- **Description** : Crée une nouvelle transaction.
- **Entrée** : JSON correctement formaté représentant une transaction.
- **Réponse** : Objet transaction créé avec son identifiant `HTTP 201 Created`, `HTTP 400 Bad Request` si aucune donnée JSON n'est fournie.

### Ressource `TransactionByDate`
#### `GET /transactions?date=<date>`
- **Description** : Récupère une transaction spécifique par son identifiant.
- **Paramètres** :
  - `date` (*str*) : Date au format `YYYY-MM-DD`.
- **Réponse** : JSON de la transaction et `HTTP 200 OK` si trouvée, `HTTP 404`{"message": "Transaction not found"} si non trouvée.
