const express = require("express");
const authController = require("../controllers/auth");
const { signupValidator, loginValidator } = require("../validators/auth");
const validate = require("../middleware/validate");
const router = express.Router();

router.post("/signup", signupValidator, validate, authController.signup);
router.post("/login", loginValidator, validate, authController.login);

module.exports = router;
