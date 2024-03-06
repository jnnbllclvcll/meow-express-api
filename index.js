// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");



// Allows our backend application to be available to our frontend application
// Allows us to control the app's Cross-Origin Resources Sharing settings
const cors = require("cors");
const userRoutes = require("./routes/userRoute");
const productRoutes = require("./routes/productRoute");
const cartRoutes = require("./routes/cartRoute");
const orderRoutes = require("./routes/orderRoute");

// [SECTION] Environment Setup
const port = 4000;
const mongoURI = process.env.MEOW_EXPRESS_MONGODB_URI || "mongodb://localhost:27017/Meow-Express-API"; // Use environment variable or default to local MongoDB


// [SECTION] Server Setup
// Creates an "app" variable that stores the result of the "express" function that initializes our express application and allows us access to different methods that wiill make backend creation easy
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());


// [SECTION] Database Connection
mongoose.connect(mongoURI);

mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

// [SECTION] Backend Routes
app.use("/b3/users", userRoutes); 
app.use("/b3/products", productRoutes);
app.use("/b3/cart", cartRoutes);
app.use("/b3/orders", orderRoutes);

// app.use("/users", userRoutes); 
// app.use("/products", productRoutes);
// app.use("/cart", cartRoutes);
// app.use("/orders", orderRoutes);

// [SECTION] Server Gateway Response
if(require.main === module){
    // "process.env.PORT || port" will use the environment variable if it is avaiable OR will used port 4000 if none is defined
    app.listen(process.env.PORT || port, () => {
        console.log(`API is now online on port ${process.env.PORT || port}`)
    });
}

module.exports = { app, mongoose };