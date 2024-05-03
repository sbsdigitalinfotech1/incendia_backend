const Product = require("../../models").product;
const Variant = require("../../models").variant;
const Category = require("../../models").category;
const ProductType = require("../../models").productType;
const SubCategory = require("../../models").subCategory;
const uploadFile = require("../../utils/image_upload");

module.exports = {
  uploadUserMedia,
  addProduct,
  addVariant,
  addCategory,
  addProductType,
  addSubCategory,
  getProductType,
  getCategory,
  getSubCategory
};

function uploadUserMedia(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      var file = req.files;

      if (file.image !== undefined) {
        const media = await uploadFile.uploadOnServer(
          file.image,
          `/user`,
          "hdship"
        );
        console.log(media, "file uploaded");
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
          message: CONFIG.ERROR_MISSING_PRODUCT_TYPE_ID,
        });
      }
      if (!body.categoryId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_PRODUCT_CATEGORY_ID,
        });
      }
      if (!body.subCategoryId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_PRODUCT_SUBCATEGORY_ID,
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
          ...body,
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }

      if (!product) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: "not added",
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
          message: CONFIG.ERROR_MISSING_VARIANT_NAME,
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
      if (!body.productId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_PRODUCT_ID,
        });
      }

      var [err, variant] = await to(
        Variant.create({
          ...body,
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }

      if (!variant) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: "not added",
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

function addCategory(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;

      if (!body.name) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_NAME,
        });
      }
      if (!body.productTypeId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_PRODUCT_TYPE_ID,
        });
      }

      var [err, category] = await to(
        Category.create({
          ...body,
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }

      if (!category) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: "not added",
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
function addSubCategory(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;

      if (!body.name) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_NAME,
        });
      }
      if (!body.categoryId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_PRODUCT_CATEGORY_ID,
        });
      }

      var [err, subCategory] = await to(
        SubCategory.create({
          ...body,
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }

      if (!subCategory) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: "not added",
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
function addProductType(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;

      if (!body.name) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_NAME,
        });
      }

      var [err, productType] = await to(
        ProductType.create({
          ...body,
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }

      if (!productType) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: "not added",
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


// get requests 

function getProductType(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.query;
      var whereCluse = {};
      whereCluse[Op.and] = [];

      if (body.id) {
        whereCluse[Op.and].push({id: body.id});
      }


      whereCluse[Op.and].push({status: CONFIG.ACTIVE_RECORD});
  
      var [err, productType] = await to(
        ProductType.findAndCountAll({
          where: whereCluse
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }

      if (!productType) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.MESS_INTERNAL_SERVER_ERROR
        });
      }

      return resolve(productType);
      
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}
function getCategory(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.query;
      var whereCluse = {};
      whereCluse[Op.and] = [];

      if (body.id) {
        whereCluse[Op.and].push({id: body.id});
      }

      if (body.productTypeId) {
        whereCluse[Op.and].push({productTypeId: body.productTypeId});
      }


      whereCluse[Op.and].push({status: CONFIG.ACTIVE_RECORD});
  
      var [err, category] = await to(
        Category.findAndCountAll({
          where: whereCluse
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }

      if (!category) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.MESS_INTERNAL_SERVER_ERROR
        });
      }

      return resolve(category);
      
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}
function getSubCategory(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.query;
      var whereCluse = {};
      whereCluse[Op.and] = [];

      if (body.id) {
        whereCluse[Op.and].push({id: body.id});
      }

      if (body.categoryId) {
        whereCluse[Op.and].push({categoryId: body.categoryId});
      }


      whereCluse[Op.and].push({status: CONFIG.ACTIVE_RECORD});
  
      var [err, subCategory] = await to(
        SubCategory.findAndCountAll({
          where: whereCluse
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }

      if (!subCategory) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.MESS_INTERNAL_SERVER_ERROR
        });
      }

      return resolve(subCategory);
      
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}
function getProducts(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.query;
      var whereCluse = {};
      whereCluse[Op.and] = [];

      if (body.id) {
        whereCluse[Op.and].push({id: body.id});
      }

      if (body.categoryId) {
        whereCluse[Op.and].push({categoryId: body.categoryId});
      }


      whereCluse[Op.and].push({status: CONFIG.ACTIVE_RECORD});
  
      var [err, subCategory] = await to(
        SubCategory.findAndCountAll({
          where: whereCluse
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }

      if (!subCategory) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.MESS_INTERNAL_SERVER_ERROR
        });
      }

      return resolve(subCategory);
      
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}
