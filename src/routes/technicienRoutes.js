const express = require("express");
const controller = require("../controllers/technicienController");
const ticketController = require("../controllers/ticketController");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
// B8 : tickets non fermés du technicien, du plus critique au moins critique
router.get("/:id/tickets", ticketController.getByTechnicien);

module.exports = router;
