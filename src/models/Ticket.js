const pool = require("../config/db");
const { HttpError } = require("../middlewares/errorHandler");

class Ticket {
    static async findAll() {
        const { rows } = await pool.query("SELECT * FROM ticket ORDER BY id_ticket");
        return rows;
    }

    static async findById(id) {
        const { rows } = await pool.query("SELECT * FROM ticket WHERE id_ticket = $1", [id]);
        return rows[0] ?? null;
    }

    // B7 : ouvrir un ticket. date_ouverture, priorite et statut ont une valeur par défaut dans la base
    static async create(data) {
        const { id_client, id_serveur, sujet, description, priorite } = data;

        // RG6 : si un serveur est donné, il doit appartenir au client
        if (id_serveur) {
            const verif = await pool.query(
                `SELECT s.id_serveur FROM serveur s
                 JOIN abonnement a ON a.id_abonnement = s.id_abonnement
                 WHERE s.id_serveur = $1 AND a.id_client = $2`,
                [id_serveur, id_client]
            );
            if (verif.rows.length === 0) throw new HttpError(422, "Ce serveur n'appartient pas à ce client");
        }

        const { rows } = await pool.query(
            `INSERT INTO ticket (id_client, id_serveur, sujet, description, priorite)
             VALUES ($1, $2, $3, $4, COALESCE($5, 'normale'))
             RETURNING *`,
            [id_client, id_serveur || null, sujet, description, priorite || null]
        );
        return rows[0];
    }

    // B7 : assigner le ticket à un technicien (RG7 : un seul technicien au plus)
    static async assigner(id, idTechnicien) {
        const { rows } = await pool.query(
            "UPDATE ticket SET id_technicien = $1 WHERE id_ticket = $2 RETURNING *",
            [idTechnicien, id]
        );
        return rows[0] ?? null;
    }

    // B7 : faire évoluer le statut (ouvert, en_cours, resolu, ferme)
    static async changerStatut(id, statut) {
        const { rows } = await pool.query(
            "UPDATE ticket SET statut = $1 WHERE id_ticket = $2 RETURNING *",
            [statut, id]
        );
        return rows[0] ?? null;
    }

    // B8 : tickets non fermés d'un technicien, du plus critique au moins critique
    static async findByTechnicien(idTechnicien) {
        const { rows } = await pool.query(
            `SELECT * FROM ticket
             WHERE id_technicien = $1 AND statut <> 'ferme'
             ORDER BY CASE priorite
                        WHEN 'critique' THEN 1
                        WHEN 'haute' THEN 2
                        WHEN 'normale' THEN 3
                        ELSE 4
                      END,
                      date_ouverture`,
            [idTechnicien]
        );
        return rows;
    }

    static async delete(id) {
        const query = `DELETE FROM ticket WHERE id_ticket = $1 RETURNING *`;
        const values = [id];
        const { rows } = await pool.query(query, values);
        return rows[0] ?? null;
    }
}
module.exports = Ticket;
