#!/bin/bash

#######################################
# CONFIGURATION
#######################################

# Nom du conteneur Docker
CONTAINER_NAME="casafrontend"

# Dossier du projet (ex: /var/www/mon-projet)
PROJECT_DIR="/home/casamur/CasaLogiciel/frontend"

# Commande de build de l'image (À PERSONNALISER)
BUILD_COMMAND="sudo docker build --build-arg NEXT_PUBLIC_API_URL=http://192.168.1.199:5000 --build-arg  NEXT_PUBLIC_PASSWORD=CASASEPT96 -t casafrontend ."

# Commande de lancement du conteneur (À PERSONNALISER)
RUN_COMMAND="sudo docker run --name casafrontend --network casabdd --ip 172.16.63.4 -p 3000:3000 casafrontend:latest"

#######################################
# SCRIPT
#######################################

echo "======================================"
echo " Déploiement Docker - $(date)"
echo "======================================"
echo

# Vérification du conteneur
echo "🔍 Recherche du conteneur Docker : $CONTAINER_NAME"
CONTAINER_ID=$(sudo docker ps -aq -f name="^${CONTAINER_NAME}$")

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
