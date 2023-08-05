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

const validateCustomerSignupInput = [
  check("email")
    .notEmpty()
    .withMessage(en["email-required"])
    .bail()
    .isString()
    .withMessage(en["email-format"])
    .bail()
    .isEmail()
    .withMessage(en["email-format"]),
  check("address")
    .notEmpty()
    .withMessage(en["address-required"])
    .bail()
    .isString()
    .withMessage(en["address-format"]),
  check("name")
    .notEmpty()
    .withMessage(en["name-required"])
    .bail()
    .isString()
    .withMessage(en["name-format"]),
  check("phone")
    .notEmpty()
    .withMessage(en["phone-required"])
    .bail()
    .isNumeric()
    .withMessage(en["phone-format"])
    .bail()
    .isLength({ min: 10, max: 11 })
    .withMessage(en["phone-length"]),
  check("password")
    .notEmpty()
    .withMessage(en["password-required"])
    .bail()
    .isString()
    .withMessage(en["password-format"])
    .bail()
    .isLength({ min: 8 })
    .withMessage(en["password-length"])
    .bail()
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    )
    .withMessage(en["password-requirement"]),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

module.exports = { validateAdminLoginInput, validateCustomerSignupInput };
