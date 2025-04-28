const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

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
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Mettez à true si vous utilisez HTTPS
}));

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
    const [etudiants, livres, emprunts] = await Promise.all([
      Etudiant.find(),
      Livre.find(),
      Emprunte.find().populate('etudiant livre')
    ]);
    
    res.render('index', { etudiants, livres, emprunts });
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error);
    res.status(500).send('Erreur serveur');
  }
});

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
