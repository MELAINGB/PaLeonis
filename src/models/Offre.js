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
}

module.exports = Offre;