const Offre = require("../models/Offre");

async function getAll(req, res, next) {
    try {
        res.status(200).json(await Offre.findAll(req.query));
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
        const { nom, categorie, prix_mensuel_ht } = req.body || {};
        // prix_mensuel_ht peut valoir 0, donc on vérifie qu'il est présent et pas seulement "vrai"
        if (!nom || !categorie || prix_mensuel_ht === undefined) {
            return res.status(400).json({ erreur: "nom, categorie et prix_mensuel_ht sont obligatoires" });
        }
        const offre = await Offre.create(req.body);
        res.status(201).json(offre);
    } catch(err) {
        next(err);
    }
}

async function update(req, res, next) {
    try {
        const { nom, categorie, prix_mensuel_ht } = req.body || {};
        if (!nom || !categorie || prix_mensuel_ht === undefined) {
            return res.status(400).json({ erreur: "nom, categorie et prix_mensuel_ht sont obligatoires" });
        }
        const offre = await Offre.update(req.params.id, req.body);
        if (!offre) return res.status(404).json({ erreur: "Offre non trouvée" });
        res.status(200).json(offre);
    } catch(err) {
        next(err);
    }
}

async function retirer(req, res, next) {
    try {
        const offre = await Offre.retirer(req.params.id);
        if (!offre) return res.status(404).json({ erreur: "Offre non trouvée" });
        res.status(200).json(offre);
    } catch(err) {
        next(err);
    }
}

module.exports = { getAll, getById, create, update, retirer };
