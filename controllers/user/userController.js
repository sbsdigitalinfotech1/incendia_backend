const UserServices = require("../../services/user/userServices");

module.exports = {
    uploadUserMedia,
};

function uploadUserMedia(req, res) {
    UserServices.uploadUserMedia(req, res)
        .then((result) => {
            return ReS(res, { data: result }, CONFIG.STATUS_CODE_OK);
        })
        .catch((error) => {
            return ReE(
                res,
                { message: error.message == undefined ? error : error.message },
                error.statusCode == undefined ? CONFIG.ERROR_CODE : error.statusCode
            );
        });
}
