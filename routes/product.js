const express = require("express");
const router = express.Router();
const { buyProducts, getProducts,getProductsByQuery } = require("../controller/product");
const { authCheck } = require("../middleware/auth");

router.post("/create-checkout-session", authCheck, buyProducts);
router.get("/products", getProducts);
router.get("/search-products", getProductsByQuery);

module.exports = router;
