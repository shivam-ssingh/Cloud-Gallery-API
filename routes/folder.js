const router = require("express").Router();
const authenticate = require("../auth/auth");
const folderController = require("../controllers/folderController");

router.post("/", authenticate, folderController.createFolder);
router.get("/", authenticate, folderController.getUserFolders);

module.exports = router;
