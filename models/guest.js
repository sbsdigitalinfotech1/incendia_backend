
module.exports = (sequelize, DataTypes) => {
  var Guest = sequelize.define("guest", {
    id: {
      primaryKey: true,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    guestId: {
      type: DataTypes.STRING,
      defaultValue: "",
    }
  });
  Guest.associate = function (models) {};
 
  return Guest;
};
