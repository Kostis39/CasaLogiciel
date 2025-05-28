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
  - [Produits](#produits)
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

## Produits

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
