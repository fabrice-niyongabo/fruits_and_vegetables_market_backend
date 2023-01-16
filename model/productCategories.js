const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  createdAt: { type: String, default: new Date() },
});

module.exports = mongoose.model("productCategories", userSchema);
