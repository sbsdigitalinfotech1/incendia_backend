var Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  var ProductPhotos = sequelize.define("productPhotos", {
    id: {
      primaryKey: true,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    productId: {
      type: DataTypes.BIGINT,
    },
    variantId: {
      type: DataTypes.BIGINT,
    },
    url: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: CONFIG.ACTIVE_RECORD,
    },
  });
  ProductPhotos.associate = function (models) {
    ProductPhotos.belongsTo(models.product, {
      foreignKey: "productId",
      onDelete: "cascade",
    });
    ProductPhotos.belongsTo(models.variant, {
      foreignKey: "variantId",
      onDelete: "cascade",
    });
  };

  return ProductPhotos;
};
