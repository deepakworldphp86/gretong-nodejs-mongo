const jwt = require("jsonwebtoken");

var isAuthorized = function (req, res, next) {
  const token = req.session.jwtToken || "";
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  if (!token || !jwtSecretKey) {
    req.session.isAdminActive = false;
    return res.redirect("/admin/login");
  }

  jwt.verify(token, jwtSecretKey, (err, decoded) => {
    if (err) {
      req.session.isAdminActive = false;
      if (err.name === 'TokenExpiredError') {
        return res.redirect("/admin/login");
      }
      return res.status(401).send({ message: 'Unauthorized access' });
    }

    req.user = decoded;
    req.session.isAdminActive = true;
    next();
  });
};

module.exports = isAuthorized;


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
