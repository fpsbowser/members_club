const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstname: { type: String },
  lastname: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
  ismember: { type: Boolean },
  isadmin: { type: Boolean },
});

module.exports = mongoose.model("User", UserSchema);
