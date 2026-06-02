FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de package
COPY package*.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Exposer le port
EXPOSE 5173

# Démarrer Vite sur toutes les interfaces
CMD ["npm", "run", "dev"]
