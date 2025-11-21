const router = require("express").Router();
const ctrl = require("../controllers/coding.controller");

router.post("/run", ctrl.runCode);

module.exports = router;
