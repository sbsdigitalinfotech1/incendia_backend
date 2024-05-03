var Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  var Category = sequelize.define("category", {
    id: {
      primaryKey: true,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    productTypeId: {
      type: DataTypes.BIGINT,
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: CONFIG.ACTIVE_RECORD,
    },
  });
  Category.associate = function (models) {
    Category.belongsTo(models.productType, {
      foreignKey: "productTypeId",
      onDelete: "cascade",
    });
  };

  return Category;
};
