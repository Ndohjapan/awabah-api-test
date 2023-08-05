const { validationResult, param } = require("express-validator");
const en = require("../../../locale/en");
const ValidationException = require("../../error/validation-exception");
const mongoose = require("mongoose");

const validateCustomerId = [
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

module.exports = { validateCustomerId };
