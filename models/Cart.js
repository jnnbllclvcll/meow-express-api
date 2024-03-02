const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: [true, "UserId is required"],
	},
	email: {
		type: String,
		required: [true, "Email is required"],
	},
	cartItems: [
		{
			productId: {
				type: String,
				required: [true, "Product ID is required"],
			},
			name: {
				type: String,
				required: [true, "Product name is required"],
			},
			quantity: {
				type: Number,
				required: [true, "Quantity is required"],
			},
			price: {
				type: Number,
				required: [true, "Price is required"],
			},
			subTotal: {
				type: Number,
				required: [true, "SubTotal is required"],
			},

		},

	],
	totalPrice: {
    	type: Number,
    	required: [true, 'Total Price is Required']
  	},

	addedOn: {
		type: Date,
		default: new Date(),
	},
});

module.exports = mongoose.model("Cart", cartSchema);