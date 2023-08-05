const mongoose = require("mongoose");
const en = require("../../../locale/en");
const bcrypt = require("bcrypt");

const AdminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, en["admin-name-required"]],
  },
  email: {
    type: String,
    required: [true, en["email-required"]],
    unique: [true, en["email-taken"]],
  },
  permissions: {
    type: [String],
    required: true,
    default: []
  },
  password: {
    type: String,
    required: [true, en["password-required"]],
  },
  status: {
    type: String,
    enum: ["active", "disabled"],
    default: "active",
  },
  type: {
    type: String,
    enum: ["sub-admin", "main-admin"],
    default: "sub-admin",
  },
});

AdminSchema.methods.validatePassword = function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("admin", AdminSchema);
