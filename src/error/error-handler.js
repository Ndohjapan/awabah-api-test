const en = require("../../locale/en");

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  let { status, message, errors } = err;
  status = status ? status : 500;
  let validationErrors;
  if (errors) {
    validationErrors = {};
    errors.forEach(
      (error) =>
        (validationErrors[error.path || "file"] = error.msg || error.message),
    );
  }
  if(status > 499){
    message = en["server-error"];
  }
  res.status(status).send({
    path: req.originalUrl,
    timestamp: new Date().getTime(),
    message: message,
    validationErrors,
  });
};
