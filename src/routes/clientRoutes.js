const express = require("express");
const controller = require("../controllers/clientController");

const router = express.Router();

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.get("/:id/fiche", controller.getFiche);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
