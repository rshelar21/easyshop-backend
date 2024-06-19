const mongoose = require("mongoose");

const productScchema = new mongoose.Schema({
  productId: Number,
  title: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  rating: {
    rate: Number,
    count: Number,
  },
});
const productModel = mongoose.model("Product", productScchema);

module.exports = productModel;
