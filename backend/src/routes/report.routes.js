const router = require("express").Router();
const ctrl = require("../controllers/report.controller");

router.post("/generate", ctrl.generateAndSave);
router.get("/:id", ctrl.getReport);
router.get("/download/:id", ctrl.download);

module.exports = router;
