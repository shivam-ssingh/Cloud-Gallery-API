const { v4: uuidv4 } = require("uuid");
const Folder = require("../models/Folder");

exports.createFolder = async (req, res) => {
  const userId = req.user.id;
  const { name, is_public = false } = req.body;

  if (!name) return res.status(400).json({ error: "Folder name is required" });

  const slug = `${name.toLowerCase().replace(/\s+/g, "-")}-${uuidv4().slice(
    0,
    6
  )}`;

  try {
    const folder = await Folder.create({
      user_id: userId,
      name,
      slug,
      is_public,
    });

    res.status(201).json({
      id: folder._id,
      name: folder.name,
      slug: folder.slug,
      is_public: folder.is_public,
      user_id: folder.user_id,
    });
  } catch (err) {
    console.error("Folder creation error:", err);
    res.status(500).json({ error: "Failed to create folder" });
  }
};

exports.getUserFolders = async (req, res) => {
  const userId = req.user.id;

  try {
    const folders = await Folder.find({ user_id: userId }).sort({
      created_at: -1,
    });

    res.json({
      folders: folders.map((folder) => ({
        id: folder._id,
        name: folder.name,
        slug: folder.slug,
        is_public: folder.is_public,
        created_at: folder.created_at,
      })),
    });
  } catch (err) {
    console.error("Fetch folders error:", err);
    res.status(500).json({ error: "Failed to fetch folders" });
  }
};
