const pool = require("../config/db");

class Offre {
    // Liste des offres, avec des filtres facultatifs : categorie et en_vente (B2)
    static async findAll(filtres) {
        let sql = "SELECT * FROM offre WHERE 1 = 1";
        const valeurs = [];

        if (filtres.categorie) {
            valeurs.push(filtres.categorie);
            sql += " AND categorie = $" + valeurs.length;
        }

        // en_vente=true : seulement les offres en vente / en_vente=false : seulement les offres retirées
        if (filtres.en_vente === "true") {
            sql += " AND en_vente = true";
        }
        if (filtres.en_vente === "false") {
            sql += " AND en_vente = false";
        }

        sql += " ORDER BY id_offre";

        const { rows } = await pool.query(sql, valeurs);
        return rows;
    }

    static async findById(id) {
        const { rows } = await pool.query("SELECT * FROM offre WHERE id_offre = $1", [id]);
        return rows[0] ?? null;
    }

    static async create(data) {
        const { nom, categorie, prix_mensuel_ht } = data;
        const { rows } = await pool.query(
            "INSERT INTO offre (nom, categorie, prix_mensuel_ht) VALUES ($1, $2, $3) RETURNING *",
            [nom, categorie, prix_mensuel_ht]
        );
        return rows[0];
    }

    static async update(id, data) {
        const { nom, categorie, prix_mensuel_ht } = data;
        const { rows } = await pool.query(
            "UPDATE offre SET nom = $1, categorie = $2, prix_mensuel_ht = $3 WHERE id_offre = $4 RETURNING *",
            [nom, categorie, prix_mensuel_ht, id]
        );
        return rows[0] ?? null;
    }

    // RG2 : une offre n'est jamais supprimée, elle est retirée de la vente
    static async retirer(id) {
        const { rows } = await pool.query(
            "UPDATE offre SET en_vente = false WHERE id_offre = $1 RETURNING *",
            [id]
        );
        return rows[0] ?? null;
    }
}

module.exports = Offre;
