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
  getAddress,
  getFavourite,
  addAddress,
  updateAddress,
  updateFavourite,
};

// get api's

function getAddress(req, res) {
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

      if (body.userId && body.userId !== "undefined") {
        whereCluse[Op.and].push({ userId: body.userId });
      }

      whereCluse[Op.and].push({ status: CONFIG.ACTIVE_RECORD });

      var [err, address] = await to(
        Address.findAndCountAll({
          where: whereCluse,
          limit: limit,
          offset: offset,
          order: [["active", "DESC"]],
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }

      if (!address) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.MESS_INTERNAL_SERVER_ERROR,
        });
      }

      return resolve(address);
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}
function getFavourite(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.query;
      var whereCluse = {};
      whereCluse[Op.and] = [];
      const page = parseInt(body.page) ?? 1;
      const limit = parseInt(body.pageSize) ?? 10;
      const offset = (page - 1) * limit;

      if (body.userId && body.userId !== "undefined") {
        whereCluse[Op.and].push({ userId: body.userId });
      }

      var [err, favourite] = await to(
        Favourite.findAndCountAll({
          where: whereCluse,
          limit: limit,
          offset: offset,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: Variant,
              as: "variant",
              required: true,
              include: [
                {
                  model: ProductPhotos,
                  as: "productPhotos",
                  required: true,
                  where: {
                    main: true,
                  },
                },
                {
                  model: Product,
                  as: "product",
                  required: true,
                },
              ],
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

      if (!favourite) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.MESS_INTERNAL_SERVER_ERROR,
        });
      }

      return resolve(favourite);
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}

// add api's

function addAddress(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;

      if (!body.userId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_ID,
        });
      }
      if (!body.firstName) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_FIRST_NAME,
        });
      }
      if (!body.lastName) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_LAST_NAME,
        });
      }
      if (!body.email) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_EMAIL,
        });
      }
      if (!body.phone) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_PHONE,
        });
      }
      if (!body.pincode) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_AREA_PINCODE,
        });
      }
      if (!body.addressLine1) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_ADDRESS_LINE_1,
        });
      }
      if (!body.addressLine2) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_ADDRESS_LINE_2,
        });
      }
      if (!body.city) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_CITY,
        });
      }
      if (!body.state) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_STATE,
        });
      }

      var [err, address] = await to(
        Address.create({
          ...body,
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }

      if (!address) {
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

//   update api's

function updateAddress(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;

      if (!body.id) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_ID,
        });
      }

      var [err, address] = await to(
        Address.findOne({
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

      if (!address) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: "address not found",
        });
      }

      if (body.active) {
        var [erra, addressa] = await to(
          Address.update(
            {
              active: false,
            },
            {
              where: {
                [Op.not]: { id: body.id },
                userId: address.userId,
                active: true
              },
            }
          )
        );
        if (erra) {
          return reject({
            statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
            message: err,
          });
        }

        if (!addressa) {
          return reject({
            statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
            message: "error updating",
          });
        }
        body.active = true
      }

      [err, address] = await to(
        address.update({
          ...body
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }

      if (!address) {
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
function updateFavourite(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;

      if (!body.userId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_USER_ID,
        });
      }
      if (!body.id) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_VARIANT_ID,
        });
      }

      var [err, favourite] = await to(
        Favourite.findOne({
          where: {
            variantId: body.id,
            userId: body.userId,
          },
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }
      if (!favourite) {
        await to(
          Favourite.create({ variantId: body.id, userId: body.userId })
        );
        return resolve("Added");
      }
      if (favourite) {
        await to(favourite.destroy());
        return resolve("Removed");
      }

    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}
