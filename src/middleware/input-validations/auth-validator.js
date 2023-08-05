const { check, validationResult } = require("express-validator");
const en = require("../../../locale/en");
const ValidationException = require("../../error/validation-exception");

const validateAdminLoginInput = [
  check("email")
    .notEmpty()
    .withMessage(en["email-required"])
    .bail()
    .isString()
    .withMessage(en["email-format"])
    .bail()
    .isEmail()
    .withMessage(en["email-format"]),
  check("password")
    .notEmpty()
    .withMessage(en["password-required"])
    .bail()
    .isString()
    .withMessage(en["password-format"]),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];


module.exports = { validateAdminLoginInput };
