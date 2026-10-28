const pool = require("../config/db");

class Dashboard {
  // Chiffre d'affaires mensuel total : somme des prix des abonnements actifs
  static async chiffreAffairesTotal() {
    const { rows } = await pool.query(
      "SELECT COALESCE(SUM(prix_applique), 0) AS total FROM abonnement WHERE statut = 'actif'"
    );
    return rows[0].total;
  }

  // Chiffre d'affaires mensuel par catégorie d'offre (vps, mutualise, dedie, domaine)
  static async chiffreAffairesParCategorie() {
    const { rows } = await pool.query(
      `SELECT o.categorie, SUM(a.prix_applique) AS chiffre_affaires
       FROM abonnement a
       JOIN offre o ON o.id_offre = a.id_offre
       WHERE a.statut = 'actif'
       GROUP BY o.categorie
       ORDER BY o.categorie`
    );
    return rows;
  }

  // Nombre de serveurs par datacenter et par statut
  static async serveursParDatacenter() {
    const { rows } = await pool.query(
      `SELECT d.nom AS datacenter, s.statut, COUNT(*)::int AS nombre
       FROM serveur s
       JOIN datacenter d ON d.id_datacenter = s.id_datacenter
       GROUP BY d.nom, s.statut
       ORDER BY d.nom, s.statut`
    );
    return rows;
  }
}

module.exports = Dashboard;
