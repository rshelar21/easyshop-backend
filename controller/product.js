const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const productModel = require("../models/productModel");
const { options } = require("../routes/product");

const buyProducts = async (req, res) => {
  const { email, items } = req.body;

  try {
    const user = await req.user;

    const transformItems = await items?.map((item) => ({
      quantity: 1,
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title,
          images: [item.image],
          description: item.description,
        },
        unit_amount: 100 * (item.price * item.quantity),
      },
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_address_collection: {
        allowed_countries: ["IN"],
      },
      line_items: transformItems,
      mode: "payment",
      payment_intent_data: {
        metadata: {
          product: JSON.stringify(
            items.map((item) => ({
              image: item.image,
              title: item.title,
            }))
          ),
          user: user?.id,
        },
      },
      success_url: `https://easyshop-eta.vercel.app/orders-history`,
      cancel_url: "https://easyshop-eta.vercel.app",
    });
    res.status(200).json({ result: true, id: session.id });
  } catch (error) {
    res.status(500).json({ message: error.message, result: false });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await productModel.find({});

    if (!products.length) {
      res
        .status(200)
        .json({ message: "No products found", result: false, products: [] });
    }
    res.status(200).json({
      message: "Products found",
      result: true,
      products,
    });
  } catch (error) {
    console.log(error);
  }
};

const getProductsByQuery = async (req, res) => {
  const title = req.query.title;
  try {
    const queryProductsList = await productModel.find({
      title: { $regex: title, $options: "i" },
    });
    if (!queryProductsList.length) {
      res
        .status(200)
        .json({ message: "No products found", result: false, products: [] });
    }

    res.status(200).json({
      message: "Products found",
      result: true,
      products: queryProductsList,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = { buyProducts, getProducts, getProductsByQuery };
