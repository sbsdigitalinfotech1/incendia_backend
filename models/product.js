var Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  var Product = sequelize.define("product", {
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
    productTypeId: {
      type: DataTypes.BIGINT,
    },
    categoryId: {
      type: DataTypes.BIGINT,
    },
    subCategoryId: {
      type: DataTypes.BIGINT,
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
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: CONFIG.ACTIVE_RECORD,
    },
  });
  Product.associate = function (models) {
    Product.hasMany(models.variant, {
      foreignKey: "productId",
      onDelete: "cascade",
    });
    Product.belongsTo(models.productType, {
      foreignKey: "productTypeId",
      onDelete: "cascade",
    });
    Product.belongsTo(models.category, {
      foreignKey: "categoryId",
      onDelete: "cascade",
    });
    Product.belongsTo(models.subCategory, {
      foreignKey: "subCategoryId",
      onDelete: "cascade",
    });
  };

  return Product;
};
