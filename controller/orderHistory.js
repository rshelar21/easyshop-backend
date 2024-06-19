const userModel = require("../models/userModel");
const orderModel = require("../models/orderModel");

const orderData = async (req, res) => {
  try {
    const user = req.user;
    console.log(user);
    const product = await orderModel.find({userId : user?.id});
    if (!product.length)
      return res
        .status(200)
        .json({ message: "No product found", result: false, product : [] });
    res.status(200).json({ product, result: true, message: "Product found" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", result: false });
  }
};

module.exports = { orderData };
