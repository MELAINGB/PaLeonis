const Abonnement = require("../models/Abonnement");

// POST /api/abonnements
async function souscrire(req, res, next) {
  try {
    const { id_client, id_offre, id_datacenter } = req.body || {};
    if (!id_client || !id_offre) {
      return res.status(400).json({ erreur: "id_client et id_offre sont obligatoires" });
    }
    const abonnement = await Abonnement.souscrire(id_client, id_offre, id_datacenter);
    res.status(201).json(abonnement);
  } catch (err) {
    next(err);
  }
}

// GET /api/abonnements/:id
async function getById(req, res, next) {
  try {
    const abonnement = await Abonnement.findById(req.params.id);
    if (!abonnement) {
      return res.status(404).json({ erreur: "Abonnement introuvable" });
    }
    res.status(200).json(abonnement);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/abonnements/:id/resiliation
async function resilier(req, res, next) {
  try {
    const abonnement = await Abonnement.resilier(req.params.id);
    res.status(200).json(abonnement);
  } catch (err) {
    next(err);
  }
}

module.exports = { souscrire, getById, resilier };
