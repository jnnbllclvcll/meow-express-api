// [SECTION] Dependencies and Modules
const bcrypt = require("bcrypt");
const Product = require("../models/Product");
const auth = require("../auth");

// [SECTION] Add a new product
module.exports.addProduct = (req, res) => {

        let newProduct = new Product({
        name : req.body.name,
        category : req.body.category,
        description : req.body.description,
        price : req.body.price,
        src : req.body.src

    });

    Product.findOne({ name: req.body.name })
    .then(existingProduct => {
        if(existingProduct){
            return res.status(409).send({ error : 'Product already exists'});
        }

        // Saves the created object to our database
        return newProduct.save()
        .then(savedProduct => {
            res.status(201).send('Product successfully added.')
        })
        // Error handling is done using .catch() to capture any errors that occur during the course save operation
        // .catch(err => err) captures the error but does not take any action, it's only capturing the error to pass it on to the next .then() or .catch() method in the chain. Postman is waiting for a response to be sent back to it but is not receiving anything
        .catch(saveErr => {
            console.error("Error in save product: ", saveErr)
            res.status(500).send({error: 'Failed to save the product'})
        })
    })
    .catch(findErr => {
        console.error("Error in finding the product: ", findErr)
        return res.status(500).send({ error: "Error finding the product" });
    });
}; 

// [SECTION] Get all products
module.exports.getAllProducts = (req, res) => {
    Product.find()
        .then(products => {
            res.send(products);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

// [SECTION] Get all available products
module.exports.getAllActiveProducts = (req, res) => {
    Product.find()
        .then(products => {
            res.json(products);
        })
        .catch(error => {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

// [SECTION] Get product by ID
module.exports.getProduct = (req, res) => {

    const productId = req.params.productId;

    Product.findById(productId)
    .then(product => {
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }
        return res.status(200).send({ product });
    })
    .catch(err => {
        console.error("Error in fetching the product: ", err)
        return res.status(500).send({ error: 'Internal Server Error' });
    })
    
};


// [SECTION] Update product by ID
module.exports.updateProduct = (req, res) => {
       // Made variable names more descriptive to enhance code readability
    const productId = req.params.productId;

    let updatedProduct = {
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        src: req.body.src
    } 

    Product.findByIdAndUpdate(productId, updatedProduct, { new : true })
    .then(updatedProduct => {

        if(!updatedProduct) {
            return res.status(404).send({ error: 'Product not found'});
        } 
        return res.status(200).send({ 
            message: 'Product updated successfully', 
            updatedProduct: updatedProduct 
        })
    })
    .catch(err => {
        console.error("Error in updating a product: ", err)
        return res.status(500).send({error: 'Internal Server Error.'})
    });
};



// [SECTION] Archive product by ID
module.exports.archiveProduct = (req, res) => {
    let updateActiveField = {
        isAvailable: false
    }

    if (req.user.isAdmin == true){
        return Product.findByIdAndUpdate(req.params.productId, updateActiveField, { new : true})
        .then(archiveProduct => {
            if (!archiveProduct) {
                return res.status(404).send({ error: 'Product not found' });
            }
            return res.status(200).send({ 
                message: 'Product archived successfully', 
                archivingProduct: archiveProduct 
            });
        })
        .catch(err => {
            console.error("Error in archiving a product: ", err)
            return res.status(500).send({ error: 'Internal Server Error' })
        });
    }
    else {
        return res.status(403).send({ error: 'Unauthorized: Only admin users can perform this action.' });
    }
};



// [SECTION] Activate product by ID
module.exports.activateProduct = (req, res) => {

    let updateActiveField = {
        isAvailable: true
    };

    if (req.user.isAdmin) {
        Product.findByIdAndUpdate(req.params.productId, updateActiveField, { new: true }) // { new: true } ensures that the updated document is returned
            .then(activatedProduct => {
                if (!activatedProduct) {
                    return res.status(404).send({ error: 'Product not found' });
                }
                return res.status(200).send({ 
                    message: 'Product activated successfully', 
                    activatingProduct: activatedProduct // Send the updated product data
                });
            })
            .catch(err => {
                console.error("Error in activating a product: ", err);
                return res.status(500).send({ error: 'Internal Server Error' });
            });
    } else {
        return res.status(403).send({ error: 'Unauthorized: Only admin users can perform this action.' });
    }
};


// [SECTION] Search Product By Name
// Controller method for searching products by name
module.exports.searchProductByName = (req, res) => {
    // Extract the 'name' parameter from the request body
    const { name } = req.body;

    // Use a regular expression to perform a case-insensitive search
    // The $regex operator is used to match the 'name' field with the specified pattern
    // $options: 'i' makes the regex case-insensitive

    // Query the database for products based on the provided 'name' parameter
    Product.find({ name: { $regex: name, $options: 'i' } })
        .then(products => {
            // Respond with the found products in JSON format
            res.status(200).json(products);
        })
        .catch(error => {
            // Handle any errors that occur during the asynchronous operation
            console.error(error);

            // Respond with a 500 Internal Server Error if an error occurs
            res.status(500).json({ error: 'Internal Server Error' });
        });
};


// [SECTION] Search Products By Price Range
// Controller method for searching products by price range
module.exports.searchProductsByPriceRange = (req, res) => {
    const { minPrice, maxPrice } = req.body;

    // Validate input
    if (!minPrice || !maxPrice) {
        return res.status(400).json({ error: 'Both minPrice and maxPrice are required' });
    }

    // Find products within the given price range
    Product.find({ price: { $gte: minPrice, $lte: maxPrice } })
        .then(products => {
            res.json({ products });
        })
        .catch(error => {
            console.error('Error searching products by price range:', error);
            res.status(500).json({ error: 'Internal server error' });
        });
};
