#!/bin/bash

#######################################
# CONFIGURATION
#######################################

# Nom du conteneur Docker
CONTAINER_NAME="casabackend"

# Dossier du projet (ex: /var/www/mon-projet)
PROJECT_DIR="/home/casamur/CasaLogiciel/backend"

# Commande de build de l'image (À PERSONNALISER)
BUILD_COMMAND="sudo docker build -t casabackend ."

# Commande de lancement du conteneur (À PERSONNALISER)
RUN_COMMAND="sudo docker run -d --name casabackend --network casabdd --ip 172.16.63.3 -p 5000:5000 -e DB_HOST=172.16.63.1 -e DB_NAME=casabdd -e DB_PASSWORD=CASASEPT96 -e DB_PORT=3306 -e DB_USER=casamur -v /home/casamur/data/signatures:/code/static/uploads/signatures casabackend:latest"

#######################################
# SCRIPT
#######################################

echo "======================================"
echo " Déploiement Docker - $(date)"
echo "======================================"
echo

# Vérification du conteneur
echo "🔍 Recherche du conteneur Docker : $CONTAINER_NAME"
CONTAINER_ID=$(docker ps -aq -f name="^${CONTAINER_NAME}$")

if [ -n "$CONTAINER_ID" ]; then
    echo "✅ Conteneur trouvé (ID: $CONTAINER_ID)"

    echo "🛑 Arrêt du conteneur..."
    docker stop "$CONTAINER_NAME"

    echo "🗑️  Suppression du conteneur..."
    docker rm "$CONTAINER_NAME"
else
    echo "ℹ️  Aucun conteneur existant trouvé"
#    exit 1
fi

echo
echo "📁 Accès au dossier du projet : $PROJECT_DIR"
cd "$PROJECT_DIR" || {
    echo "❌ ERREUR : Impossible d'accéder au dossier"
    exit 1
}

echo
echo "⬇️  Mise à jour du projet via git"
git pull

echo
echo "🔨 Build de l'image Docker"
echo "➡️  Commande : $BUILD_COMMAND"
eval "$BUILD_COMMAND"

if [ $? -ne 0 ]; then
    echo "❌ ERREUR : Échec du build"
    exit 1
fi

echo
echo "🚀 Lancement du conteneur Docker"
echo "➡️  Commande : $RUN_COMMAND"
eval "$RUN_COMMAND"

if [ $? -ne 0 ]; then
    echo "❌ ERREUR : Échec du lancement du conteneur"
    exit 1
fi

echo
echo "✅ Déploiement terminé avec succès"
echo "======================================"
