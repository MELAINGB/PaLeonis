require("dotenv").config();
const express = require("express");
const pool = require("./config/db");
const datacenterRoutes = require("./routes/datacenterRoutes");

const app = express();
app.use(express.json());

app.use("/api/datacenters", datacenterRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erreur: "Erreur serveur" });
});

pool.query("SELECT NOW()")
  .then(() => console.log("Connecté à PostgreSQL"))
  .catch((err) => console.error("Connexion BDD impossible :", err.message));

app.listen(process.env.PORT, () => console.log(`API lancée sur http://localhost:${process.env.PORT}`));
