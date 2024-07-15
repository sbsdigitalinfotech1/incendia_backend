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
const Cart = require("../../models").cart;
const uploadFile = require("../../utils/image_upload");
const path = require("path");
const fs = require("fs");

module.exports = {
  addToCart,
  removeFromCart,
  updateCart,
  getCart,
};

// get api's

function addToCart(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;
      var whereCluse = {};
      whereCluse[Op.and] = [];

      if (!body.guestId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_GUEST_ID,
        });
      }
      if (!body.variantId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_VARIANT_ID,
        });
      }
      if (!body.qty) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_QTY,
        });
      }

      var [err, cart] = await to(
        Cart.findOne({
          where: {
            variantId: body.variantId,
            guestId: body.guestId,
          },
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
          message: CONFIG.ERR_INTERNAL_SERVER_ERROR,
        });
      }
      if (cart) {
        return resolve("already added");
      }

      var [errs, carts] = await to(
        Cart.create({
          variantId: body.variantId,
          guestId: body.guestId,
          qty: body.qty,
        })
      );

      if (errs) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
          message: CONFIG.ERR_INTERNAL_SERVER_ERROR,
        });
      }

      return resolve("added");
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}
function removeFromCart(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;
      var whereCluse = {};
      whereCluse[Op.and] = [];

      if (!body.guestId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_GUEST_ID,
        });
      }
      if (!body.variantId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_VARIANT_ID,
        });
      }

      var [err, cart] = await to(
        Cart.findOne({
          where: {
            variantId: body.variantId,
            guestId: body.guestId,
          },
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
          message: CONFIG.ERR_INTERNAL_SERVER_ERROR,
        });
      }
      if (cart) {
        var [errs, carts] = await to(cart.destroy());

        if (errs) {
          return reject({
            statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
            message: CONFIG.ERR_INTERNAL_SERVER_ERROR,
          });
        }
      }

      return resolve("removed");
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}

function updateCart(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;
      var whereCluse = {};
      whereCluse[Op.and] = [];

      if (!body.guestId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_GUEST_ID,
        });
      }
      if (!body.variantId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_VARIANT_ID,
        });
      }
      if (!body.qty) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_QTY,
        });
      }

      var [err, cart] = await to(
        Cart.findOne({
          where: {
            variantId: body.variantId,
            guestId: body.guestId,
          },
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
          message: CONFIG.ERR_INTERNAL_SERVER_ERROR,
        });
      }
      if (cart) {
        var [errs, carts] = await to(
          cart.update({
            qty: body.qty,
          })
        );

        if (errs) {
          return reject({
            statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
            message: CONFIG.ERR_INTERNAL_SERVER_ERROR,
          });
        }
      }

      return resolve("updated");
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}
function getCart(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.query;
      var whereCluse = {};
      whereCluse[Op.and] = [];

      if (!body.guestId && body.guestId == "undefined") {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_GUEST_ID,
        });
      }

      var [err, cart] = await to(
        Cart.findAndCountAll({
          where: {
            guestId: body.guestId,
          },
          include: [
            {
              model: Variant,
              as: "variant",
              required: true,
              attributes: [
                "id",
                "name",
                "price",
                "mrp",
                "stock",
                "colorName",
                "size",
              ],
              include: [
                {
                  model: ProductPhotos,
                  required: false,
                  where: {
                    main: true,
                  },
                  attributes: ["url"],
                },
                {
                  model: Product,
                  required: true,
                  attributes: ["name"],
                  include: [
                    {
                      model: Category,
                      required: true,
                      attributes: ["name"],
                    },
                  ],
                },
              ],
            },
          ],
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
          message: CONFIG.ERR_INTERNAL_SERVER_ERROR,
        });
      }

      var totalMrp = 0;
      var totalPrice = 0;

      for (const item of cart.rows) {
        totalMrp += item.variant.mrp * item.qty;
        totalPrice += item.variant.price * item.qty;
      }
      return resolve({
        ...cart,
        cartData: {
          totalMrp: totalMrp,
          totalPrice: totalPrice,
          totalDiscount: totalMrp - totalPrice,
          grandtotal: totalPrice,
        },
      });
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}
