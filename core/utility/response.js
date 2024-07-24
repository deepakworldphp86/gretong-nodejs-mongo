module.exports = {
    errorResponse: function (req, message) {
        req.flash('errorMsg', message);
    },
    successResponse: function (req, message) {
        req.flash('successMsg', message);
    },
    notFoundResponse: function (req, message) {
        req.flash('errorMsg', message);
    },
    unauthorizedRequest: function (req, message) {
        req.flash('errorMsg', message);
    }
}