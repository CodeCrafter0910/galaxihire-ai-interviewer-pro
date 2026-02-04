const router = require("express").Router();
const auth = require("../middleware/auth");
const ctrl = require("../controllers/report.controller.js");

// Generate report from interview session
router.post("/generate", auth, ctrl.generateAndSave);

// Get all user reports
router.get("/list", auth, ctrl.getUserReports);

// Download report (must be before /:id)
router.get("/download/:id", auth, ctrl.download);

// Get specific report
router.get("/:id", auth, ctrl.getReport);

module.exports = router;
