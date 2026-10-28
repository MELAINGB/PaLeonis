const Serveur = require("../models/Serveur");

async function getAll(req, res, next) {
  try {
    const serveurs = await Serveur.findAll(req.query);
    res.status(200).json(serveurs);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const serveur = await Serveur.findById(req.params.id);
    if (!serveur) {
      return res.status(404).json({ erreur: "Serveur introuvable" });
    }
    res.status(200).json(serveur);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById };
