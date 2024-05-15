const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Product = require("../../models").product;
const Variant = require("../../models").variant;
const Category = require("../../models").category;
const ProductType = require("../../models").productType;
const SubCategory = require("../../models").subCategory;
const ProductPhotos = require("../../models").productPhotos;
const uploadFile = require("../../utils/image_upload");
const path = require("path");
const fs = require("fs");

module.exports = {
  uploadUserMedia,
  addProduct,
  addVariant,
  addCategory,
  addProductType,
  addSubCategory,
  getProductType,
  getCategory,
  getSubCategory,
  getProducts,
  getVariant,
  updateProduct,
  updateVariant,
  updateCategory,
  updateProductType,
  updateSubCategory,
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
      if (!body.otherDescription) {
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
      if (!body.stock) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_STOCK,
        });
      }
      if (!req.files.main) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_MAIN_IMAGE,
        });
      }
      var main = "";
      const photosArr = [];
      if (req.files) {
        if (req.files.main) {
          var [errMedia, media] = await to(
            uploadFile.uploadOnServer(
              req.files.main,
              `/admin/variants`,
              `${body.productId}-${body.name}-${req.files.main.name}`
            )
          );
          if (errMedia) {
            return reject({
              statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
              message: err,
            });
          }
          if (media) {
            main = media.url;
          }
        }

        if (req.files.images && !req.files.images.length) {
          var [errMedia, media] = await to(
            uploadFile.uploadOnServer(
              req.files.images,
              `/admin/variants`,
              `${body.productId}-${body.name}-${req.files.images.name}`
            )
          );
          if (errMedia) {
            return reject({
              statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
              message: err,
            });
          }
          if (media) {
            photosArr.push(media.url);
          }
        } else {
          req.files.images.forEach(async (image) => {
            var [errMedia, media] = await to(
              uploadFile.uploadOnServer(
                image,
                `/admin/variants`,
                `${body.productId}-${body.name}-${image.name}`
              )
            );
            if (errMedia) {
              return reject({
                statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
                message: err,
              });
            }
            if (media) {
              photosArr.push(media.url);
            }
          });
        }
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

      photosArr.forEach(async (element) => {
        var [errPhotos, photos] = await to(
          ProductPhotos.create({
            url: element,
            variantId: variant.id,
            productId: body.productId,
            main: false,
          })
        );
        if (errPhotos) {
          return reject({
            statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
            message: err,
          });
        }
      });

      var [errPhotos, photos] = await to(
        ProductPhotos.create({
          url: main,
          variantId: variant.id,
          productId: body.productId,
          main: CONFIG.ACTIVE_RECORD,
        })
      );
      if (errPhotos) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
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
      if (!body.productTypeId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_PRODUCT_TYPE_ID,
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

      if (body.id && body.id !== "undefined") {
        whereCluse[Op.and].push({ id: body.id });
      }

      if (body.keyword && body.keyword !== "undefined") {
        const array = body.keyword.split(" ");
        for (var i = 0; i < array.length; i++) {
          whereCluse[Op.and].push({
            [Op.or]: [
              {
                name: {
                  [Op.like]: "%" + array[i] + "%",
                },
              },
            ],
          });
        }
      }

      whereCluse[Op.and].push({ status: CONFIG.ACTIVE_RECORD });

      var [err, productType] = await to(
        ProductType.findAndCountAll({
          where: whereCluse,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: Category,
              as: "categories",
              required: false,
            },
          ],
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
          message: CONFIG.MESS_INTERNAL_SERVER_ERROR,
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

      if (body.id && body.id !== "undefined") {
        whereCluse[Op.and].push({ id: body.id });
      }

      if (body.keyword && body.keyword !== "undefined") {
        const array = body.keyword.split(" ");
        for (var i = 0; i < array.length; i++) {
          whereCluse[Op.and].push({
            [Op.or]: [
              {
                name: {
                  [Op.like]: "%" + array[i] + "%",
                },
              },
              Sequelize.where(Sequelize.col("productType.name"), {
                [Op.like]: "%" + array[i] + "%",
              }),
            ],
          });
        }
      }

      if (body.productTypeId && body.productTypeId !== "undefined") {
        whereCluse[Op.and].push({ productTypeId: body.productTypeId });
      }

      whereCluse[Op.and].push({ status: CONFIG.ACTIVE_RECORD });

      var [err, category] = await to(
        Category.findAndCountAll({
          where: whereCluse,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: ProductType,
              required: true,
            },
            {
              model: SubCategory,
              as: "subCategories",
              required: false,
            },
          ],
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
          message: CONFIG.MESS_INTERNAL_SERVER_ERROR,
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

      if (body.id && body.id !== "undefined") {
        whereCluse[Op.and].push({ id: body.id });
      }

      if (body.categoryId && body.categoryId !== "undefined") {
        whereCluse[Op.and].push({ categoryId: body.categoryId });
      }

      if (body.keyword && body.keyword !== "undefined") {
        const array = body.keyword.split(" ");
        for (var i = 0; i < array.length; i++) {
          whereCluse[Op.and].push({
            [Op.or]: [
              {
                name: {
                  [Op.like]: "%" + array[i] + "%",
                },
              },
              Sequelize.where(Sequelize.col("category.name"), {
                [Op.like]: "%" + array[i] + "%",
              }),
            ],
          });
        }
      }

      whereCluse[Op.and].push({ status: CONFIG.ACTIVE_RECORD });

      var [err, subCategory] = await to(
        SubCategory.findAndCountAll({
          where: whereCluse,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: ProductType,
              required: true,
            },
            {
              model: Category,
              as: "category",
              required: true,
            },
          ],
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
          message: CONFIG.MESS_INTERNAL_SERVER_ERROR,
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
      const page = parseInt(body.page) ?? 1;
      const limit = parseInt(body.pageSize) ?? 10;
      const offset = (page - 1) * limit;

      if (body.id && body.id !== "undefined") {
        whereCluse[Op.and].push({ id: body.id });
      }

      if (body.productTypeId && body.productTypeId !== "undefined") {
        whereCluse[Op.and].push({ productTypeId: body.productTypeId });
      }
      if (body.categoryId && body.categoryId !== "undefined") {
        whereCluse[Op.and].push({ categoryId: body.categoryId });
      }
      if (body.subCategoryId && body.subCategoryId !== "undefined") {
        whereCluse[Op.and].push({ subCategoryId: body.subCategoryId });
      }
      if (body.active && body.active !== "undefined") {
        whereCluse[Op.and].push({ active: body.active });
      }

      if (body.keyword && body.keyword !== "undefined") {
        const array = body.keyword.split(" ");
        for (var i = 0; i < array.length; i++) {
          whereCluse[Op.and].push({
            [Op.or]: [
              {
                name: {
                  [Op.like]: "%" + array[i] + "%",
                },
              },
              Sequelize.where(Sequelize.col("category.name"), {
                [Op.like]: "%" + array[i] + "%",
              }),
              Sequelize.where(Sequelize.col("subCategory.name"), {
                [Op.like]: "%" + array[i] + "%",
              }),
              Sequelize.where(Sequelize.col("productType.name"), {
                [Op.like]: "%" + array[i] + "%",
              }),
            ],
          });
        }
      }

      whereCluse[Op.and].push({ status: CONFIG.ACTIVE_RECORD });

      var [err, product] = await to(
        Product.findAndCountAll({
          where: whereCluse,
          limit: limit,
          offset: offset,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: ProductType,
              as: "productType",
              required: true,
            },
            {
              model: Category,
              as: "category",
              required: true,
            },
            {
              model: SubCategory,
              as: "subCategory",
              required: true,
            },
          ],
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
          message: CONFIG.MESS_INTERNAL_SERVER_ERROR,
        });
      }

      return resolve(product);
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}
function getVariant(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.query;
      var whereCluse = {};
      whereCluse[Op.and] = [];
      const page = parseInt(body.page) ?? 1;
      const limit = parseInt(body.pageSize) ?? 10;
      const offset = (page - 1) * limit;

      if (body.id && body.id !== "undefined") {
        whereCluse[Op.and].push({ id: body.id });
      }

      if (body.active && body.active !== "undefined") {
        whereCluse[Op.and].push({ active: body.active });
      }
      if (body.productId && body.productId !== "undefined") {
        whereCluse[Op.and].push({ productId: body.productId });
      }
      if (body.keyword && body.keyword !== "undefined") {
        const array = body.keyword.split(" ");
        for (var i = 0; i < array.length; i++) {
          whereCluse[Op.and].push({
            [Op.or]: [
              {
                name: {
                  [Op.like]: "%" + array[i] + "%",
                },
              },
              Sequelize.where(Sequelize.col("product.name"), {
                [Op.like]: "%" + array[i] + "%",
              }),
            ],
          });
        }
      }

      whereCluse[Op.and].push({ status: CONFIG.ACTIVE_RECORD });

      var [err, variant] = await to(
        Variant.findAndCountAll({
          where: whereCluse,
          limit: limit,
          offset: offset,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: Product,
              as: "product",
              required: true,
              include: [
                {
                  model: ProductType,
                  as: "productType",
                  required: true,
                },
                {
                  model: Category,
                  as: "category",
                  required: true,
                },
                {
                  model: SubCategory,
                  as: "subCategory",
                  required: true,
                },
              ],
            },
            { model: ProductPhotos, as: "productPhotos", required: true },
          ],
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
          message: CONFIG.MESS_INTERNAL_SERVER_ERROR,
        });
      }

      return resolve(variant);
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}

// update apis

function updateProduct(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;

      if (!body.id) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_ID,
        });
      }

      var [err, product] = await to(
        Product.findOne({
          where: {
            id: body.id,
          },
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
          message: "product not found",
        });
      }

      [err, product] = await to(
        product.update({
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
          message: "error updating",
        });
      }

      return resolve("updated successfully");
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}
function updateVariant(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;

      if (!body.id) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_ID,
        });
      }

      var [err, variant] = await to(
        Variant.findOne({
          where: {
            id: body.id,
          },
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
          message: "variant not found",
        });
      }
      var removedUrls = [];
      if (typeof body?.removedUrls == "string") {
        removedUrls.push(body.removedUrls);
      } else if (typeof body?.removedUrls == "object") {
        removedUrls = [...body.removedUrls];
      }
      if (removedUrls?.length) {
        const deleteResult = await ProductPhotos.destroy({
          where: {
            url: {
              [Op.in]: removedUrls,
            },
          },
        });
        for(const url of removedUrls) {
          // Remove the file from the local file system based on the URL
          const decodedUrl = decodeURIComponent(url); // Decode the URL

          try {
            const extendedPath = decodedUrl.replace(/\//g, "\\\\");
            const UPLOADS_PATH =
              path.resolve(__dirname, "..", "..") +'\\\\'+ `${extendedPath}`;
            fs.unlinkSync(UPLOADS_PATH); // Remove the file synchronously
          } catch (err) {
            console.error(`Error removing file ${UPLOADS_PATH}:`, err);
          }
        };
      }

      var main = "";
      const photosArr = [];
      if (req.files) {
        if (req.files.main) {
          var [errMedia, media] = await to(
            uploadFile.uploadOnServer(
              req.files.main,
              `/admin/variants`,
              `${variant.productId}-${variant.name}-${req.files.main.name}`
            )
          );
          if (errMedia) {
            return reject({
              statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
              message: err,
            });
          }
          if (media) {
            main = media.url;
          }
        }

        if (req.files.images && !req.files.images.length) {
          var [errMedia, media] = await to(
            uploadFile.uploadOnServer(
              req.files.images,
              `/admin/variants`,
              `${variant.productId}-${variant.name}-${req.files.images.name}`
            )
          );
          if (errMedia) {
            return reject({
              statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
              message: err,
            });
          }
          if (media) {
            photosArr.push(media.url);
          }
        } else {
          for(const image of req.files.images) {
            var [errMedia, media] = await to(
              uploadFile.uploadOnServer(
                image,
                `/admin/variants`,
                `${variant.productId}-${variant.name}-${image.name}`
              )
            );
            if (errMedia) {
              return reject({
                statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
                message: err,
              });
            }
            if (media) {
              photosArr.push(media.url);
            }
          };
        }
      }

      for(const element of photosArr) {
        var [errPhotos, photos] = await to(
          ProductPhotos.create({
            url: element,
            variantId: body.id,
            productId: variant.productId,
            main: false,
          })
        );
        if (errPhotos) {
          return reject({
            statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
            message: err,
          });
        }
      };

      var [errPhotos, photos] = await to(
        ProductPhotos.create({
          url: main,
          variantId: body.id,
          productId: variant.productId,
          main: true,
        })
      );
      if (errPhotos) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }

      [err, variant] = await to(variant.update(body));
      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }
      if (!variant) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }
      return resolve("updated successfully");
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}

function updateCategory(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;

      if (!body.id) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_ID,
        });
      }

      var [err, category] = await to(
        Category.findOne({
          where: {
            id: body.id,
          },
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
          message: "category not found",
        });
      }

      [err, category] = await to(
        category.update({
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
          message: "error updating",
        });
      }

      return resolve("updated successfully");
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}
function updateSubCategory(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;

      if (!body.id) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_ID,
        });
      }

      var [err, subCategory] = await to(
        SubCategory.findOne({
          where: {
            id: body.id,
          },
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
          message: "subCategory not found",
        });
      }

      [err, subCategory] = await to(
        subCategory.update({
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
          message: "error updating",
        });
      }

      return resolve("updated successfully");
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}
function updateProductType(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;

      if (!body.id) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_ID,
        });
      }

      var [err, productType] = await to(
        ProductType.findOne({
          where: {
            id: body.id,
          },
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
          message: "productType not found",
        });
      }

      var [err, productType] = await to(
        productType.update({
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
          message: "error updating",
        });
      }

      return resolve("updated successfully");
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}
