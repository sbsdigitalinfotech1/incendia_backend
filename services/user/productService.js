const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Product = require("../../models").product;
const User = require("../../models").user;
const Variant = require("../../models").variant;
const Address = require("../../models").address;
const Favourite = require("../../models").favourite;
const Category = require("../../models").category;
const ProductType = require("../../models").productType;
const SubCategory = require("../../models").subCategory;
const ProductPhotos = require("../../models").productPhotos;
const uploadFile = require("../../utils/image_upload");
const path = require("path");
const fs = require("fs");

module.exports = {
  getProducts,
  getAvailableColorsAndSizes,
  getProductsFiltered,
};

// get api's

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

      whereCluse[Op.and].push({ active: CONFIG.ACTIVE_RECORD });
      whereCluse[Op.and].push({ status: CONFIG.ACTIVE_RECORD });

      whereCluse[Op.and].push({
        id: {
          [Op.in]: Sequelize.literal(`(
        SELECT MAX(id) 
        FROM Variants 
        GROUP BY color
      )`),
        },
      });

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
              where: {
                active: CONFIG.ACTIVE_RECORD,
              },
              required: true,
              include: [
                {
                  model: Category,
                  as: "category",
                  where: {
                    status: CONFIG.ACTIVE_RECORD,
                  },
                  required: true,
                },
              ],
            },
            {
              model: ProductPhotos,
              as: "productPhotos",
              where: {
                status: CONFIG.ACTIVE_RECORD,
              },
              required: true,
              separate: true,
              order: [["createdAt", "DESC"]],
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

      if (!variant) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.MESS_INTERNAL_SERVER_ERROR,
        });
      }

      if (body.id && body.id !== "undefined") {
        if (variant.rows[0].productId) {
          var [errColors, colors] = await to(
            Variant.findAndCountAll({
              where: {
                productId: variant.rows[0].productId,
                id: {
                  [Op.in]: Sequelize.literal(`(
                    SELECT MAX(id) FROM Variants 
                    WHERE productId = ${variant.rows[0].productId} 
                    GROUP BY color
                  )`),
                },
              },
              order: [["createdAt", "DESC"]],
              attributes: ["color", "id"],
            })
          );
          var [errSizes, sizes] = await to(
            Variant.findAndCountAll({
              where: {
                color: variant.rows[0].color,
                productId: variant.rows[0].productId,
              },
              order: [["createdAt", "DESC"]],
              attributes: ["size", "id"],
            })
          );
          variant.rows[0].dataValues.availableColors = colors;
          variant.rows[0].dataValues.availableSizes = sizes;
        }
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

function getAvailableColorsAndSizes(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.query;
      var whereCluse = {};
      whereCluse[Op.and] = [];

      var [errSize, sizes] = await to(
        Variant.findAll({
          attributes: [
            [Sequelize.fn("DISTINCT", Sequelize.col("size")), "size"],
          ],
          raw: true,
        })
      );
      var [errColors, colors] = await to(
        Variant.findAll({
          attributes: [
            "colorName",
            [Sequelize.fn("MAX", Sequelize.col("color")), "color"],
          ],
          group: ["colorName"],
          raw: true,
        })
      );

      if (errSize) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }
      if (errColors) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }

      return resolve({
        sizes: sizes.map((size) => size.size),
        colors: colors.map((color) => color),
      });
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}
function getProductsFiltered(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.query;
      var whereCluse = {};
      var whereCluse2 = {};
      whereCluse[Op.and] = [];
      whereCluse2[Op.and] = [];
      const page = parseInt(body.page) ?? 1;
      const limit = parseInt(body.pageSize) ?? 10;
      const offset = (page - 1) * limit;
      var order = [];

      if (body.colorName && body.colorName !== "undefined") {
        whereCluse[Op.and].push({ colorName: body.colorName });
      }
      if (body.size && body.size !== "undefined") {
        whereCluse[Op.and].push({ size: body.size });
      }
      if (body.categoryId && body.categoryId !== "undefined") {
        whereCluse2[Op.and].push({ id: body.categoryId });
      }
      if (body.sort && body.sort !== "undefined") {
        if (body.sort == "new") {
          order = ["createdAt", "DESC"];
        }
        if (body.sort == "lth") {
          order = ["price", "ASC"];
        }
        if (body.sort == "htl") {
          order = ["price", "DESC"];
        }
      } else {
        order = ["createdAt", "DESC"];
      }

      whereCluse[Op.and].push({ active: CONFIG.ACTIVE_RECORD });
      whereCluse[Op.and].push({ status: CONFIG.ACTIVE_RECORD });
      whereCluse2[Op.and].push({ status: CONFIG.ACTIVE_RECORD });

      whereCluse[Op.and].push({
        id: {
          [Op.in]: Sequelize.literal(`(
        SELECT MAX(id) 
        FROM Variants 
        GROUP BY color
      )`),
        },
      });

      var [err, variant] = await to(
        Variant.findAndCountAll({
          where: whereCluse,
          limit: limit,
          offset: offset,
          order: [[...order]],
          include: [
            {
              model: Product,
              as: "product",
              where: {
                active: CONFIG.ACTIVE_RECORD,
              },
              required: true,
              include: [
                {
                  model: Category,
                  as: "category",
                  where: whereCluse2,
                  required: true,
                },
              ],
            },
            {
              model: ProductPhotos,
              as: "productPhotos",
              where: {
                status: CONFIG.ACTIVE_RECORD,
              },
              required: true,
              separate: true,
              order: [["createdAt", "DESC"]],
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
