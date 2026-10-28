//pour charger les varibales de .env 
require("dotenv").config();

//recup express, la config de la bd et le routes dans data...
const express = require("express");
const datacenterRoutes = require("./routes/datacenterRoutes");
const clientRoutes = require("./routes/clientRoutes");
const offreRoutes = require("./routes/offreRoutes");
// const abonnementRoutes = require("./routes/abonnementRoutes");
const serveurRoutes = require("./routes/serveurRoutes");
// const ticketRoutes = require("./routes/ticketRoutes");
const technicienRoutes = require("./routes/technicienRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

//creer le serveur 
const app = express();

//ppermet à express de lire les données envoyer au format JSON
app.use(express.json());

//prefix de chauqe requete  pour le groupe datacenterRoutes
app.use("/api/datacenters", datacenterRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/offres", offreRoutes);
// app.use("/api/abonnements", abonnementRoutes);
app.use("/api/serveurs", serveurRoutes);
// app.use("/api/tickets", ticketRoutes);
app.use("/api/techniciens", technicienRoutes);
app.use("/api/dashboard", dashboardRoutes);

//dans le cas ou aucune route ne corresp
app.use((req, res) => {
  res.status(404).json({ erreur : "route introuvable" });
});
//
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") return res.status(400).json({ erreur: "JSON invalide" });
  if (err.code === "22P02") return res.status(400).json({ erreur: "Format invalide" });
  if (err.code === "23502") return res.status(400).json({ erreur: "Champ obligatoire manquant" });
  if (err.code === "23505") return res.status(409).json({ erreur: "Cette valeur existe déjà" });
  
  //ce code peut provoquer deux erreurs (suppression d'une ressource existante ou la ref n'existe pas )
  if (err.code === "23503") {
    if (req.method === "DELETE") return res.status(409).json({ erreur: "Impossible de supprimer la ressource, elle est encore utilisée" });
    else return res.status(404).json({ erreur: "Référence inexistante" });
  }

  //non respect du check 
  if (err.code === "23514") return res.status(422).json({ erreur: "Valeur non autorisée" });
  console.error(err);
  res.status(500).json({ erreur: "Erreur serveur" });
});


app.listen(process.env.PORT, () => console.log(`API lancée sur http://localhost:${process.env.PORT}`));