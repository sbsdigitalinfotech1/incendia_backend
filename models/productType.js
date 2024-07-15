var Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  var ProductType = sequelize.define("productType", {
    id: {
      primaryKey: true,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: CONFIG.ACTIVE_RECORD,
    },
  });
  ProductType.associate = function (models) {
    ProductType.hasMany(models.category, {
      foreignKey: "productTypeId",
      as:"categories",
      onDelete: "cascade",
    });
  };

  return ProductType;
};
