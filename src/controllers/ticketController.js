const Ticket = require("../models/Ticket");

async function getAll(req, res, next){
    try{
        res.status(200).json(await Ticket.findAll());
    } catch(err) {
        next(err);
    }
}

async function getById(req, res, next){
    try{
        const ticket = await Ticket.findById(req.params.id);
        if(!ticket) return res.status(404).json({ erreur: "Ticket non trouvé"});
        res.status(200).json(ticket);
    } catch(err) {
        next(err);
    }
}


async function create(req, res, next){
    try {
        const { sujet, id_client, id_serveur, date_ouverture, date_fermeture, priorite, statut } = req.body;
        if (!sujet || !id_client || !id_serveur || !date_ouverture || !date_fermeture || !priorite || !statut){
            return res.status(400).json({ erreur: "Champs manquant" });
        }
        const ticket = await Ticket.create(req.body);
        res.status(201).json(ticket);
    } catch(err) {
        next(err);
    }
}

async function update(req, res, next){
    try {
        const { sujet, id_client, id_serveur, date_ouverture, date_fermeture, priorite, statut } = req.body;
        if (!sujet || !id_client || !id_serveur || !date_ouverture || !date_fermeture || !priorite || !statut){
            return res.status(400).json({ erreur: "Champs manquant" });
        }
        const ticket = await Ticket.update(req.params.id, req.body);
        if(!ticket) return res.status(404).json({ erreur: "Ticket non trouvé"});
        res.status(200).json(ticket);
    } catch(err) {
        next(err);
    }
}

async function deleteTicket(req, res, next){
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) return res.status(400).json({ erreur: "ID invalide" });
        const ticket = await Ticket.delete(id);
        if(!ticket) return res.status(404).json({ erreur: "Ticket non trouvé"});
        res.status(200).json({ message: "Ticket supprimé"});
    } catch(err) {
        next(err);
    }
}

module.exports = { getAll, getById, create, update, delete: deleteTicket };
