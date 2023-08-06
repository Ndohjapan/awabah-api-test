const { check, validationResult, param } = require("express-validator");
const en = require("../../../locale/en");
const ValidationException = require("../../error/validation-exception");
const mongoose = require("mongoose");

const validateCreateOrderInput = [
  check("totalAmount")
    .notEmpty()
    .withMessage(en["total-amount-required"])
    .bail()
    .isNumeric()
    .withMessage(en["total-amount-format"]),
  check("items")
    .notEmpty()
    .withMessage(en["items-required"])
    .bail()
    .isArray({ min: 1 })
    .withMessage(en["items-format"])
    .bail()
    .custom((value) => {
      for (const item of value) {
        if (!mongoose.Types.ObjectId.isValid(item.product)) {
          throw new Error(en["id-format"]);
        }
        if (typeof item.amount !== "number" || item.amount < 1) {
          throw new Error(en["product-find-error"]);
        }
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

const validateOrderId = [
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

const validateFilterOrderInput = [
  check("customer")
    .optional()
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

module.exports = { validateCreateOrderInput, validateOrderId, validateFilterOrderInput };
