# Casa Central

## Prérequis

- Python 3.11
- Installer les package nécessaire:
```python 
pip install - r pyreqs.txt
```
- npm : Next.js 15.3.2 + tailwind
- Installer tt les packages requis:
```bash
npm install
```
- Obtenir et stocker les fichiers `vpn-auth.txt` et `profile-userlocked.ovpn` dans le répertoire principal (demander à l'admin).
- Obtenir et stocker le fichier `.env` dans `./archive` (demander à l'admin).

## Migration Base de Données

- Mettre dans le dossier `archive` les fichiers **CSV sans Headers**.
- Demander le fichier .env à mettre dans ce dossier pour faire fonctionner le tout
- Lancer le script: `python extract_data.py`
- Vérifier qu'il y ai bien ce message: `Données exportées avec succès vers MariaDB`

## Lancement 

1. Se connecter au VPN (ou de manière sécu à l'endroit où est stocker la bd):
```bash
sudo sh vpnlog.sh
```
2. Lancer l'API:
```bash
python api.py
```
3. Lancer le frontend:
```bash
npm run build 
npm run start
```

## Fichiers de config
#### Extraction base de donnees

Le fichier `./archive/.env` contient les chemins relatifs à la connexion à la bd distante et au nom des fichiers `csv`.

#### Backend

Le fichier `backend/db.python` contient tout le protocle pour ce connecter à la bd distante.

#### Frontend

Le fichier `frontend/.env.local` le path de l'API (changeable même après le build du frontend).

