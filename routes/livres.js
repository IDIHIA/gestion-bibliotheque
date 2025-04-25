const express = require('express');
const Livre = require('../models/Livre');
const router = express.Router();

// Ajouter un livre
router.post('/', async (req, res) => {
  try {
    const livre = new Livre(req.body);
    await livre.save();
    res.status(201).json(livre);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer tous les livres
router.get('/', async (req, res) => {
  try {
    const livres = await Livre.find();
    res.json(livres);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
