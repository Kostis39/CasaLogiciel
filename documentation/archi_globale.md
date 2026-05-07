# Architechture global de l'app Casa

On a décidé de faire une app web hebergé sur un serveur à Casa pour que l'on puisse y accéder via n'importe quel appareil connecter au réseau.
Pour ce faire nous avons:
- Base de données: *MariaDB*
- Backend (API): *Python en flask + sqlalchemy*
- Frontend (application): *React* avec le framework *NextJs + Tailwind*

Ajouté à ça nous avons d'autres services d'administration ou de stat:
- Backup de la bas de donnée: scrip *cron* lié à un *duplicati* pour stocker sur le OneDrive les backups
- Administration de la base de donnée: *PhpMyAdmin*
- Outils de statistique lié à la bdd: *MetaBase*

Pour lié le tout nous avons décider de faire une stack *Docker* qui tourne sur le serveur et que l'on administre via *Portainer* un outils d'administration pour Dockers.

## Base de données

* Outil/language: Mariadb
* Architechture:
La base casabdd stocke les infos utile à l'app.
- Les Grimpeurs sont les clients 
- Club/Abonnement/Ticket stock leur les choses pour lesquels ils sont nommés
- Séance stocke les informations de chaque entrée d'un grimpeur dans la salle, que ce soit sont heure d'arrivé ou bien le moyen de 'payement' (abonnemnt ou ticket) utilisé pour le créneau.
- Transaction stocke chaque ajout de moyen d'entré d'un grimpeur. Exemple: si un grimpeur prends un abonnement annuel, cet événement sera stocké dans cette table.

Et la base de donnée metabaseappdb sert au fonctionnement de metabase.


## Backend (API)

* Outil/language: Python avec flask + sqlalchemy
* Architechture: 
    * **/models**: stocke les fichiers de modèles pour bien liés les interaction BDD-API. 
    * **/controllers**: stocke les fichiers des fonctions définnissant les interraction entre API et BDD.
    * *api.py*: définis les url de connection à l'API 
    * *autres fichiers*: servent à l'initialisation du service

## Frontend (Application)

* Outil/language: React avec NextJs + Tailwind
* Architechture:
    * **app/**:
    * **public/**:
    * **src/**: 
    * *Dockerfile*: Données utile au lancement du docker pour le frontend
    * *autres fichiers*: servent à l'initialisation du service

## Backup

* Outil/language: Bash
* Fonctionnement:
*Unique fichier*: aucune idée de comment ça fonctionne Anto help
* Commentaire:
Utilise directement les outils de la base de données pour l'exporter puis créer une archive chiffré avec les signatures en plus de la bdd. Puis envoi l'archive dans le OneDrive. 
Via Duplicati il ya un outils de monitoring qui notifie si la save c'est bien passé.

## Administration BDD

* Outil/language: PhpMyAdmin
* Accées: port *8080*
* Documentation: [lien](https://www.phpmyadmin.net/)
* Commentaire: 
N'est pas directement utile lors de la mise en production mais fortement conseillé en cas de bug ou de rajout de fonctionnalité à la BDD.

## Outil statistique

* Outil/language: Metabase
* Accées: port *3000:4000*
* Documentation: [lien](https://www.metabase.com/)
* Commentaire:
Accessible directement dans l'onglet statistiques dans l'application.

## Portainer

* Accées: port *9443*
* Documentation: [lien](https://www.portainer.io/)
* Commentaire:
La stack (l'application entière) est lancé directement via portainer pour avoir un accès complet à tout les outils proposé par Portainer. 
Pour la mise à jour il suffit de cliquer sur un boutton et le *git pull* + *docker compose up* sont fait automatiquement.