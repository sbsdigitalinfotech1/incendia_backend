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

// admin product 
router.post("/admin/addProduct", AdminController.addProduct);

// admin variant 
router.post("/admin/addVariant", AdminController.addVariant);

// admin category 
router.get("/admin/getCategory", AdminController.getCategory);
router.post("/admin/addCategory", AdminController.addCategory);

// admin product type 
router.get("/admin/getProductType", AdminController.getProductType);
router.post("/admin/addProductType", AdminController.addProductType);

// admin subcategory 
router.get("/admin/getSubCategory", AdminController.getSubCategory);
router.post("/admin/addSubCategory", AdminController.addSubCategory);

//EXPORT THE ROUTER HERE
module.exports = router;
