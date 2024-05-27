const CartService = require("../../services/user/cartService");

module.exports = {
    addToCart,
    removeFromCart,
    updateCart,
    getCart
};

function addToCart(req, res) {
    CartService.addToCart(req, res)
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
function removeFromCart(req, res) {
    CartService.removeFromCart(req, res)
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
function updateCart(req, res) {
    CartService.updateCart(req, res)
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

function getCart(req, res) {
    CartService.getCart(req, res)
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
