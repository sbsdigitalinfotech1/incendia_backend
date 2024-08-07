module.exports = (sequelize, DataTypes) => {
  var Order = sequelize.define("order", {
    id: {
      primaryKey: true,
      type: DataTypes.BIGINT,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.BIGINT,
    },
    variantId: {
      type: DataTypes.BIGINT,
    },
    qty: {
      type: DataTypes.BIGINT,
    },
    deliveryAddress: {
      type: DataTypes.BIGINT,
    },
    discountCoupanId: {
      type: DataTypes.STRING,
    },
    orderId: {
      type: DataTypes.STRING,
    },
    transactionId: {
      type: DataTypes.STRING,
    },
    paymentStatus: {
      type: DataTypes.INTEGER,
      defaultValue: CONFIG.ORDER_PAYMENT_UNPAID,
    },
    paymentType: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.INTEGER,
      defaultValue: CONFIG.ORDER_STATUS_PENDING,
    },
    amount: {
      type: DataTypes.STRING,
      defaultValue: CONFIG.ORDER_PAYMENT_UNPAID,
    },
    priceAtTimeOfPay: {
      type: DataTypes.STRING,
      defaultValue: CONFIG.ORDER_PAYMENT_UNPAID,
    },
  });
  Order.associate = function (models) {
    Order.belongsTo(models.variant, {
      foreignKey: "variantId",
      onDelete: "cascade",
    });
    Order.belongsTo(models.user, {
      foreignKey: "userId",
      onDelete: "cascade",
    });
    Order.belongsTo(models.address, {
      foreignKey: "deliveryAddress",
      onDelete: "cascade",
    });
  };

  return Order;
};
