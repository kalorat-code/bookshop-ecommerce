const MpesaId = require("../models/mpesa");
const User = require("../models/user");
const mpesa = require("./lipa");
const uuid = require("uuid");

require("dotenv").config();

exports.lipaNaMpesa = (req, res) => {
  let body = req.body;
  let id = uuid.v4();
  id = id.slice(0, 10);
  let user = User.findById(body.userId);
  let data = { user: body.userId, short_id: id };
  mpesa_id = new MpesaId(data);
  mpesa_id.save();
  mpesa.lipa_na_mpesa({
    consumer_key: process.env.MPESA_CONSUMER_KEY,
    consumer_secret: process.env.MPESA_CONSUMER_SECRET,
    short_code: process.env.BUSINESS_SHORTCODE,
    callback_url: "https://102f-105-160-85-191.ngrok.io/api/pay/mpesa/callback",
    phone: body.phone,
    amount: body.amount,
    passkey: process.env.MPESA_PASSKEY,
    reference: id,
  });
};

//callbackexport
exports.mpesaFeedback = (req, res) => {
  //
  let mpesa_feedback = req.body.Body;
  if (mpesa_feedback.ResultCode == 0) {
  }
  console.log(JSON.stringify(req.body.Body));

  console.log(req.body.Body.CallbackMetadata);

  res.json({
    ResponseCode: "0",
  });
};
