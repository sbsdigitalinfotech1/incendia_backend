var Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  var Variant = sequelize.define("variant", {
    id: {
      primaryKey: true,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    color: {
      type: DataTypes.STRING,
    },
    colorName: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.STRING,
      defaultValue:'0'
    },
    mrp: {
      type: DataTypes.STRING,
      defaultValue:'0'
    },
    offerPrice: {
      type: DataTypes.STRING
    },
    codAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    productHighlight: {
      type: DataTypes.TEXT,
    },
    productsDescription: {
      type: DataTypes.TEXT,
    },
    productId: {
      type: DataTypes.BIGINT,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: CONFIG.ACTIVE_RECORD,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: CONFIG.INACTIVE_RECORD,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: CONFIG.ACTIVE_RECORD,
    },
  });
  Variant.associate = function (models) {
    Variant.hasMany(models.productPhotos, {
      foreignKey: "variantId",
      onDelete: "cascade",
    });
    Variant.belongsTo(models.product, {
      foreignKey: "productId",
      onDelete: "cascade",
    });
  };

  return Variant;
};
