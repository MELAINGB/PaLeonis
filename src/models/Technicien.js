const pool = require("../config/db");

class Technicien {
  static async findAll() {
    const { rows } = await pool.query("SELECT * FROM technicien ORDER BY nom");
    return rows;
  }

  static async findById(id) {
    const { rows } = await pool.query("SELECT * FROM technicien WHERE id_technicien = $1", [id]);
    return rows[0];
  }
}

module.exports = Technicien;
