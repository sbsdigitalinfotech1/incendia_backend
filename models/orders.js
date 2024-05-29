module.exports = (sequelize, DataTypes) => {
  var Order = sequelize.define("order", {
    id: {
      primaryKey: true,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    guestId: {
      type: DataTypes.STRING,
    },
    variantId: {
      type: DataTypes.BIGINT,
    },
    qty: {
      type: DataTypes.BIGINT,
    },
    discountCoupanId: {
      type: DataTypes.BIGINT,
    },
    orderId: {
      type: DataTypes.STRING,
    },
    status:{
     type: DataTypes.INTEGER,
     defaultValue:CONFIG.ORDER_STATUS_PENDING
    },
    paymentStatus:{
     type: DataTypes.INTEGER,
     defaultValue:CONFIG.ORDER_PAYMENT_UNPAID
    },
    amount:{
        type: DataTypes.STRING,
        defaultValue:CONFIG.ORDER_PAYMENT_UNPAID
       },
    priceAtTimeOfPay:{
        type: DataTypes.STRING,
        defaultValue:CONFIG.ORDER_PAYMENT_UNPAID
       },

  });
  Order.associate = function (models) {
    Order.belongsTo(models.variant, {
      foreignKey: "variantId",
      onDelete: "cascade",
    });
    Order.belongsTo(models.guest, {
      foreignKey: "guestId",
      onDelete: "cascade",
    });
  };

  return Order;
};
