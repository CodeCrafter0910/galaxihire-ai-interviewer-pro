const router = require("express").Router();

// Linux requires exact filename + .js
const ctrl = require("../controllers/coding.controller.js");

router.post("/run", ctrl.runCode);

module.exports = router;
