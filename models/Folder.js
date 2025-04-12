const mongoose = require("mongoose");

const folderSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  slug: { type: String, unique: true },
  is_public: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Folder", folderSchema);
