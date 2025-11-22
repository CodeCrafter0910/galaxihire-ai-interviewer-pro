const router = require("express").Router();

// MUST include .js for Linux servers
const ctrl = require("../controllers/report.controller.js");

// Route order matters ✔️
router.post("/generate", ctrl.generateAndSave);

// Put "download" BEFORE "/:id" so it doesn't get swallowed
router.get("/download/:id", ctrl.download);

// Normal fetch report
router.get("/:id", ctrl.getReport);

module.exports = router;
