const mongoose = require('mongoose');

const empruntSchema = new mongoose.Schema({
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  etudiant: { type: mongoose.Schema.Types.ObjectId, ref: 'Etudiant', required: true },
  livre: { type: mongoose.Schema.Types.ObjectId, ref: 'Livre', required: true },
});

module.exports = mongoose.model('Emprunt', empruntSchema);
