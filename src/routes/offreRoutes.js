const express = require("express");
const controller = require("../controllers/offreController");

const router = express.Router();
router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.patch("/:id/retrait", controller.retirer);

module.exports = router;
