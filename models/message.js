const mongoose = require("mongoose");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true },
  owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

MessageSchema.virtual("format_timestamp").get(function () {
  return DateTime.fromJSDate(this.timestamp).toISODate();
});

module.exports = mongoose.model("Message", MessageSchema);
