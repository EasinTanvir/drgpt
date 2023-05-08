const mongoose = require("mongoose");

const message = new mongoose.Schema({
  gpt: { type: String, required: true },
  user: { type: String, required: true },
  userId: { type: String },
});

module.exports = mongoose.model("message", message);
