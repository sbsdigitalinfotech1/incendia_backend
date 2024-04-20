var express = require("express");
var router = express.Router();
const UserAuthController = require('../../controllers/user/authenticationController');

router.get("/", function (req, res, next) {
  res.send("Welcome to Incendia v1 APIs...");
});

// authentication user 

router.get("/user/login", UserAuthController.Login);

//EXPORT THE ROUTER HERE
module.exports = router;
