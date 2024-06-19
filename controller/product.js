const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const purchase = async (req, res) => {
  const { email, items } = req.body;

  try {
    // console.log(process.env.FRONTEND_URL);
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
      success_url: `http://localhost:3000/orders-history`,
      cancel_url: 'http://localhost:3000/',
    });
    res.status(200).json({ result: true, id: session.id });
  } catch (error) {
    res.status(500).json({ message: error.message, result: false });
  }
};

module.exports = { purchase };
