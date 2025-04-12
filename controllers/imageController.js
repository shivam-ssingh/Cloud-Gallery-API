const { generateUploadUrl } = require("../utils/s3");
const { generateViewUrl } = require("../utils/s3");
const Image = require("../models/Image");
const Folder = require("../models/Folder");
const jwt = require("jsonwebtoken");

exports.getUploadUrl = async (req, res) => {
  const userId = req.user.id;
  const { folder_slug, filename } = req.body;

  if (!folder_slug || !filename) {
    return res.status(400).json({ error: "Missing folder_slug or filename" });
  }

  try {
    const folder = await Folder.findOne({ slug: folder_slug, user_id: userId });
    if (!folder) {
      return res
        .status(404)
        .json({ error: "Folder not found or unauthorized" });
    }

    const s3Key = `${userId}/${folder_slug}/${filename}`;
    const uploadUrl = await generateUploadUrl(s3Key);

    res.json({
      uploadUrl,
      key: s3Key,
      folder_id: folder._id,
    });
  } catch (err) {
    console.error("Presigned URL error:", err);
    res.status(500).json({ error: "Failed to generate upload URL" });
  }
};

exports.saveImageMetadata = async (req, res) => {
  const userId = req.user.id;
  const { folder_slug, key } = req.body;

  if (!folder_slug || !key) {
    return res.status(400).json({ error: "Missing folder_slug or key" });
  }

  try {
    const folder = await Folder.findOne({ slug: folder_slug, user_id: userId });
    if (!folder) {
      return res
        .status(404)
        .json({ error: "Folder not found or unauthorized" });
    }

    const image = await Image.create({
      folder_id: folder._id,
      s3_key: key,
    });

    res.status(201).json({
      id: image._id,
      folder_id: image.folder_id,
      key: image.s3_key,
    });
  } catch (err) {
    console.error("Save image metadata error:", err);
    res.status(500).json({ error: "Failed to save image" });
  }
};

exports.getImagesInFolder = async (req, res) => {
  const folderSlug = req.params.slug;
  const userId = req.user?.id ?? null;

  try {
    const folder = await Folder.findOne({ slug: folderSlug });
    if (!folder) return res.status(404).json({ error: "Folder not found" });

    const isAuthorized =
      folder.is_public || userId === folder.user_id.toString();

    if (!isAuthorized) {
      return res.status(403).json({ error: "Access denied" });
    }

    const images = await Image.find({ folder_id: folder._id });

    const signedImages = await Promise.all(
      images.map(async (img) => ({
        id: img._id,
        url: await generateViewUrl(img.s3_key),
        key: img.s3_key,
      }))
    );

    res.json({ images: signedImages });
  } catch (err) {
    console.error("Fetch images error:", err);
    res.status(500).json({ error: "Failed to fetch images" });
  }
};
