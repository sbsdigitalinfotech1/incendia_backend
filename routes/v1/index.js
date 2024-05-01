var express = require("express");
var router = express.Router();
const UserAuthController = require("../../controllers/user/authenticationController");
const UserController = require("../../controllers/user/userController");
const AdminAuthController = require("../../controllers/admin/authenticationController");
const AdminController = require("../../controllers/admin/adminController");

router.get("/", function (req, res, next) {
  res.send("Welcome to Incendia v1 APIs...");
});

// authentication user


router.get("/user/generateGuestId", UserAuthController.generateGuestId);
router.post("/user/login", UserAuthController.Login);
router.post("/user/register", UserAuthController.Register);
router.post("/user/sendOTP", UserAuthController.SendOTP);
router.post("/user/verifyRegistration", UserAuthController.verifyRegistration);
router.post("/user/verifyOTP", UserAuthController.verifyOTP);
router.post("/user/resetPassword", UserAuthController.resetPassword);





// admin api's 

router.post("/admin/uploadMedia", AdminController.uploadUserMedia);
router.post("/admin/login", AdminAuthController.Login);
router.post("/admin/register", AdminAuthController.Register);
router.post("/admin/verifyAccount", AdminAuthController.verifyAccount);
router.post("/admin/addProduct", AdminController.addProduct);
router.post("/admin/addVariant", AdminController.addVariant);


//EXPORT THE ROUTER HERE
module.exports = router;
