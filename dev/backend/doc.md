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
- **Réponse** : JSON du grimpeur et `HTTP 200 OK` si trouvé, `HTTP 404`{"message": Grimpeur not found} si non trouvé.

#### `POST /grimpeurs/<int:id>`
- **Description** : Met à jour les informations d'un grimpeur spécifique.
- **Paramètres** :
    - `id` (*int*) : Identifiant unique du grimpeur.
- **Entrée** : JSON correctement formaté représentant les nouvelles informations du grimpeur.
- **Réponse** : Objet grimpeur mis à jour avec son identifiant `HTTP 200 OK` si trouvé, `HTTP 404`{"message": Grimpeur not found} si non trouvé.
  
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
### `GET /seances/<int:id>`
- **Description** : Indique si le grimpeur est déjà venu aujourd'hui.
- **Paramètres** :
    - `id` (*int*) : NumGrimpeur, identifiant unique du grimpeur.
- **Réponse** : `HTTP 200 OK` {"est_la": true/false} si le grimpeur est déjà venu aujourd'hui, `HTTP 404`{"message": Grimpeur not found} si le grimpeur n'existe pas.