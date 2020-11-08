const express = require("express");

const router = express.Router();

//import from controllers
const { register, login } = require("../controllers/auth");

//import from validators
const {
  userRegistrationValidator,
  userLoginValidator,
} = require("../validators/auth");
const { runValidation } = require("../validators");

//routes
router.post("/register", userRegistrationValidator, runValidation, register);

router.post("/login", userLoginValidator, runValidation, login);

module.exports = router;
