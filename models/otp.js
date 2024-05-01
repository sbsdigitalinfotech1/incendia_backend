module.exports = (sequelize, DataTypes) => {
  var Otp = sequelize.define(
    "otp",
    {
      id: {
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },
      otp: {type: DataTypes.STRING,defaultValue:''},
      otpType: { type: DataTypes.INTEGER, defaultValue: 1 }, //1.Phone
      email: { type: DataTypes.STRING, defaultValue: "" },
    },
    {
      indexes: [
        {
          name: "otp_id_index",
          method: "BTREE",
          fields: ["id"],
        },
        {
          name: "otp_index",
          method: "BTREE",
          fields: ["otpType"],
        },
        {
          name: "phone_index",
          method: "BTREE",
          fields: ["email"],
        },
      ],
    }
  );
  return Otp;
};
