const router = require("express").Router();
const ctrl = require("../controllers/interview.controller");

router.post("/ask", ctrl.askQuestion);

module.exports = router;
