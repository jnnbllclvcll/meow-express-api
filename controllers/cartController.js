// [SECTION] Dependencies and Modules
const bcrypt = require("bcrypt");
const Cart = require("../models/Cart");
const User = require("../models/User");
const Product = require("../models/Product");
const auth = require("../auth");



// [SECTION] Get Cart
// Controller method for getting user's cart
module.exports.getCart = (req, res) => {
    // Check if user is authenticated
    if (!req.user || req.user.isAdmin) {
        return res.status(403).send({ error: "User Unauthorized" });
    }

    // Find the user's cart
    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            if (!cart) {
                return res.status(404).send({ error: "No cart found" });
            } else {
                return res.status(200).send({ cart: cart });
            }
        })
        .catch(err => {
            console.error("Error in getting cart:", err);
            return res.status(500).send({ error: "Failed to get the cart" });
        });
};

// [SECTION] Add to Cart
// Controller method for adding a product to the cart
module.exports.addtoCart = (req, res) => {
    // Check if user is authenticated
    if (req.user.isAdmin) {
        return res.status(403).send({ error: "User Unauthorized" });
    }

    // Find the product by its ID
    Product.findById(req.body.productId)
        .then(product => {
            // Check if the product exists
            if (!product) {
                return res.status(404).send({ error: "Product not found" });
            }

            // Calculate subtotal for the product
            const subTotal = req.body.quantity * product.price;

            // Create a new cart item with subtotal
            const newCartItem = {
                productId: product.id,
                name: product.name,
                quantity: req.body.quantity,
                price: product.price,
                subTotal: subTotal, // Add subtotal for each item
            };

            // Find or create the user's cart
            return Cart.findOne({ userId: req.user.id }).then(cart => {
                // If cart doesn't exist, create a new one
                if (!cart) {
                    cart = new Cart({
                        userId: req.user.id,
                        email: req.user.email,
                        cartItems: [newCartItem],
                        totalPrice: subTotal, // Initialize totalPrice with subtotal
                    });
                } else {
                    // If cart exists, add the new item to cartItems array and update totalPrice
                    cart.cartItems.push(newCartItem);
                    cart.totalPrice += subTotal;
                }

                // Save the cart
                return cart.save();
            });
        })
        .then(cart => {
            // Send success response
            res.status(200).json({ message: 'Product added to cart successfully', cart: cart });
        })
        .catch(error => {
            // Handle errors
            console.error(error);
            res.status(500).json({ error: 'Internal server error', details: error.message });
        });
};

// [SECTION] Update Cart Quantity
// Controller method for updating the quantity of a product in the cart
module.exports.updateCartQuantity = (req, res) => {
    // Check if user is authenticated
    if (!req.user) {
        return res.status(403).send({ error: "User Unauthorized" });
    }
    // Find the product by its ID
    Product.findById(req.body.productId)
        .then(product => {
            // Check if the product exists
            if (!product) {
                return res.status(404).send({ error: "Product not found" });
            }

            // Find or create the user's cart
            return Cart.findOne({ userId: req.user.id }).then(cart => {
                // Calculate subtotal for the product
                const subTotal = req.body.quantity * product.price;

                // If cart doesn't exist, create a new one
                if (!cart) {
                    cart = new Cart({
                        userId: req.user.id,
                        cartItems: [],
                        totalPrice: 0,
                    });
                }

                // Check if the product is already in the cart
                const existingProductIndex = cart.cartItems.findIndex(item => item.productId === req.body.productId);

                if (existingProductIndex !== -1) {
                    // Update the quantity and subtotal of the existing product in the cart
                    cart.cartItems[existingProductIndex].quantity = req.body.quantity;
                    cart.cartItems[existingProductIndex].subTotal = subTotal;
                } else {
                    // Create a new cart item with subtotal
                    const newCartItem = {
                        productId: product.id,
                        name: product.name,
                        quantity: req.body.quantity,
                        price: product.price,
                        subTotal: subTotal, // Add subtotal for each item
                    };
                    
                    // If product not found in cart, add it to cartItems array
                    cart.cartItems.push(newCartItem);
                }

                // Update totalPrice by recalculating it based on all cart items
                cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subTotal, 0);

                // Save the cart
                return cart.save();
            });
        })
        .then(cart => {
            // Send success response
            res.status(200).json({ message: 'Cart updated successfully', cart: cart });
        })
        .catch(error => {
            // Handle errors
            console.error(error);
            res.status(500).json({ error: 'Internal server error', details: error.message });
        });
};


// [SECTION] Delete Cart Item
// Controller method for deleting a product from the cart
module.exports.deleteCartItem = (req, res) => {
    // Check if user is authenticated
    if (!req.user) {
        return res.status(403).send({ error: "User Unauthorized" });
    }

    // Find the user's cart
    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            // Check if the cart exists
            if (!cart) {
                return res.status(404).send({ error: "Cart not found" });
            }

            // Find the index of the item with the given productId
            const itemIndex = cart.cartItems.findIndex(item => item.productId === req.params.productId);

            // If item with productId exists, remove it from the cart
            if (itemIndex !== -1) {
                const removedItem = cart.cartItems.splice(itemIndex, 1)[0]; // Remove the item from the cartItems array
                cart.totalPrice -= removedItem.subTotal; // Subtract the subtotal of the removed item from the totalPrice

                // Save the updated cart
                return cart.save().then(updatedCart => {
                    // Send success response
                    res.status(200).json({ message: 'Item deleted from cart successfully', cart: updatedCart });
                });
            } else {
                return res.status(404).send({ error: "Item not found in cart" });
            }
        })
        .catch(error => {
            // Handle errors
            console.error(error);
            res.status(500).json({ error: 'Internal server error', details: error.message });
        });
};


// [SECTION] Delete All Items
// Controller method for clearing all items from the cart
module.exports.deleteAllItems = (req, res) => {
    // Check if user is authenticated
    if (!req.user) {
        return res.status(403).send({ error: "User Unauthorized" });
    }

    // Find the user's cart
    Cart.findOne({ userId: req.user.id })
        .then(cart => {
            // Check if the cart exists
            if (!cart) {
                return res.status(404).send({ error: "Cart not found" });
            }

            // Clear all items in the cart
            cart.cartItems = [];
            cart.totalPrice = 0;

            // Save the updated cart
            return cart.save().then(updatedCart => {
                // Send success response
                res.status(200).json({ message: 'Cart cleared successfully', cart: updatedCart });
            });
        })
        .catch(error => {
            // Handle errors
            console.error(error);
            res.status(500).json({ error: 'Internal server error', details: error.message });
        });
};
