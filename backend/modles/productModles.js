const mongoose = require("mongoose");
const productScema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      require: true,
    },
    price: {
      type: Number,
      trim: true,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    content: {
      type: Number,
      require: true,
    },
    images: {
      type: Object,
      require: true,
    },
    category: {
      type: String,
      require: true,
    },
    checked: {
      type: Boolean,
      default: false,
    },
    sold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);
module.exports = mongoose.model("Products", productScema);
