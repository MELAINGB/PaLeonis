const pool = require("../config/db");

class Offre {
    static async findAll() {
        const { rows } = await pool.query("SELECT * FROM OFFRE ORDER BY id_offre");
        return rows;
    }

    static async findById(id) {
        const { rows } = await pool.query("SELECT * FROM OFFRE WHERE id_offre = $1", [id]);
        return rows[0] ?? null;
    }

    static async create(data){
        const { nom, type, prix, description } = data;
        const { rows } = await pool.query(
            "INSERT INTO OFFRE (nom, type, prix, description) VALUES ($1, $2, $3, $4) RETURNING *",
            [nom, type, prix, description]
        );
        return rows[0];
    }
}

module.exports = Offre;