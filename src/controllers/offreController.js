const Offre = require("../models/Offre");

async function getAll(req, res, next) {
    try {
        res.status(200).json(await Offre.findAll());
    } catch(err){
        next(err)
    }
}

async function getById(req, res, next) {
    try {
        const offre = await Offre.findById(req.params.id);
        if (!offre) return res.status(404).json({ erreur: "Offre non trouvée"});
        res.status(200).json(offre);
    } catch(err) {
        next(err);
    }
}

async function create(req, res, next) {
    try {
        if (!req.body.nom || !req.body.type || !req.body.prix || !req.body.description){
            return res.status(400).json({ erreur: "Champs manquant" });
        }
        const offre = await Offre.create(req.body);
        res.status(201).json(offre);
    } catch(err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        if (!req.body.nom || !req.body.type || !req.body.prix || !req.body.description){
            return res.status(400).json({ erreur: "Champs manquant" });
        }
        const offre = await Offre.update(req.params.id, req.body);
        if (!offre) return res.status(404).json({ erreur: "Offre non trouvée" });
        res.status(200).json(offre);
    } catch(err) {
        next(err);
    }
}

async function deleteOffre(req, res, next) {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ erreur: "ID invalide" });
        const offre = await Offre.delete(id);
        if (!offre) return res.status(404).json({ erreur: "Offre non trouvée" });
        res.status(200).json({ message: "Offre supprimée" });
    } catch(err) {
        next(err);
    }
}

module.exports = { getAll, getById, create, update, delete: deleteOffre };

