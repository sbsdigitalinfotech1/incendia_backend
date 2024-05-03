const AdminServices = require("../../services/admin/adminServices");

module.exports = {
  uploadUserMedia,
  addProduct,
  addVariant,
  addCategory,
  addProductType,
  addSubCategory,
  getProductType,
  getCategory,
};

function uploadUserMedia(req, res) {
  AdminServices.uploadUserMedia(req, res)
    .then((result) => {
      return ReS(res, { data: result }, CONFIG.STATUS_CODE_OK);
    })
    .catch((error) => {
      return ReE(
        res,
        { message: error.message == undefined ? error : error.message },
        error.statusCode == undefined ? CONFIG.ERROR_CODE : error.statusCode
      );
    });
}
function addProduct(req, res) {
  AdminServices.addProduct(req, res)
    .then((result) => {
      return ReS(res, { data: result }, CONFIG.STATUS_CODE_OK);
    })
    .catch((error) => {
      return ReE(
        res,
        { message: error.message == undefined ? error : error.message },
        error.statusCode == undefined ? CONFIG.ERROR_CODE : error.statusCode
      );
    });
}
function addVariant(req, res) {
  AdminServices.addVariant(req, res)
    .then((result) => {
      return ReS(res, { data: result }, CONFIG.STATUS_CODE_OK);
    })
    .catch((error) => {
      return ReE(
        res,
        { message: error.message == undefined ? error : error.message },
        error.statusCode == undefined ? CONFIG.ERROR_CODE : error.statusCode
      );
    });
}
function addCategory(req, res) {
  AdminServices.addCategory(req, res)
    .then((result) => {
      return ReS(res, { data: result }, CONFIG.STATUS_CODE_OK);
    })
    .catch((error) => {
      return ReE(
        res,
        { message: error.message == undefined ? error : error.message },
        error.statusCode == undefined ? CONFIG.ERROR_CODE : error.statusCode
      );
    });
}
function addProductType(req, res) {
  AdminServices.addProductType(req, res)
    .then((result) => {
      return ReS(res, { data: result }, CONFIG.STATUS_CODE_OK);
    })
    .catch((error) => {
      return ReE(
        res,
        { message: error.message == undefined ? error : error.message },
        error.statusCode == undefined ? CONFIG.ERROR_CODE : error.statusCode
      );
    });
}
function addSubCategory(req, res) {
  AdminServices.addSubCategory(req, res)
    .then((result) => {
      return ReS(res, { data: result }, CONFIG.STATUS_CODE_OK);
    })
    .catch((error) => {
      return ReE(
        res,
        { message: error.message == undefined ? error : error.message },
        error.statusCode == undefined ? CONFIG.ERROR_CODE : error.statusCode
      );
    });
}



// get requests 

function getProductType(req, res) {
  AdminServices.getProductType(req, res)
    .then((result) => {
      return ReS(res, { data: result }, CONFIG.STATUS_CODE_OK);
    })
    .catch((error) => {
      return ReE(
        res,
        { message: error.message == undefined ? error : error.message },
        error.statusCode == undefined ? CONFIG.ERROR_CODE : error.statusCode
      );
    });
}
function getCategory(req, res) {
  AdminServices.getCategory(req, res)
    .then((result) => {
      return ReS(res, { data: result }, CONFIG.STATUS_CODE_OK);
    })
    .catch((error) => {
      return ReE(
        res,
        { message: error.message == undefined ? error : error.message },
        error.statusCode == undefined ? CONFIG.ERROR_CODE : error.statusCode
      );
    });
}