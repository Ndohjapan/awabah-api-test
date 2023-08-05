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
  check("description")
    .notEmpty()
    .withMessage(en["description-required"])
    .bail()
    .isString()
    .withMessage(en["description-format"]),
  check("stock")
    .notEmpty()
    .withMessage(en["stock-required"])
    .bail()
    .isString()
    .withMessage(en["stock-format"])
    .bail()
    .isEmail()
    .withMessage(en["email-format"]),
  check("price")
    .notEmpty()
    .withMessage(en["price-required"])
    .bail()
    .isString()
    .withMessage(en["price-format"])
    .bail()
    .isEmail()
    .withMessage(en["email-format"]),
  check("category")
    .notEmpty()
    .withMessage(en["category-required"])
    .bail()
    .isString()
    .withMessage(en["category-format"])
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(en["db-id-format"]);
      }
      return true;
    }),
  check("supplier")
    .notEmpty()
    .withMessage(en["supplier-required"])
    .bail()
    .isString()
    .withMessage(en["supplier-format"])
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
