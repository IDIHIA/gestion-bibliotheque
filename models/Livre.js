const mongoose = require('mongoose');

const livreSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  disponibilite: { type: Boolean, default: true },
});

module.exports = mongoose.model('Livre', livreSchema);
