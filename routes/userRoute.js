// [SECTION] Dependencies and Modules
const express = require("express");
const userController = require("../controllers/userController");
// Import the auth module and deconstruct it to get our verify method.
const {verify, verifyAdmin} = require("../auth");


// [SECTION] Routing Component
const router = express.Router();

// [SECTION] ROUTES for USER

// [SECTION] Route for user registration
router.post("/", userController.registerUser);

// [SECTION] Route for user authentication
router.post("/login", userController.loginUser);

// [SECTION] Route to retrieve all users
router.get('/retrieve-allUsers', verify, verifyAdmin, userController.getAllUsers);

//[SECTION] Route for retrieving user details
router.get("/details", verify, userController.getProfile);

// [SECTION] Route for resseting the user password
router.patch('/update-password', verify, userController.resetPassword);

// [SECTION] Route for update user profile
router.put('/update-details', verify, userController.updateProfile);

// Route to update user as admin
router.patch('/:userid/set-as-admin', verify, userController.updateUserAsAdmin);

// [SECTION] Route to update user as not an admin
router.patch('/:userid/remove-admin', verify, verifyAdmin, userController.updateUserAsNotAdmin);


// [SECTION] Export Route System
// Allows us to export the "router" object that will be accessed in our "index.js" file
module.exports = router;