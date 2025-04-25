const express = require('express');
const Emprunt = require('../models/Emprunte');
const router = express.Router();

// Ajouter un emprunt
router.post('/', async (req, res) => {
  try {
    const emprunt = new Emprunt(req.body);
    await emprunt.save();
    res.status(201).json(emprunt);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// Récupérer tous les emprunts
router.get('/', async (req, res) => {
  try {
    const emprunts = await Emprunt.find().populate('etudiant livre');
    res.json(emprunts);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

module.exports = router;
