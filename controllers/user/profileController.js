const ProfileService = require("../../services/user/profileService");

module.exports = {
  getAddress,
  getFavourite,
  addAddress,
  updateAddress,
  updateFavourite,
};

function getAddress(req, res) {
  ProfileService.getAddress(req, res)
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
function getFavourite(req, res) {
  ProfileService.getFavourite(req, res)
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

// post api's

function addAddress(req, res) {
  ProfileService.addAddress(req, res)
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

//   update api's

function updateAddress(req, res) {
  ProfileService.updateAddress(req, res)
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
function updateFavourite(req, res) {
  ProfileService.updateFavourite(req, res)
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
