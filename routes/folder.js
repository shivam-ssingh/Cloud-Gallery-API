const router = require("express").Router();
const authenticate = require("../auth/auth");
const folderController = require("../controllers/folderController");

router.post("/", authenticate, folderController.createFolder);
router.get("/", authenticate, folderController.getUserFolders);
router.get(
  "/:slug/metadata",
  require("../controllers/folderController").getFolderMetadata
);

module.exports = router;
