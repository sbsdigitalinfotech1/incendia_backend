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
                  )`)
                }
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

