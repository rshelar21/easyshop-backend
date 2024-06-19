const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
const cors = require("cors");
const db = require("./config/mongoDB");
require("dotenv").config({ path: ".env" });
const userRouter = require("./routes/user");
const cookieParser = require("cookie-parser");
const productRouter = require("./routes/product");
const corsOpt = require("./config/corsOpt");
const webhookController = require("./routes/webhook");
const orderRouter = require("./routes/orderHistory");
const productModel = require("./models/productModel");

app.use(cors(corsOpt));
app.use(express.json()); // To parse the incoming requests with JSON payloads
app.use(express.urlencoded({ extended: false })); // To parse the incoming requests with urlencoded payloads
app.use(cookieParser());

app.get("/", function (req, res) {
  res.send(req.cookies);
});

app.use("/api/v1", userRouter);
app.use("/api/v1", productRouter);
app.use("/api/webhook", webhookController);
app.use("/api/v1", orderRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
