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

> **Sécurité** : au premier accès sur `http://<ip-serveur>:4000`, Metabase affiche
> une page de setup. Définissez immédiatement un compte administrateur avec un
> mot de passe fort (email + mot de passe). Tant que ce setup n'est pas fait,
> n'importe qui sur le réseau peut le faire à votre place — faites-le juste
> après le déploiement.

1. Pour ce premier champ mettre ses informations
2. Cliquer sur Next
3. Add your data : choisir *MySQL*
- Display Name: le nom que vous voulais donner à votre base de données
- Host: mariadb Port: 3306
- Database name: casabdd
- Username: root
- Password: *mdp MARIADB_PASSWORD mis dans le .env*
4. Décocher et c'est bon !

### Accès phpMyAdmin depuis le réseau

phpMyAdmin est accessible sur `http://<ip-serveur>:8080` avec **deux**
authentifications successives :

1. **Basic Auth HTTP** — fenêtre de login du navigateur. Compte : `admin`,
   mot de passe défini dans `config/phpmyadmin/htpasswd`.
   Pour changer le mot de passe :
   ```bash
   docker run --rm httpd:2.4-alpine htpasswd -nbB admin 'NOUVEAU_MOT_DE_PASSE' \
     | cut -d: -f2 > config/phpmyadmin/htpasswd
   ```
   (ou sans docker : `openssl passwd -apr1 'MOT_DE_PASSE' > config/phpmyadmin/htpasswd`)
2. **Login MySQL** — identifiants MariaDB (`MARIADB_USER` / `MARIADB_PASSWORD`
   du `.env`, par défaut root).

> Le mot de passe Basic Auth livré par défaut (`ChangeMe-CasaAdmin-2026!`)
> est **temporaire** : changez-le avant toute mise en production.

### Sécurité réseau : ce qui est exposé et pourquoi

| Port | Service | Accès | Protection |
|---|---|---|---|
| 3000 | Frontend | réseau local | mot de passe app + auth API (token 24h) |
| 5000 | Backend API | réseau local | token Bearer signé requis sur toutes les routes |
| 8080 | phpMyAdmin | réseau local | Basic Auth HTTP + login MySQL (pas d'auto-login) |
| 4000 | Metabase | réseau local | comptes Metabase + setup token |
| 3306 | MariaDB | **non exposé** | conteneurs internes uniquement |

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

## Développement

1. Installer les dépendances manquantes :
```bash
cd backend
pip install - r pyreqs.txt
cd ../frontend
npm install
```
2. Initialiser les fichiers `.env` ou `.env.local` de `la racine`, `backend/` et `frontend`.
3. Lancement base de données :
```bash
sudo docker-compose up -d mariadb phpmyadmin
```
4. Lancement Backend :
```bash
python api.py
```
5. Lancement Frontend: 
```bash
npm run dev
```