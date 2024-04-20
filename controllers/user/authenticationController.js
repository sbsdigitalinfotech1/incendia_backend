const AuthenticationService = require("../../services/user/authentication_service");

module.exports = {
  Login,
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
