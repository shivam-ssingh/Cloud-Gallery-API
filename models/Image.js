const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  folder_id: { type: mongoose.Schema.Types.ObjectId, ref: "Folder" },
  s3_key: String,
  uploaded_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Image", imageSchema);
