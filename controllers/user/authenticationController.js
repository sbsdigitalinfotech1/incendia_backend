const AuthenticationService = require("../../services/user/authentication_service");

module.exports = {
  generateGuestId,
  Login,
  Register,
  SendOTP,
  verifyOTP,
  verifyRegistration,
  resetPassword
};


function generateGuestId(req, res) {
  AuthenticationService.generateGuestId(req, res)
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
function Login(req, res) {
  AuthenticationService.Login(req, res)
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

function Register(req, res) {
  AuthenticationService.Register(req, res)
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
function SendOTP(req, res) {
  AuthenticationService.SendOTP(req, res)
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
function verifyRegistration(req, res) {
  AuthenticationService.verifyRegistration(req, res)
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
function verifyOTP(req, res) {
  AuthenticationService.verifyOTP(req, res)
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
function resetPassword(req, res) {
  AuthenticationService.resetPassword(req, res)
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
