const AdminServices = require("../../services/admin/adminServices");

module.exports = {
    uploadUserMedia,
    addProduct,
    addVariant
};

function uploadUserMedia(req, res) {
    AdminServices.uploadUserMedia(req, res)
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
function addProduct(req, res) {
    AdminServices.addProduct(req, res)
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
function addVariant(req, res) {
    AdminServices.addVariant(req, res)
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
