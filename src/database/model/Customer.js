const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const en = require("../../../locale/en");
const bcrypt = require("bcrypt");

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
    password: {
      type: String,
      required: [true, en["password-required"]],
    },
  },
  {
    timestamps: true,
  },
);

CustomerSchema.plugin(mongoosePaginate);

CustomerSchema.index({ name: "text" });

CustomerSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("customer", CustomerSchema);
