var Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");
var validator = require("email-validator");
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define("user", {
    id: {
      primaryKey: true,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    firstName: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    lastName: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    gender: {
      type: DataTypes.ENUM({
        values: ["Male", "Female"],
      }),
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          args: true,
          msg: CONFIG.ERR_MISSING_PHONE,
        },
        notEmpty: {
          args: true,
          msg: CONFIG.ERR_MISSING_PHONE,
        },
        len: {
          args: [10, 10],
          msg: "Phone number should be 10 digit long.",
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      defaultValue: "",
      validate: {
        isValidEmail() {
          if (this.email != "" && !validator.validate(this.email)) {
            throw new Error("Please provide valid email.");
          }
        },
      },
    },
    userType: { type: DataTypes.INTEGER, defaultValue: CONFIG.USER_TYPE_USER },
    token: { type: DataTypes.STRING, defaultValue: "" },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: CONFIG.ACTIVE_RECORD,
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: CONFIG.UNVERIFIED,
    },
    guestId: {
      type: DataTypes.STRING,
      default: "",
    },
    password: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  });
  User.associate = function (models) {};
  User.prototype.getJWT = function () {
    return (
      "Bearer " +
      jwt.sign(
        { userId: this.id, type: "User" },
        process.env.JWT_ENCRYPTION
        // { expiresIn: '24h' }
      )
    );
  };
  return User;
};
