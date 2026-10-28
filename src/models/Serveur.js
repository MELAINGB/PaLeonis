const pool = require("../config/db");

class Serveur {
  // Liste des serveurs, avec des filtres facultatifs : datacenter, statut, libre
  static async findAll(filtres) {
    let sql = "SELECT * FROM serveur WHERE 1 = 1";
    const valeurs = [];

    if (filtres.datacenter) {
      valeurs.push(filtres.datacenter);
      sql += " AND id_datacenter = $" + valeurs.length;
    }

    if (filtres.statut) {
      valeurs.push(filtres.statut);
      sql += " AND statut = $" + valeurs.length;
    }

    // libre=true : pas d'abonnement / libre=false : attribué à un abonnement
    if (filtres.libre === "true") {
      sql += " AND id_abonnement IS NULL";
    }
    if (filtres.libre === "false") {
      sql += " AND id_abonnement IS NOT NULL";
    }

    sql += " ORDER BY nom_hote";

    const { rows } = await pool.query(sql, valeurs);
    return rows;
  }

  static async findById(id) {
    const { rows } = await pool.query("SELECT * FROM serveur WHERE id_serveur = $1", [id]);
    return rows[0];
  }
}

module.exports = Serveur;
