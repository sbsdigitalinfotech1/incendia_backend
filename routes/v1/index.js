var express = require("express");
var router = express.Router();
const UserAuthController = require("../../controllers/user/authenticationController");
const UserProfileController = require("../../controllers/user/profileController");
const UserProductController = require("../../controllers/user/productController");
const CartController = require("../../controllers/user/cartController");
const OrderController = require("../../controllers/user/orderController");
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


// user profiles 

// user address 

router.get("/user/getAddress", UserProfileController.getAddress);
router.post("/user/addAddress", UserProfileController.addAddress);
router.patch("/user/updateAddress", UserProfileController.updateAddress);

// user favourite 

router.get("/user/getFavourite", UserProfileController.getFavourite);
router.patch("/user/updateFavourite", UserProfileController.updateFavourite);

// user products 

router.get("/user/getProducts", UserProductController.getProducts);
router.get("/user/getProductsFiltered", UserProductController.getProductsFiltered);
router.get("/user/getAvailableColorsAndSizes", UserProductController.getAvailableColorsAndSizes);

// user cart 

router.post("/user/addToCart", CartController.addToCart);
router.post("/user/removeFromCart", CartController.removeFromCart);
router.patch("/user/updateCart", CartController.updateCart);
router.get("/user/getCart", CartController.getCart);

// user Orders 

router.post("/user/makeOrder", OrderController.makeOrder);
router.patch("/user/updatePaymentStatus", OrderController.updatePaymentStatus);
router.get("/user/getOrders", OrderController.getOrders);


// admin api's

router.post("/admin/uploadMedia", AdminController.uploadUserMedia);
router.post("/admin/login", AdminAuthController.Login);
router.post("/admin/register", AdminAuthController.Register);
router.post("/admin/verifyAccount", AdminAuthController.verifyAccount);

// admin product 
router.get("/admin/getProducts", AdminController.getProducts);
router.post("/admin/addProduct", AdminController.addProduct);
router.patch("/admin/updateProduct", AdminController.updateProduct);

// admin variant 
router.get("/admin/getVariants", AdminController.getVariant);
router.post("/admin/addVariant", AdminController.addVariant);
router.patch("/admin/updateVariant", AdminController.updateVariant);

// admin category 
router.get("/admin/getCategory", AdminController.getCategory);
router.post("/admin/addCategory", AdminController.addCategory);
router.patch("/admin/updateCategory", AdminController.updateCategory);

// admin product type 
router.get("/admin/getProductType", AdminController.getProductType);
router.post("/admin/addProductType", AdminController.addProductType);
router.patch("/admin/updateProductType", AdminController.updateProductType);

// admin subcategory 
router.get("/admin/getSubCategory", AdminController.getSubCategory);
router.post("/admin/addSubCategory", AdminController.addSubCategory);
router.patch("/admin/updateSubCategory", AdminController.updateSubCategory);

//EXPORT THE ROUTER HERE
module.exports = router;
