# Utilise Node.js officiel
FROM node:18

# Crée un répertoire de travail
WORKDIR /app

# Copie les fichiers
COPY . .

# Installe les dépendances
RUN npm install

# Lance l'app
CMD ["npm", "start"]
