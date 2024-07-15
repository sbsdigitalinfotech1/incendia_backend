const path = require("path");
const fs = require("fs");

const uploadOnServer = (file, key, fileName) => {
  return new Promise(async (resolve, reject) => {
    // Move the file to a desired location
    // Check if the uploads directory exists
    try {
      // Define the path to the uploads folder
      const extendedPath = key.replace(/\//g, "\\\\");
      const UPLOADS_PATH =
        path.join(path.resolve(__dirname, ".."), "uploads") + `${extendedPath}`;
      const fileExtension = path.extname(fileName)?'':path.extname(file.name);

      var i=0;
      while(fs.existsSync(path.join(UPLOADS_PATH, fileName + fileExtension))) {
        const parts = fileName.split(".");
        parts.pop();
        fileName= parts.join(".")
        fileName = fileName+i;
        i++;
      }

      if (!fs.existsSync(UPLOADS_PATH)) {
        // If it doesn't exist, create it
        fs.mkdirSync(UPLOADS_PATH);
        console.log("Uploads directory created successfully.");
      }
      file.mv(path.join(UPLOADS_PATH, fileName + fileExtension), (err) => {
        if (err) {
          return reject(err);
        }
        return resolve({ url: `uploads${key}/${encodeURIComponent(fileName)+fileExtension}`, msg: "File uploaded!" });
      });
    } catch (err) {
      return reject(err);
    }
  });
};

module.exports = { uploadOnServer };
