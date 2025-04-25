const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import des routes
const etudiantRoutes = require('./routes/etudiants');
const livreRoutes = require('./routes/livres');
const empruntRoutes = require('./routes/empruntes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());  // Pour analyser les données JSON

// Routes
app.use('/api/etudiants', etudiantRoutes);
app.use('/api/livres', livreRoutes);
app.use('/api/empruntes', empruntRoutes);

// Connexion à la base de données
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connecté à la base de données');
}).catch((err) => {
  console.error('Erreur de connexion:', err);
});

// Lancer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
