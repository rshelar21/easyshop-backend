const express = require("express");
const router = express.Router();
const { buyProducts, getProducts } = require("../controller/product");
const { authCheck } = require("../middleware/auth");

router.post("/create-checkout-session", authCheck, buyProducts);
router.get("/products", getProducts);

module.exports = router;
