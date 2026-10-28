const Technicien = require("../models/Technicien");

async function getAll(req, res, next) {
  try {
    const techniciens = await Technicien.findAll();
    res.status(200).json(techniciens);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const technicien = await Technicien.findById(req.params.id);
    if (!technicien) {
      return res.status(404).json({ erreur: "Technicien introuvable" });
    }
    res.status(200).json(technicien);
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById };
