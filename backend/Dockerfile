# Utilise une image Node officielle
FROM node:18

# Crée un dossier de travail
WORKDIR /app

# Copie les fichiers
COPY . .

# Installe les dépendances
RUN npm install

# Expose le port
EXPOSE 3001

# Lance le serveur
CMD ["node", "index.js"]
