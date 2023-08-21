const jwt = require("jsonwebtoken");

var ObjectBK = {};

var isAuthorized = function (req, res, next) {
  const token = req.session.jwtToken || "";
  let jwtSecretKey = process.env.JWT_SECRET_KEY;

  if (
    token &&
    jwtSecretKey &&
    token !== undefined &&
    jwtSecretKey !== undefined
  ) {
    const verified = jwt.verify(token, jwtSecretKey);
    if (verified) {
      next();
    }
  } else {
    // Access Denied
    res.redirect("/admin/login");
  }
};

var isAuthorizedSession = function (req, res, next) {
  //Validate auth by session
  if (req.session.isAdminActive) {
    next();
  } else {
    res.redirect("/admin/login");
  }
};

var validate_format = function (req, res, next) {
  // For MemoryStorage, validate the format using `req.file.buffer`
  // For DiskStorage, validate the format using `fs.readFile(req.file.path)` from Node.js File System Module
  let mime = fileType(req.file.buffer);

  // if can't be determined or format not accepted
  if (!mime || !accepted_extensions.includes(mime.ext))
    return next(
      new Error(
        "The uploaded file is not in " +
          accepted_extensions.join(", ") +
          " format!"
      )
    );

  next();
};

var isFormValidated = function (req, res, formArray, next) {
  for (const [key, value] of Object.entries(formArray)) {
    const exceptField = ["form", "submit"];

    if (value.required == true && !exceptField.includes(key)) {
      req.checkBody(key, "" + value.label + " is required").notEmpty();
    }

    if (value.required == true && !exceptField.includes(key)) {
      req.checkBody(key, "" + value.label + " is required").notEmpty();
    }
  }

  return req.validationErrors();
};

module.exports = {
  isAuthorized,
  isAuthorizedSession,
  validate_format,
  isFormValidated,
};
