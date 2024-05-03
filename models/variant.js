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
      unique: true,
      defaultValue: "",
    },
    color: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.STRING,
    },
    mrp: {
      type: DataTypes.STRING,
    },
    offerPrice: {
      type: DataTypes.STRING,
    },
    codAvailable: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    productHighlight: {
      type: DataTypes.TEXT, // Use TEXT data type
      defaultValue: "{}", // Default value as stringified JSON object
      get: function () {
        // Parse JSON string to object
        return JSON.parse(this.getDataValue("productHighlight"));
      },
      set: function (val) {
        // Stringify object to JSON string
        this.setDataValue("productHighlight", JSON.stringify(val));
      },
    },
    productsDescription: {
      type: DataTypes.TEXT, // Use TEXT data type
      defaultValue: "{}", // Default value as stringified JSON object
      get: function () {
        // Parse JSON string to object
        return JSON.parse(this.getDataValue("productsDescription"));
      },
      set: function (val) {
        // Stringify object to JSON string
        this.setDataValue("productsDescription", JSON.stringify(val));
      },
    },
    productId: {
      type: DataTypes.BIGINT,
    },
    status: {
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
