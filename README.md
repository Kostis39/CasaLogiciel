# Casa Logiciel

## Prérequis

- Docker:
```bash
Client:
 Version:           28.2.2
 API version:       1.50
 Go version:        go1.23.1
```
- Docker compose:
```bash
docker-compose version 1.29.2, build unknown
docker-py version: 5.0.3
CPython version: 3.10.12
OpenSSL version: OpenSSL 3.0.2 15 Mar 202
```
- Python 3.11
- Npm 11.8 avec Next.js

## Mise en production

1. Initialiser le fichier `.env` global, pour ce faire suivre explication du `.env.example`.
3. Ajout du pdf du réglement dans `frontend/public/` il faut qu'il soit nommé `reglement.pdf`.
2. Lancement en une commande:
```bash
sudo docker-compose up -d --build
```

### Premier lancement de Metabase (outil statistique)

1. Pour ce premier champ mettre ses informations
2. Cliquer sur Next
3. Add your data : choisir *MySQL*
- Display Name: le nom que vous voulais donner à votre base de données
- Host: mariadb Port: 3306
- Database name: casabdd
- Username: root
- Password: *mdp MARIADB_PASSWORD mis dans le .env*
4. Décocher et c'est bon !

## Extraction des données de l'ancienne app à la nouvelle

1. Mettre les fichiers csv avec comme séparateur `,` dans le dossier `./data_extract`.
2. Initialiser les vars d'environnements pour pouvoir connecter le prog à la nouvelle bdd.
3. Lancer le programme d'extraction:
```bash
python extract_data.py
```

## Update

Lancer:
```bash
git pull
sudo docker-compose down frontend backend
sudo docker-compose up -d --build frontend backend
sudo docker system prune -a
```

## Dévellopement

1. Installer les dépendances manquantes:
```bash
cd backend
pip install - r pyreqs.txt
cd ../frontend
npm install
```
2. Initialiser les fichiers `.env` ou `.env.local` de `la racine`, `backend/` et `frontend`.
3. Lancement base de données:
```bash
sudo docker-compose up -d mariadb phpmyadmin
```
4. Lancement Backend:
```bash
pyton api.py
```
5. Lancement Frontend:
```bash
npm run dev
```