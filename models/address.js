
module.exports = (sequelize, DataTypes) => {
    var Address = sequelize.define("address", {
      id: {
        primaryKey: true,
        type: DataTypes.BIGINT,
        autoIncrement: true,
      },
      userId: {
        type: DataTypes.BIGINT,
      },
      firstName:{
        type: DataTypes.STRING,
      },
      lastName:{
        type: DataTypes.STRING,
      },
      email:{
        type: DataTypes.STRING,
      },
      phone:{
        type: DataTypes.STRING,
      },
      pincode:{
        type: DataTypes.STRING,
      },
      addressLine1:{
        type: DataTypes.STRING,
      },
      addressLine2:{
        type: DataTypes.STRING,
      },
      city:{
        type: DataTypes.STRING,
      },
      state:{
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.BOOLEAN,
        defaultValue: CONFIG.ACTIVE_RECORD,
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: CONFIG.INACTIVE_RECORD,
      },
    });
    Address.associate = function (models) {
      Address.belongsTo(models.user, {
        foreignKey: "userId",
        onDelete: "cascade",
      });
    };
   
    return Address;
  };
  