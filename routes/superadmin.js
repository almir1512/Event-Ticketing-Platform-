const express = require("express");
const router = express.Router();
const { verifyUser } = require("../middleware/is-auth");
const authorizeRoles = require("../middleware/authorizeRoles");
const superAdminController = require("../controllers/superadmin");

router.post(
  "/update-role",
  verifyUser,
  authorizeRoles(["superadmin"]),
  superAdminController.updateUserRole
);

module.exports = router;
