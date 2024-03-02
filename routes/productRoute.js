//[SECTION] Dependencies and Modules
const express = require("express");
const productController = require("../controllers/productController");
const Product = require("../models/Product");
const auth = require("../auth");
// Deconstruct the "auth" module so that we can simply store "verify" and "verifyAdmin" in their variables and reuse it in our routes
const {verify, verifyAdmin} = auth;

//[SECTION] Routing Component
const router = express.Router();

//[SECTION] Route for creating a product
router.post("/", verify, verifyAdmin, productController.addProduct); 

//[SECTION] Route for retrieving all products
router.get("/all", verify, productController.getAllProducts);

//[SECTION] Route for retrieving all available products
router.get("/", productController.getAllActiveProducts);

// [SECTION] Route for specific product
router.get("/:productId", productController.getProduct);

// [SECTION] Route for updating a product (Admin-only)
router.put("/:productId/update", verify, verifyAdmin, productController.updateProduct);

//[SECTION] Route to archiving a product (Admin-only)
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

//[SECTION] Route to activating a product (Admin-only)
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

// [SECTION] Route to search product by name
router.post('/products/searchByName', productController.searchProductByName);

// [SECTION] Route for searching products by price range
router.post('/products/searchByPrice', productController.searchProductsByPriceRange);

//[SECTION] Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;
