
module.exports = (sequelize, DataTypes) => {
    var Cart = sequelize.define("cart", {
      id: {
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },
      guestId: {
        type: DataTypes.STRING,
      },
      variantId:{
        type: DataTypes.BIGINT,
      },
      qty:{
        type: DataTypes.BIGINT,
        defaultValue: 1
      },
      discountCoupanId:{
        type: DataTypes.BIGINT,
      }
    });
    Cart.associate = function (models) {
      Cart.belongsTo(models.variant, {
        foreignKey: "variantId",
        onDelete: "cascade",
      });
      Cart.belongsTo(models.guest, {
        foreignKey: "guestId",
        onDelete: "cascade",
      });
    };
   
    return Cart;
  };
  