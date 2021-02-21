const mongoose = require("mongoose");

const subscribeSchema = mongoose.Schema({
  subject: {type: String, requied: true},
  content : {type: String, requied: true},
  imagePath: { type: String, required: true}
});

module.exports = mongoose.model("Subscribe", subscribeSchema);
