const Abonnement = require("../models/Abonnement");

const erreur = (res, status, code, message) => res.status(status).json({ erreur: { code, message } });

function idValide(valeur) {
  const n = Number(valeur);
  return Number.isInteger(n) && n > 0 ? n : null;
}

// POST /api/abonnements
async function souscrire(req, res, next) {
  try {
    const { id_client, id_offre, id_datacenter } = req.body ?? {};

    const idClient = idValide(id_client);
    const idOffre = idValide(id_offre);
    if (!idClient || !idOffre) {
      return erreur(res, 400, "CHAMPS_INVALIDES", "id_client et id_offre sont obligatoires (entiers positifs)");
    }

    let idDatacenter = null;
    if (id_datacenter !== undefined && id_datacenter !== null) {
      idDatacenter = idValide(id_datacenter);
      if (!idDatacenter) return erreur(res, 400, "CHAMPS_INVALIDES", "id_datacenter doit être un entier positif");
    }

    const abonnement = await Abonnement.souscrire({
      id_client: idClient,
      id_offre: idOffre,
      id_datacenter: idDatacenter,
    });
    res.status(201).json(abonnement);
  } catch (err) {
    next(err);
  }
}

// GET /api/abonnements/:id
async function getById(req, res, next) {
  try {
    const id = idValide(req.params.id);
    if (!id) return erreur(res, 400, "ID_INVALIDE", "L'id doit être un entier positif");

    const abonnement = await Abonnement.findById(id);
    if (!abonnement) return erreur(res, 404, "ABONNEMENT_INTROUVABLE", "Abonnement introuvable");
    res.status(200).json(abonnement);
  } catch (err) {
    next(err);
  }
}

// PATCH /api/abonnements/:id/resiliation
async function resilier(req, res, next) {
  try {
    const id = idValide(req.params.id);
    if (!id) return erreur(res, 400, "ID_INVALIDE", "L'id doit être un entier positif");

    res.status(200).json(await Abonnement.resilier(id));
  } catch (err) {
    next(err);
  }
}

module.exports = { souscrire, getById, resilier };
