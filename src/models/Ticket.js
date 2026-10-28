const pool = require("../config/db");

class Ticket {
    static async findAll() {
        const { rows } = await pool.query("SELECT * FROM TICKET ORDER BY id_ticket");
        return rows;
    }

    static async findById(id) {
        const { rows } = await pool.query("SELECT * FROM TICKET WHERE id_ticket = $1", [id]);
        return rows[0] ?? null;
    }

    static async create(data) {
        const { sujet, id_client, id_serveur, date_ouverture, date_fermeture, priorite, statut } = data;
        const query = `INSERT INTO TICKET (sujet, id_client, id_serveur, date_ouverture, date_fermeture, priorite, statut) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`;
        const values = [sujet, id_client, id_serveur, date_ouverture, date_fermeture, priorite, statut];
        const { rows } = await pool.query(query, values);
        return rows[0] ?? null;
    }

    static async update(id, data) {
        const { sujet, id_client, id_serveur, date_ouverture, date_fermeture, priorite, statut } = data;
        const query = `UPDATE TICKET SET sujet = $1, id_client = $2, id_serveur = $3, date_ouverture = $4, date_fermeture = $5, priorite = $6, statut = $7 WHERE id_ticket = $8 RETURNING *`;
        const values = [sujet, id_client, id_serveur, date_ouverture, date_fermeture, priorite, statut, id];
        const { rows } = await pool.query(query, values);
        return rows[0] ?? null;
    }

    static async delete(id) {
        const query = `DELETE FROM TICKET WHERE id_ticket = $1 RETURNING *`;
        const values = [id];
        const { rows } = await pool.query(query, values);
        return rows[0] ?? null;
    }
    
}
module.exports = Ticket;
