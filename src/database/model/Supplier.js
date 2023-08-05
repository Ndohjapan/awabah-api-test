const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const SupplierSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  },
);

SupplierSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("supplier", SupplierSchema);
