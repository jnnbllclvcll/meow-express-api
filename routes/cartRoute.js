//[SECTION] Dependencies and Modules
const express = require("express");
const cartController = require("../controllers/cartController");
const auth = require("../auth");
// Deconstruct the "auth" module so that we can simply store "verify" and "verifyAdmin" in their variables and reuse it in our routes
const {verify, verifyAdmin} = auth;

//[SECTION] Routing Component
const router = express.Router();

// [SECTION] Route for getting user's cart
router.get("/get-cart", verify, cartController.getCart); 

// [SECTION] Route for creating/adding user's cart
router.post("/add-to-cart", verify, cartController.addtoCart);

// [SECTION] Route for updating user's product quantity
router.put("/update-cart-quantity", verify,cartController.updateCartQuantity); 

// [SECTION] Route to delete a cart item
router.delete('/:productId/remove-from-cart', verify, cartController.deleteCartItem);

// [SECTION] Route to clear cart of user
router.delete('/clear-cart', verify, cartController.deleteAllItems);


//[SECTION] Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;
