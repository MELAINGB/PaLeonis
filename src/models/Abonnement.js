const pool = require("../config/db");
const { HttpError } = require("../middlewares/errorHandler");

const SELECT_ABONNEMENT = `
  SELECT a.id_abonnement, a.date_debut, a.date_fin, a.statut,
         a.prix_applique::float AS prix_applique,
         a.id_client, a.id_offre, o.nom AS offre, o.categorie,
         s.id_serveur, s.nom_hote, host(s.adresse_ip) AS adresse_ip,
         d.id_datacenter, d.nom AS datacenter
  FROM abonnement a
  JOIN offre o           ON o.id_offre = a.id_offre
  LEFT JOIN serveur s    ON s.id_abonnement = a.id_abonnement
  LEFT JOIN datacenter d ON d.id_datacenter = s.id_datacenter`;

class Abonnement {
  static async findById(id, conn = pool) {
    const { rows } = await conn.query(`${SELECT_ABONNEMENT} WHERE a.id_abonnement = $1`, [id]);
    return rows[0] ?? null;
  }

  static async findByClient(idClient) {
    const { rows } = await pool.query(
      `${SELECT_ABONNEMENT} WHERE a.id_client = $1 ORDER BY a.date_debut DESC, a.id_abonnement DESC`,
      [idClient]
    );
    return rows;
  }

  static async souscrire({ id_client, id_offre, id_datacenter }) {
    const conn = await pool.connect();
    try {
      await conn.query("BEGIN");

      const client = await conn.query("SELECT id_client FROM client WHERE id_client = $1", [id_client]);
      if (client.rowCount === 0) throw new HttpError(404, "CLIENT_INTROUVABLE", "Client introuvable");

      const offreRes = await conn.query(
        "SELECT id_offre, categorie, prix_mensuel_ht, en_vente FROM offre WHERE id_offre = $1",
        [id_offre]
      );
      const offre = offreRes.rows[0];
      if (!offre) throw new HttpError(404, "OFFRE_INTROUVABLE", "Offre introuvable");
      if (!offre.en_vente) throw new HttpError(422, "OFFRE_RETIREE", "Cette offre n'est plus en vente");

      const hebergement = offre.categorie !== "domaine";
      if (hebergement && id_datacenter == null) {
        throw new HttpError(422, "DATACENTER_REQUIS", "Un id_datacenter est obligatoire pour un hébergement");
      }

      const insert = await conn.query(
        `INSERT INTO abonnement (id_client, id_offre, prix_applique)
         VALUES ($1, $2, $3)
         RETURNING id_abonnement`,
        [id_client, id_offre, offre.prix_mensuel_ht]
      );
      const idAbonnement = insert.rows[0].id_abonnement;

      if (hebergement) {
        const dc = await conn.query("SELECT id_datacenter FROM datacenter WHERE id_datacenter = $1", [id_datacenter]);
        if (dc.rowCount === 0) throw new HttpError(404, "DATACENTER_INTROUVABLE", "Datacenter introuvable");

        const libre = await conn.query(
          `SELECT id_serveur
           FROM serveur
           WHERE id_datacenter = $1
             AND statut = 'en_service'
             AND id_abonnement IS NULL
           ORDER BY id_serveur
           LIMIT 1
           FOR UPDATE SKIP LOCKED`,
          [id_datacenter]
        );
        if (libre.rowCount === 0) {
          throw new HttpError(409, "AUCUN_SERVEUR_LIBRE", "Aucun serveur libre en service dans ce datacenter");
        }

        await conn.query("UPDATE serveur SET id_abonnement = $1 WHERE id_serveur = $2", [
          idAbonnement,
          libre.rows[0].id_serveur,
        ]);
      }

      const abonnement = await Abonnement.findById(idAbonnement, conn);
      await conn.query("COMMIT");
      return abonnement;
    } catch (err) {
      await conn.query("ROLLBACK");
      throw err;
    } finally {
      conn.release();
    }
  }

  static async resilier(id) {
    const conn = await pool.connect();
    try {
      await conn.query("BEGIN");

      const actuel = await conn.query(
        "SELECT statut FROM abonnement WHERE id_abonnement = $1 FOR UPDATE",
        [id]
      );
      if (actuel.rowCount === 0) throw new HttpError(404, "ABONNEMENT_INTROUVABLE", "Abonnement introuvable");
      if (actuel.rows[0].statut === "resilie") {
        throw new HttpError(409, "DEJA_RESILIE", "Cet abonnement est déjà résilié");
      }

      await conn.query(
        `UPDATE abonnement
         SET statut = 'resilie', date_fin = GREATEST(CURRENT_DATE, date_debut)
         WHERE id_abonnement = $1`,
        [id]
      );

      const serveur = await conn.query(
        `UPDATE serveur SET id_abonnement = NULL
         WHERE id_abonnement = $1
         RETURNING id_serveur, nom_hote`,
        [id]
      );

      const abonnement = await Abonnement.findById(id, conn);
      await conn.query("COMMIT");
      return { ...abonnement, serveur_libere: serveur.rows[0] ?? null };
    } catch (err) {
      await conn.query("ROLLBACK");
      throw err;
    } finally {
      conn.release();
    }
  }

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