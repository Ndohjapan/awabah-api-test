const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const OrderSchema = new mongoose.Schema(
  {
    items: {
      type: [
        {
          product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
            required: true,
          },
          amount: {
            type: Number,
            required: true,
            min: 1,
          },
        },
      ],
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },
    totalAmount: {
      type: Number,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

OrderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("order", OrderSchema);
