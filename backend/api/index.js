import dotenv from 'dotenv';
dotenv.config({ path: '../.env' });

import express from 'express';
import cors from 'cors';
import serverless from 'serverless-http';

// Routes
import registerRoutes from '../routes/registerRoutes.js';
import loginRoutes from '../routes/loginRoutes.js';
import getUserRoutes from '../routes/getUserRoutes.js';
import updateUserRoutes from '../routes/updateUserRoutes.js';
import cotisationRoutes from '../routes/cotisation/cotisationRoutes.js';
import listeComptesRoutes from '../routes/ComptesInscrit/listeComptesRoutes.js';
import propPaiementRoutes from '../routes/listePaiement/propPaiementRoutes.js'; 
import getPersonneRoutes from '../routes/ComptesInscrit/getPersonneRoutes.js';
import prestatairesRoutes from '../routes/prestataires/prestatairesRoute.js';
import servicesRoutes from '../routes/prestataires/servicesRoutes.js';
import depenseRoutes from '../routes/depense/depenseRoutes.js'; 
import immeubleRoutes from '../routes/immeuble/immeubleRoutes.js'; 
import proprietaireRoutes from '../routes/proprietaire/proprietaireRoutes.js';
import appartementRoutes from '../routes/appartement/appartementRoutes.js';
import personnelRoutes from '../routes/personnel/personnelRoutes.js';

const app = express();

app.use(cors());
app.use(express.json());

// Register API routes
app.use('/api', registerRoutes);
app.use('/api', loginRoutes);
app.use('/api', getUserRoutes);
app.use('/api', updateUserRoutes);
app.use('/api/cotisation', cotisationRoutes);
app.use('/api/comptes', listeComptesRoutes); 
app.use('/api', propPaiementRoutes);
app.use('/api', getPersonneRoutes);
app.use('/api/prestataires', prestatairesRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/depense', depenseRoutes); 
app.use('/api/immeuble', immeubleRoutes);
app.use('/api/proprietaire', proprietaireRoutes);
app.use('/api/appartement', appartementRoutes);
app.use('/api/personnel', personnelRoutes);


export const handler = serverless(app);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`✅ Serveur backend démarré sur le port ${PORT}`);
});
