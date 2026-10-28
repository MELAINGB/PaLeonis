const Client = require("../models/Client");

async function getAll(req, res, next) {
  try {
    let clients;
    if (req.query.search) {
      clients = await Client.search(req.query.search);
    } else {
      clients = await Client.findAll();
    }
    res.status(200).json(clients);
  } catch (err) {
    next(err);
  }
}

async function getById(req, res, next) {
  try {
    const client = await Client.findById(req.params.id);
    if (!client) {
      return res.status(404).json({ erreur: "Client introuvable" });
    }
    res.status(200).json(client);
  } catch (err) {
    next(err);
  }
}

async function getFiche(req, res, next) {
  try {
    const fiche = await Client.findFiche(req.params.id);
    if (!fiche) {
      return res.status(404).json({ erreur: "Client introuvable" });
    }
    res.status(200).json(fiche);
  } catch (err) {
    next(err);
  }
}

async function create(req, res, next) {
  try {
    const { type_client, nom, email } = req.body || {};
    if (!type_client || !nom || !email) {
      return res.status(400).json({ erreur: "type_client, nom et email sont obligatoires" });
    }
    const client = await Client.create(req.body);
    res.status(201).json(client);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { type_client, nom, email } = req.body || {};
    if (!type_client || !nom || !email) {
      return res.status(400).json({ erreur: "type_client, nom et email sont obligatoires" });
    }
    const client = await Client.update(req.params.id, req.body);
    if (!client) {
      return res.status(404).json({ erreur: "Client introuvable" });
    }
    res.status(200).json(client);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const nbSupprimes = await Client.delete(req.params.id);
    if (nbSupprimes === 0) {
      return res.status(404).json({ erreur: "Client introuvable" });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById, getFiche, create, update, remove };
