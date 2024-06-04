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
const Order = require("../../models").order;
const ProductPhotos = require("../../models").productPhotos;
const Cart = require("../../models").cart;
const uploadFile = require("../../utils/image_upload");
const path = require("path");
const fs = require("fs");

module.exports = {
  makeOrder,
  getOrders,
  updatePaymentStatus,
};

function generateOrderId() {
  // Get current timestamp
  const timestamp = Date.now().toString();

  // Generate random string of capital letters
  const randomString = Math.random()
    .toString(36)
    .substring(2, 12)
    .toUpperCase();

  // Concatenate timestamp and random string
  const orderId = randomString + timestamp;

  return orderId.substring(0, 10); // Return only the first 10 characters
}

// get api's

function makeOrder(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;
      var whereCluse = {};
      whereCluse[Op.and] = [];
      var orderId;
      var orderIdNotAvailable = true;

      if (!body.products && !body.products.length) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_QTY,
        });
      }
      if (!body.addressId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_ADDRESS_LINE_1,
        });
      }
      if (!body.userId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_VARIANT_ID,
        });
      }
      if (!body.paymentType) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: "Missing Payment Type",
        });
      }

      while (orderIdNotAvailable) {
        orderId = generateOrderId();
        var [errOrderrId, orderrId] = await to(
          Order.findOne({
            where: {
              orderId: orderId,
            },
          })
        );
        if (!orderrId) {
          orderIdNotAvailable = false;
        }
      }
      for (const item of body.products) {
        const variant = await Variant.findOne({
          where: { id: item.variantId },
        });

        var [err, order] = await to(
          Order.create({
            orderId,
            variantId: item.variantId,
            qty: item.qty,
            userId: body.userId,
            amount: parseInt(variant.price) * item.qty,
            deliveryAddress: body.addressId,
            priceAtTimeOfPay: variant.price,
            discountCoupanId: body.discountCoupanId
              ? body.discountCoupanId
              : null,
            paymentType: body.paymentType,
          })
        );

        if (err) {
          return reject({
            statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
            message: CONFIG.ERR_INTERNAL_SERVER_ERROR,
          });
        }
        if (!order) {
          return reject({
            statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
            message: CONFIG.ERR_INTERNAL_SERVER_ERROR,
          });
        }
      }
      return resolve({ message: "order created", orderId });
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}
function updatePaymentStatus(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;
      var whereCluse = {};
      whereCluse[Op.and] = [];

      if (!body.orderId) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_QTY,
        });
      }

      var [err, order] = await to(
        Order.findOne({
          where: {
            orderId: body.orderId,
          },
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
          message: CONFIG.ERR_INTERNAL_SERVER_ERROR,
        });
      }
      if (!order) {
        return resolve({
          success: false,
          message: "order not found",
        });
      }

      var [errOrder, updateOrder] = await to(
        order.update({
          ...body,
        })
      );
      if (errOrder) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
          message: CONFIG.ERR_INTERNAL_SERVER_ERROR,
        });
      }
      if (!updateOrder) {
        return resolve({
          success: false,
          message: "order not found",
        });
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
function getOrders(req, res) {
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
      if (body.userId && body.userId !== "undefined") {
        whereCluse[Op.and].push({ userId: body.userId });
      }

      var [err, order] = await to(
        Order.findAndCountAll({
          where: whereCluse,
          limit: limit,
          offset: offset,
          order: [["createdAt", "DESC"]],
          include: [
            {
              model: Address,
            },
            {
              model: Variant,
              include:[
                {
                  model: ProductPhotos,
                  where:{
                    main:true
                  },
                  attributes: ["url"],
                  required: false
                }
              ],
              attributes: ["colorName","mrp","price","offerPrice","size","name","id"],
              required: false
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
      if (!order) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
          message: CONFIG.ERR_INTERNAL_SERVER_ERROR,
        });
      }

      return resolve(order);
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}
