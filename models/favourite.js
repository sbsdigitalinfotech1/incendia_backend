
module.exports = (sequelize, DataTypes) => {
    var Favourite = sequelize.define("favourite", {
      id: {
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },
      userId:{
        type: DataTypes.BIGINT,
      },
      variantId:{
        type: DataTypes.BIGINT,
      },
    });
    Favourite.associate = function (models) {
      Favourite.belongsTo(models.variant, {
        foreignKey: "variantId",
        onDelete: "cascade",
      });
      Favourite.belongsTo(models.user, {
        foreignKey: "userId",
        onDelete: "cascade",
      });
    };
   
    return Favourite;
  };
  