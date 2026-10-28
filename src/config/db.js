const { Pool, types } = require("pg");

// Les dates (DATE) restent en texte "2024-01-15", sinon elles sont décalées d'un jour à cause du fuseau horaire
types.setTypeParser(1082, (valeur) => valeur);
// Les prix (NUMERIC) arrivent en nombre et pas en texte
types.setTypeParser(1700, (valeur) => Number(valeur));

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

module.exports = pool;
