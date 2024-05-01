const User = require("../../models").user;
const bcrypt = require("bcrypt");

module.exports = {
  Login,
  Register,
  verifyAccount
};

function Login(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;

      if (!body.email) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_EMAIL,
        });
      }
      if (!body.password) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_PASSWORD,
        });
      }

      var [err, user] = await to(
        User.findOne({
          where: { email: body.email,userType:CONFIG.USER_TYP_ADMIN },
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
          message: err,
        });
      }
      if (!user) {
        return resolve("not registered");
      }

      // Check if password is correct
      if (!bcrypt.compareSync(body.password, user.password)) {
        return reject("Incorrect password");
      }

      if (user.verified == false) {
        return resolve("not verified");
      }

      var token = user.getJWT();
      [err, user] = await to(
        user.update(
          {
            token: token,
          },
          {
            attributes: [
              "firstName",
              "lastName",
              "token",
              "userType",
              "gender",
              "phone",
              "status",
              "verified",
              "guestId",
            ],
          }
        )
      );
      return resolve(user);
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}


function Register(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;

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
      if (!body.phone) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_PHONE,
        });
      }
      if (!body.email) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_EMAIL,
        });
      }
      if (!body.password) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_PASSWORD,
        });
      }
      var [err, user] = await to(
        User.findOne({
          where: { email: body.email, userType: CONFIG.USER_TYP_ADMIN },
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: err,
        });
      }

      if (user && user.verified) {
        return reject("user already registered");
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(body.password, 10);

      if (user && !user.verified) {
        [err, user] = await to(
          user.update({
            email: body.email,
            phone: body.phone,
            lastName: body.lastName,
            firstName: body.firstName,
            password: hashedPassword,
          })
        );

        if (err) {
          return reject({
            statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
            message: err,
          });
        }
        if (!user) {
          return reject({
            statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
            message: CONFIG.ERR_INTERNAL_SERVER_ERROR,
          });
        }

        return resolve("successfully registered");
      }

      [err, user] = await to(
        User.create({
          email: body.email,
          phone: body.phone,
          lastName: body.lastName,
          firstName: body.firstName,
          password: hashedPassword,
          userType: CONFIG.USER_TYP_ADMIN
        })
      );

      if (err) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
          message: err,
        });
      }
      if (!user) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
          message: CONFIG.ERR_INTERNAL_SERVER_ERROR,
        });
      }

      return resolve("successfully registered");
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}


function verifyAccount(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      const body = req.body;

      if (!body.email) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_EMAIL,
        });
      }
      if (!body.verify) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: CONFIG.ERROR_MISSING_VERIFY_TYPE,
        });
      }

      
      var [errUser, user] = await to(
        User.update(
          { verified: body.verify },
          {
            where: {
              email: body.email,
              userType: CONFIG.USER_TYP_ADMIN,
            },
          }
        )
      );

      if (errUser) {
        return reject({
          statusCode: CONFIG.STATUS_CODE_BAD_REQUEST,
          message: errUser,
        });
      }
      if (!user) {
        return reject("user not found");
      }

      return resolve("profile verified successfully");
    } catch (error) {
      return reject({
        statusCode: CONFIG.STATUS_CODE_INTERNAL_SERVER,
        message: error,
      });
    }
  });
}