// [SECTION] Dependencies and Modules
const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../auth");



// [SECTION] User Registration
module.exports.registerUser = (req, res) => {

	// Checks if the email is in the right format
	if (!req.body.email.includes('@')){
		return res.status(400).send({ error: 'Email invalid' });
	}

	// Checks if the mobile number has the correct number of characters
	else if (req.body.mobileNo.length !== 11){
		return res.status(400).send({ error: 'Mobile number invalid'});
	}
	// Checks if the password has atleast 8 characters
	else if (req.body.password.length < 8) {
		return res.status(400).send({ error: 'Password must be atleast 8 characters'});
	}
	// Checks if the password has atleast 8 characters
	else if (!req.body.address) {
		return res.status(400).send({ error: 'Please enter your address'});

	// If all needed requirements are achieved
	} else {
		// Creates a variable "newUser" and instantiates a new "User" object using the mongoose model
		// Uses the information from the request body to provide all the necessary/required information
		let newUser = new User({
			firstName: req.body.firstName,
			lastName: req.body.lastName,
			email: req.body.email,
			mobileNo: req.body.mobileNo,
			address: req.body.address,
			// 10 is the value provided as the number of "salt" rounds that the bcrypt algorithm will run in order to encrypt the password
			password: bcrypt.hashSync(req.body.password, 10)
		})

		// Saves the created object to our database
		// Then, return result to the handler function. No return keyword used because we're using arrow function's implicit return feature
		// Catch the error and return to the handler function. No return keyword used because we're using arrow function's implicit return feature
		// handler function often refers to the functions that handle specific routes in our application
		return newUser.save()
		.then((result) => res.status(201).send({ message: 'You have registered successfully!' }))
		.catch(err => {
			console.error('Error in saving: ', err)
			return res.status(500).send({ error: 'Internal Server Error'})
		});
	}

};


// [SECTION] User Login to an Authenticated Account
module.exports.loginUser = (req, res) => {
	if(req.body.email.includes('@')){
		return User.findOne({ email: req.body.email })
		.then(result => {
			// User does not exist
			if(result == null){
				return res.status(404).send({ error: 'No Email Found'});
			// User exists
			} else {
				// Creates a variable "isPasswordCorect" to return the result of comparing the login form password and the database password
				// the "compareSync" method is used to compare a non-encrypted password from the login form to the encrypted password
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password)
				// If the passwords match the result of the above code is true
				if(isPasswordCorrect){
					// Generate an access token
					// Uses the "createAccessToken" method defined in the "auth.js" file
					// Returning an object back to the client application is common practice to ensure information is properly labeled and real world examples normally return more complex information represented by ojects.
					return res.status(200).send({ access: auth.createAccessToken(result) })
				// Password does not match
				} else {
					return res.status(401).send({ message: 'Email and password do not match'});
				} 
			}
		})
		.catch(err => {
			console.log('Error in find: ', err);
			res.status(500).send({ error: 'Internal Server Error'});
		});
	} else {
		return res.status(400).send({error: 'Invalid Email'});
	}
};


// [SECTION] Retrieve All Users (Admin Only)
module.exports.getAllUsers = (req, res) => {

    return User.find({}).then(users => {
        if(users.length > 0){
            return res.status(200).send({ users });
        }
        else{
                // 200 is a result of a successful request, even if the response returned no record/content
            return res.status(200).send({ message: 'No users found.' });
        }
    })
    .catch(err => {
        console.error("Error in finding all users: ", err)
        return res.status(500).send({ error: 'Internal Server Error' })
    });

};


//[SECTION] Retrieve User Details
module.exports.getProfile = (req, res) => {

	const userId = req.user.id;

	User.findById(userId)
	.then(user => {
		if (!user) {
			return res.status(404).send({ error: 'User not found' });
		}

        // This will exclude sensitive information such as password.
		user.password = undefined;

		return res.status(200).send({ user });
	})
	.catch(err => {
		console.error("Error in fetching user profile", err)
		return res.status(500).send({ error: 'Failed to fetch user profile' })
	});
};


// [SECTION] Set User as Admin (Admin Only)
module.exports.updateUserAsAdmin = (req, res) => {
	// Check if the user making the request is an admin
    // if (!req.user.isAdmin) {
    //     return res.status(403).json({ error: 'Unauthorized: Only admin users can perform this action.' });
    // }

    const userId = req.params.userid;
    let user;

    // Find the user by ID
    User.findById(userId)
        .then(foundUser => {
            // Check if the user exists
            if (!foundUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            user = foundUser;
            // Update the user as admin
            user.isAdmin = true;
            // Save the updated user
            return user.save();
        })
        .then(() => {
            // Return success message
            res.status(200).json({ message: 'User updated successfully as admin' });
        })
        .catch(error => {
            console.error('Error updating user as admin: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};


// [SECTION] Update User Password
module.exports.resetPassword = (req, res) => {
    // Extract user ID from the authorization headers
    const { newPassword } = req.body;
    const { id } = req.user;

    // Hash the new password
    bcrypt.hash(newPassword, 10)
        .then(hashedPassword => {
            // Update the user's password in the database
            return User.findByIdAndUpdate(id, { password: hashedPassword });
        })
        .then(() => {
            // Send success response
            res.status(200).json({ message: 'Password reset successfully' });
        })
        .catch(error => {
            // Handle errors
            console.error(error);
            res.status(500).json({ message: 'Internal Server error' });
        });
};



// [ADD-ONS]

// [SECTION] Updating User Profile
// Controller function to update the user profile
module.exports.updateProfile = (req, res) => {
    const userId = req.user.id;
    const { firstName, lastName, email, mobileNo, address } = req.body;

    User.findById(userId)
        .then(user => {
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            // Update user profile fields
            user.firstName = firstName;
            user.lastName = lastName;
            user.email = email;
            user.mobileNo = mobileNo;
            user.address = address;

            // Save the updated user profile
            return user.save();
        })
        .then(updatedUser => {
            // Send success response
            res.status(200).json({ message: 'User profile updated successfully', user: updatedUser });
        })
        .catch(error => {
            console.error('Error updating user profile:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};




//[SECTION] Remove User as Admin
module.exports.updateUserAsNotAdmin = (req, res) => {
	// Check if the user making the request is an admin
    if (!req.user.isAdmin) {
        return res.status(403).json({ error: 'Unauthorized: Only admin users can perform this action.' });
    }

    const userId = req.params.userid;
    let user;

    // Find the user by ID
    User.findById(userId)
        .then(foundUser => {
            // Check if the user exists
            if (!foundUser) {
                return res.status(404).json({ message: 'User not found' });
            }
            user = foundUser;
            // Update the user as admin
            user.isAdmin = false;
            // Save the updated user
            return user.save();
        })
        .then(() => {
            // Return success message
            res.status(200).json({ message: 'User removed successfully as admin' });
        })
        .catch(error => {
            console.error('Error updating user as admin: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        });
};

