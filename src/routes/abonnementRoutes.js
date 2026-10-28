const express = require("express");
const controller = require("../controllers/abonnementController");

const router = express.Router();

router.post("/", controller.souscrire);                 
router.get("/:id", controller.getById);
router.patch("/:id/resiliation", controller.resilier);     

module.exports = router;
