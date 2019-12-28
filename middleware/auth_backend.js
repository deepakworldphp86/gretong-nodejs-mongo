module.exports = {
    isAuthorized: function (req, res, next) {
        if (req.session.isAdminActive) {
            next();
        } else {
            res.redirect('/admin/login');
        }
    },
    validate_format: function (req, res, next) {
        // For MemoryStorage, validate the format using `req.file.buffer`
        // For DiskStorage, validate the format using `fs.readFile(req.file.path)` from Node.js File System Module
        let mime = fileType(req.file.buffer);

        // if can't be determined or format not accepted
        if (!mime || !accepted_extensions.includes(mime.ext))
            return next(new Error('The uploaded file is not in ' + accepted_extensions.join(", ") + ' format!'));

        next();
    }

};

