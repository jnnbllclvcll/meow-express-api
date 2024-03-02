//[SECTION] Dependencies and Modules
const express = require("express");
const orderController = require("../controllers/orderController");
const auth = require("../auth");
// Deconstruct the "auth" module so that we can simply store "verify" and "verifyAdmin" in their variables and reuse it in our routes
const { verify, verifyAdmin } = auth;

//[SECTION] Routing Component
const router = express.Router();

// [SECTION] Route for creating a new order (checkout)
router.post("/checkout", verify, orderController.createOrder);

// [SECTION] Route for retrieving authenticated user's orders
router.get("/my-orders", verify, orderController.getMyOrders);

// [SECTION] Route for retrieving all orders (admin only)
router.get("/all-orders", verify, verifyAdmin, orderController.getAllOrders);

//[SECTION] Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;
