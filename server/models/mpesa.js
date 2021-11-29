const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const mpesa_id_schema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User" },
    short_id: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("MpesaId", mpesa_id_schema);
