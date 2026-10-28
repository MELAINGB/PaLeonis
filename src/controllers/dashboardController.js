const Dashboard = require("../models/Dashboard");

async function getDashboard(req, res, next) {
  try {
    const total = await Dashboard.chiffreAffairesTotal();
    const parCategorie = await Dashboard.chiffreAffairesParCategorie();
    const serveurs = await Dashboard.serveursParDatacenter();

    res.status(200).json({
      chiffre_affaires_total: total,
      chiffre_affaires_par_categorie: parCategorie,
      serveurs_par_datacenter: serveurs,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { getDashboard };
