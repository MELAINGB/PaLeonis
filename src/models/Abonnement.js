const pool = require("../config/db");

class Abonnement {
  // Chiffre d'affaires mensuel des abonnements actifs : total et par catégorie d'offre (B9)
  static async getChiffreAffaires() {
    const total = await pool.query(
      "SELECT COALESCE(SUM(prix_applique), 0) AS total FROM abonnement WHERE statut = 'actif'"
    );

    const parCategorie = await pool.query(
      `SELECT o.categorie, SUM(a.prix_applique) AS chiffre_affaires
       FROM abonnement a
       JOIN offre o ON o.id_offre = a.id_offre
       WHERE a.statut = 'actif'
       GROUP BY o.categorie
       ORDER BY o.categorie`
    );

    return {
      total: total.rows[0].total,
      par_categorie: parCategorie.rows,
    };
  }
}

module.exports = Abonnement;
