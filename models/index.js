"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
const config = require(__dirname + "/../config/config.js")[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    process.env.DATABASE_NAME,
    process.env.DATABASE_USERNAME,
    process.env.DATABASE_PASSWORD,
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes,
      db
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});


// Function to synchronize a model with the database
const syncModelWithDatabase = (model) => {
  model
    .sync({ alter: true })
    .then(() => {
      console.log(`Model ${model.name} synchronized successfully.`);
    })
    .catch((error) => {
      console.error(
        `Error synchronizing model ${model.name}: ${error.message}`
      );
    });
};

// Directory containing model files
const modelsDir = path.join(__dirname);

// Scan the directory for model files
fs.readdirSync(modelsDir).forEach((file) => {
  // Check if the file is a JavaScript file
  if (file.endsWith(".js")) {
    if (file == "index.js") {
    } else {
    // Remove the '.js' extension from the file name
      const modelName = file.slice(0, -3);
      // Dynamically import the model file
      const model = require(path.join(modelsDir, modelName))(
        sequelize,
        Sequelize.DataTypes
      );
      // Synchronize the model with the database
      syncModelWithDatabase(model);
    }
  }
});

// // Import the Vendor model and create the table
// const Vendor = require("./vendorTrip")(sequelize, Sequelize.DataTypes);
// Vendor.sync({ alter: true }); // This will create the Vendor table

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
