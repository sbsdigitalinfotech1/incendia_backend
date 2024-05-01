const uploadFile = require("../../utils/image_upload");

module.exports = {
  uploadUserMedia,
};

function uploadUserMedia(req, res) {
  return new Promise(async function (resolve, reject) {
    try {
      var file = req.files;

      if (file.image !== undefined) {
        await uploadFile.uploadOnServer(file.image, `/user`, "hdship");
        console.log("file uploaded");
        return resolve("file uploaded successfully");
      } else {
        console.log("no file found");
        return resolve("file not uploaded");
      }
    } catch (err) {
      return reject("error");
    }
  });
}
