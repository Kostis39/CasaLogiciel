# Utiliser une image Node.js comme base
FROM node:20-alpine

# Créer un répertoire de travail dans le conteneur (chemin ABSOLU)
WORKDIR /front

# Copier UNIQUEMENT les fichiers npm
COPY package.json package-lock.json ./

# Nettoyer le cache npm + installer proprement les dépendances
RUN npm cache clean --force \
    && npm ci

# Recevoir les ARG
ARG NEXT_PUBLIC_API_URL_PROD
ARG NEXT_PUBLIC_PASSWORD
ARG NEXT_PUBLIC_ENV
ARG NEXT_PUBLIC_METABASE_URL

# Les convertir en ENV pour le build Next.js
ENV NEXT_PUBLIC_API_URL_PROD=$NEXT_PUBLIC_API_URL_PROD
ENV NEXT_PUBLIC_PASSWORD=$NEXT_PUBLIC_PASSWORD
ENV NEXT_PUBLIC_ENV=$NEXT_PUBLIC_ENV
ENV NEXT_PUBLIC_METABASE_URL=$NEXT_PUBLIC_METABASE_URL

# Copier le reste du code source
COPY . .

# Construire l'application Next.js
RUN npm run build

# Exposer le port utilisé par l'application Next.js
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]
