const orderModel = require("../models/orderModel");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_SIGNING_SECRET;
const userModel = require("../models/userModel");

// Then define and call a method to handle the successful payment intent.
const handlePaymentIntentSucceeded = async (paymentIntent) => {
  const { id, amount, shipping, payment_method_types } = paymentIntent;
  const { address } = shipping;
  try {
    const order = await orderModel.create({
      amount: amount / 100,
      address: `${address.line1}, ${address.city}, ${address.state}, ${address.country}, ${address.postal_code}`,
      paymentType: payment_method_types[0],
      paymentStatus: "paid",
      products: JSON.parse(paymentIntent.metadata.product),
      userId: paymentIntent.metadata.user,
    });

    const userUpdate = await userModel.findByIdAndUpdate(
      paymentIntent.metadata.user,
      {
        $push: {
          orders: order._id,
        },
      }
    );

  
  } catch (error) {
    console.log(error);
  }
};

const webhook = async (req, res) => {
  let event = req.body;

  if (endpointSecret) {
    // Get the signature sent by Stripe
    const signature = request.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        endpointSecret
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`, err.message);
      return res.status(400).send("webhook error:" + err.message);
    }
  }

  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log(paymentIntent, 'paymentIntent');
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Then define and call a method to handle the successful payment intent.
      handlePaymentIntentSucceeded(paymentIntent).then(() => {
        res.status(200).json({message : "success", result : true})
      });
      break;
    default:
      // Unexpected event type
      console.log(`Unhandled event type ${event.type}.`);
  }
};

module.exports = { webhook };
