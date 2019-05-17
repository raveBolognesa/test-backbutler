const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema(
  {
    price: String,
    description: String,
    title: String,
    author: Object,
    localization: String,
    date: String,
    imgProduct: String
  },
  {
    timestamps: {
      createdAt: "created_at",
      updatedAt: "updated_at"
    }
  }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
