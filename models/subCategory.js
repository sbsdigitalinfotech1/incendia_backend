var Sequelize = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  var SubCategory = sequelize.define("subCategory", {
    id: {
      primaryKey: true,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    categoryId: {
      type: DataTypes.BIGINT,
    },
  });
  SubCategory.associate = function (models) {
    SubCategory.belongsTo(models.category, {
        foreignKey: "categoryId",
        onDelete: "cascade",
      });
  };
  
  return SubCategory;
};
