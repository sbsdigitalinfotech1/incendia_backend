require("dotenv").config();
require("./global_functions");
require("./config/global_config");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3001;

// Define the allowed origin
const allowedOrigin = "http://localhost:3000";

// Configure CORS options
const corsOptions = {
  origin: "*",
  // origin: (origin, callback) => {
  //   if (origin === allowedOrigin) {
  //     callback(null, true); // Allow the request
  //   } else {
  //     callback(new Error('Access denied')); // Reject the request
  //   }
  // },
  allowedHeaders: "Content-Type", // Specify the allowed headers
  credentials: true, // Allow credentials (e.g., cookies, authorization headers)
  optionsSuccessStatus: 204, // Set the response status for preflight requests
};

// cors policy

const cors = require("cors");
app.use(cors());

// configure the middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((err, req, res, next) => {
  console.error(err); // Log the error for debugging purposes
  // Send error response
  res.status(400).json({ error: err.message });
});

// hadndle file upload
const fs = require("fs");
const fileUpload = require("express-fileupload");
app.use(fileUpload());

// make uploaded files publically accessible
const uploadsDirectory = path.join(__dirname, "uploads");

// Function to recursively create routes for subdirectories
function createRoutesForSubdirectories(directory, baseUrl = "") {
  const subdirectories = fs
    .readdirSync(directory, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

  subdirectories.forEach((subdirectory) => {
    const subdirectoryPath = path.join(directory, subdirectory);
    const subdirectoryUrl = path.join(baseUrl, subdirectory);

    app.use(`/uploads/${subdirectoryUrl}`, express.static(subdirectoryPath));
    createRoutesForSubdirectories(subdirectoryPath, subdirectoryUrl);
  });
}

// Serve static files for each subdirectory within the uploads directory
createRoutesForSubdirectories(uploadsDirectory);

// connnet to databse

var models = require("./models");

models.sequelize
  .authenticate()
  .then(() => {
    console.log("==Server is connected to '" + process.env.DB_NAME + "' DB==");
  })
  .catch((err) => {
    console.error("Unable to connect to SQL database:", config.database, err);
  });

var routers = require("./routes/index");

app.use("/", routers);

app.get("/", (req, res) => {
  res.send("Welcome to incendia backend");
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
