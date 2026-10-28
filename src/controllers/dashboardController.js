const Abonnement = require("../models/Abonnement");
const Serveur = require("../models/Serveur");

async function getDashboard(req, res, next) {
  try {
    const chiffreAffaires = await Abonnement.getChiffreAffaires();
    const serveurs = await Serveur.countParDatacenter();

    res.status(200).json({
      chiffre_affaires_total: chiffreAffaires.total,
      chiffre_affaires_par_categorie: chiffreAffaires.par_categorie,
      serveurs_par_datacenter: serveurs,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboard };
