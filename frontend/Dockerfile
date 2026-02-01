# Utiliser une image Node.js comme base
FROM node:18-alpine

# Créer un répertoire de travail dans le conteneur (chemin ABSOLU)
WORKDIR /front

# Copier UNIQUEMENT les fichiers npm
COPY package.json package-lock.json ./

# Nettoyer le cache npm + installer proprement les dépendances
RUN npm cache clean --force \
    && npm ci

# Copier le reste du code source
COPY . .

# Construire l'application Next.js
RUN npm run build

# Exposer le port utilisé par l'application Next.js
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
