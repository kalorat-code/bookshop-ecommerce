const express = require("express");

const router = express.Router();

//middleware
const { requireSignin, isAuth } = require("../controllers/auth");
const { lipaNaMpesa, mpesaFeedback } = require("../controllers/mpesa");

router.post("/mpesa", lipaNaMpesa);
router.post("/mpesa/callback", mpesaFeedback);
module.exports = router;
