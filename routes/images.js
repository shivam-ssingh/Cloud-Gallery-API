const router = require("express").Router();
const authenticate = require("../auth/auth");
const optionalAuth = require("../auth/optionalAuth");
const imageController = require("../controllers/imageController");

router.post("/upload-url", authenticate, imageController.getUploadUrl);
router.post("/save", authenticate, imageController.saveImageMetadata);
// router.get("/folder/:slug", imageController.getImagesInFolder);
router.get("/folder/:slug", optionalAuth, imageController.getImagesInFolder);
module.exports = router;
