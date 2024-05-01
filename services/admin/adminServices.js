const Product = require("../../models").product;
const Variant = require("../../models").variant;
const uploadFile = require("../../utils/image_upload");

module.exports = {
  uploadUserMedia,
  addProduct,
  addVariant
};

function uploadUserMedia(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      var file = req.files;

      if (file.image !== undefined) {
        const media=await uploadFile.uploadOnServer(file.image, `/user`, "hdship");
        console.log(media,"file uploaded");
        return resolve("file uploaded successfully");
      } else {
        console.log("no file found");
        return resolve("file not uploaded");
      }
    } catch (err) {
      return reject("error");
    }
  });
}


function addProduct(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;

      if (!body.name) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_PRODUCT_NAME,
        });
      }
      if (!body.productTypeId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_PRODUCT_TYPE,
        });
      }
      if (!body.categoryId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_PRODUCT_CATEGORY,
        });
      }
      if (!body.subCategoryId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_PRODUCT_SUBCATEGORY,
        });
      }
      if (!body.productHighlight) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_PRODUCT_HIGHLIGHTS,
        });
      }
      if (!body.productsDescription) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_PRODUCT_DESCRIPTION,
        });
      }
  
      var [err, product] = await to(
        Product.create({
          ...body
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }

      if(!product){
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: 'not added',
        });
      }

      return resolve("added successfully");
      
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}
function addVariant(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;

      if (!body.name) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_PRODUCT_NAME,
        });
      }
      if (!body.color) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_COLOR,
        });
      }
      if (!body.size) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_SIZE,
        });
      }
      if (!body.price) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_PRICE,
        });
      }
      if (!body.mrp) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_MRP,
        });
      }
  
      var [err, variant] = await to(
        Variant.create({
          ...body
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }

      if(!variant){
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: 'not added',
        });
      }

      return resolve("added successfully");
      
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}

