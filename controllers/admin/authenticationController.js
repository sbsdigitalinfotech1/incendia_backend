const AuthenticationService = require("../../services/admin/authentication_service");

module.exports = {
  Login,
  Register,
  verifyAccount
};

function Login(req, res) {
  AuthenticationService.Login(req, res)
    .then((result) => {
      return ReS(res, { message: result }, CONFIG.STATUS_CODE_OK);
    })
    .catch((error) => {
      return ReE(
        res,
        { message: error.message == undefined ? error : error.message },
        error.statusCode == undefined ? CONFIG.ERROR_CODE : error.statusCode
      );
    });
}
function Register(req, res) {
  AuthenticationService.Register(req, res)
    .then((result) => {
      return ReS(res, { message: result }, CONFIG.STATUS_CODE_OK);
    })
    .catch((error) => {
      return ReE(
        res,
        { message: error.message == undefined ? error : error.message },
        error.statusCode == undefined ? CONFIG.ERROR_CODE : error.statusCode
      );
    });
}
function verifyAccount(req, res) {
  AuthenticationService.verifyAccount(req, res)
    .then((result) => {
      return ReS(res, { message: result }, CONFIG.STATUS_CODE_OK);
    })
    .catch((error) => {
      return ReE(
        res,
        { message: error.message == undefined ? error : error.message },
        error.statusCode == undefined ? CONFIG.ERROR_CODE : error.statusCode
      );
    });
}
