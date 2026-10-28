const Datacenter = require("../models/Datacenter");

async function getAll(req, res, next) {
  try {
    res.status(200).json(await Datacenter.findAll());
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const datacenter = await Datacenter.findById(req.params.id);
    if (!datacenter) return res.status(404).json({ erreur: "Datacenter introuvable" });
    res.status(200).json(datacenter);
  } catch (err) {
    next(err)
  }
}

module.exports = { getAll, getById };
