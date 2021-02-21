const mongoose = require("mongoose");

const subscriberSchema = mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true }
});

module.exports = mongoose.model("Subscriber", subscriberSchema);
