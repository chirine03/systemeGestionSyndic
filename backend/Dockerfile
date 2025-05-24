# Utilise une image Node officielle
FROM node:18

# Crée un dossier de travail
WORKDIR /app

# Copie les fichiers
COPY . .

# Va dans le dossier backend
WORKDIR /app/backend

# Installe les dépendances
RUN npm install

# Expose le port (change-le si ton app utilise un autre)
EXPOSE 3001

# Lance le serveur
CMD ["node", "api/index.js"]
