const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

// Import des routes
const etudiantRoutes = require('./routes/etudiants');
const livreRoutes = require('./routes/livres');
const empruntRoutes = require('./routes/empruntes');

// Import des modèles
const Etudiant = require('./models/Etudiant');
const Livre = require('./models/Livre');
const Emprunte = require('./models/Emprunte');

// Import du middleware d'authentification
const isAuthenticated = require('./middleware/auth');

const app = express();

// Configuration de EJS
app.set('view engine', 'ejs');
app.set('views', './views');

// Middleware
app.use(cors());
app.use(express.json());  // Pour analyser les données JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Configuration de la session
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-here',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Middleware pour logger les erreurs
app.use((err, req, res, next) => {
  console.error('Erreur détaillée:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });
  res.status(500).render('error', { 
    message: 'Une erreur est survenue',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Routes d'authentification
app.get('/login', (req, res) => {
  if (req.session.isAuthenticated) {
    return res.redirect('/');
  }
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (username === 'admin' && password === 'admin') {
    req.session.isAuthenticated = true;
    res.redirect('/');
  } else {
    res.render('login', { error: 'Nom d\'utilisateur ou mot de passe incorrect' });
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Routes API (protégées par authentification)
app.use('/api/etudiants', isAuthenticated, etudiantRoutes);
app.use('/api/livres', isAuthenticated, livreRoutes);
app.use('/api/empruntes', isAuthenticated, empruntRoutes);

// Route principale (protégée par authentification)
app.get('/', isAuthenticated, async (req, res) => {
  try {
    console.log('Tentative de chargement des données...');
    const [etudiants, livres, emprunts] = await Promise.all([
      Etudiant.find().exec(),
      Livre.find().exec(),
      Emprunte.find().populate('etudiant livre').exec()
    ]);
    
    console.log('Données chargées avec succès:', {
      etudiants: etudiants.length,
      livres: livres.length,
      emprunts: emprunts.length
    });
    
    res.render('index', { etudiants, livres, emprunts });
  } catch (error) {
    console.error('Erreur détaillée lors du chargement des données:', error);
    res.status(500).render('error', { 
      message: 'Une erreur est survenue lors du chargement des données',
      error: process.env.NODE_ENV === 'development' ? error : {}
    });
  }
});

// Route de test de la connexion MongoDB
app.get('/test-db', async (req, res) => {
  try {
    const db = mongoose.connection;
    const collections = await db.db.listCollections().toArray();
    res.json({
      status: 'success',
      message: 'Connexion MongoDB active',
      collections: collections.map(c => c.name)
    });
  } catch (error) {
    console.error('Erreur de test MongoDB:', error);
    res.status(500).json({
      status: 'error',
      message: 'Erreur de connexion MongoDB',
      error: error.message
    });
  }
});

// Connexion à MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://idihyayoussef931:i1gfdJxXVdOPb30t@cluster0.sihpaoz.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGODB_URI) {
  console.error('Erreur: MONGODB_URI n\'est pas défini');
  process.exit(1);
}

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connecté à MongoDB Atlas avec succès');
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB Atlas:', {
      message: err.message,
      code: err.code,
      codeName: err.codeName
    });
    console.log('Veuillez vérifier vos identifiants MongoDB Atlas');
    process.exit(1);
  });

// Lancer le serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
