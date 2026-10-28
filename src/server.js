//pour charger les varibales de .env 
require("dotenv").config();

//recup express, la config de la bd et le routes dans data...
const express = require("express");
const { errorHandler, notFound } = require("./middlewares/errorHandler");

const datacenterRoutes = require("./routes/datacenterRoutes");
const clientRoutes = require("./routes/clientRoutes");
const offreRoutes = require("./routes/offreRoutes");
const abonnementRoutes = require("./routes/abonnementRoutes");
// const serveurRoutes = require("./routes/serveurRoutes");
const ticketRoutes = require("./routes/ticketRoutes");
// const technicienRoutes = require("./routes/technicienRoutes");
const serveurRoutes = require("./routes/serveurRoutes");
// const ticketRoutes = require("./routes/ticketRoutes");
const technicienRoutes = require("./routes/technicienRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
// const dashboardRoutes = require("./routes/dashboardRoutes");

//creer le serveur 
const app = express();

//ppermet à express de lire les données envoyer au format JSON
app.use(express.json());

//prefix de chauqe requete  pour le groupe datacenterRoutes
app.use("/api/datacenters", datacenterRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/offres", offreRoutes);
app.use("/api/abonnements", abonnementRoutes);
// app.use("/api/serveurs", serveurRoutes);
app.use("/api/tickets", ticketRoutes);
// app.use("/api/techniciens", technicienRoutes);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ erreur: "Erreur serveur" });
});


app.listen(process.env.PORT, () => console.log(`API lancée sur http://localhost:${process.env.PORT}`));
