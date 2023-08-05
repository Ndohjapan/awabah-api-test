const { check, validationResult, param } = require("express-validator");
const en = require("../../../locale/en");
const ValidationException = require("../../error/validation-exception");
const mongoose = require("mongoose");

const validateCreateSupplierInput = [
  check("name")
    .notEmpty()
    .withMessage(en["name-required"])
    .bail()
    .isString()
    .withMessage(en["name-format"]),
  check("address")
    .notEmpty()
    .withMessage(en["address-required"])
    .bail()
    .isString()
    .withMessage(en["address-format"]),
  check("email")
    .notEmpty()
    .withMessage(en["email-required"])
    .bail()
    .isString()
    .withMessage(en["email-format"])
    .bail()
    .isEmail()
    .withMessage(en["email-format"]),
  check("phone")
    .notEmpty()
    .withMessage(en["phone-required"])
    .bail()
    .isNumeric()
    .withMessage(en["phone-format"])
    .bail()
    .isLength({min: 10, max: 11})
    .withMessage(en["phone-length"]),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

const validateSupplierId = [
  param("id")
    .not()
    .isEmpty()
    .withMessage(en["id-null"])
    .bail()
    .isString()
    .withMessage(en["id-format"])
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(en["db-id-format"]);
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(new ValidationException(errors.array()));
    }
    next();
  },
];

module.exports = { validateCreateSupplierInput, validateSupplierId };
