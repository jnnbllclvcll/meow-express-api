// [SECTION] Dependencies and Modules
const bcrypt = require("bcrypt");
const Order = require("../models/Order");
const Cart = require('../models/Cart');
const User = require('../models/User');
const auth = require("../auth");

// [SECTION] Controller for creating a new order
module.exports.createOrder = (req, res) => {
    // Extract user ID from request
    const userId = req.user.id;

    // Find the user's cart
    Cart.findOne({ userId })
        .then(cart => {
            // If cart not found, return 404 error
            if (!cart) {
                return res.status(404).json({ message: 'Cart not found for the user' });
            }

            // If cart has items
            if (cart.cartItems.length > 0) {
                // Extract total amount from the cart
                const totalAmount = cart.totalPrice;
                
                // If total amount is missing, return 400 error
                if (!totalAmount) {
                    return res.status(400).json({ message: 'Total price is missing in the cart' });
                }

                // Create a new order document
                const newOrder = new Order({
                    userId: cart.userId,
                    cartItems: cart.cartItems,
                    totalAmount: totalAmount,
                });

                // Save the new order
                return newOrder.save()
                    .then(() => {
                        // Delete the user's cart after order placement
                        return Cart.findOneAndDelete({ userId })
                            .then(() => {
                                res.status(200).json({ message: 'Order placed successfully', order: newOrder });
                            });
                    })
                    .catch(error => {
                        // Handle errors during order placement
                        console.error(error);
                        res.status(500).json({ message: 'Error during checkout', error: error.message });
                    });
            } else {
                // If cart is empty, return 400 error
                return res.status(400).json({ message: 'Cart is empty' });
            }
        })
        .catch(error => {
            // Handle errors during cart retrieval
            console.error(error);
            res.status(500).json({ message: 'Error during checkout', error: error.message });
        });
};

// [SECTION] Controller for getting orders of the authenticated user
module.exports.getMyOrders = async (req, res) => {
    try {
        // Extract user ID from request
        const userId = req.user.id;

        // Find orders of the user
        const orders = await Order.find({ userId });

        // If no orders found, return 404 error
        if (orders.length === 0) {
            res.status(404).json({ message: 'No orders found for the user' });
        } else {
            // If orders found, return them
            res.status(200).json({ orders });
        }
    } catch (error) {
        // Handle internal server errors
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}

// [SECTION] Controller for getting all orders (admin)
module.exports.getAllOrders = async (req, res) => {
    try {
        // Extract user ID from request
        const userId = req.user.id;

        // Find the user (admin)
        const user = await User.findById(userId);

        // Find all orders
        const orders = await Order.find();

        // Return all orders
        res.status(200).json({ orders });
    } catch (error) {
        // Handle internal server errors
        console.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
}
