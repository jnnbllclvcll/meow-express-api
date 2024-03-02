const jwt = require("jsonwebtoken");
// User defined string data that will be used to create our JSON web tokens
// Used in the algorithm for encrypting our data which makes it difficult to decode the information without the defined secret keyword
const secret = "E-CommerceAPI";

// [SECTION] JSON Web Tokens
/*
	- JSON Web Tokens or JWT is a way of securely passing information from the server to the client or other parts of a server
	- Information is kept secure through the use of the secret code
	- Only the system that knows the secret code that can decode the encrypted information
	- Imagine JWT as a gift wrapping service that secures the gift with a lock
	- Only the person who knows the secret code can open the lock
	- And if the wrapper has been tampered with, JWT also recognizes this and disregard the gift
	- This ensures that the data is secure from the sender to the receiver
*/

// [SECTION] Token Creation/Token Encryption
/*
Analogy
 - Pack the gift and provide a lock with the secret code as the key
*/
module.exports.createAccessToken = (user) => {
	// The data will be received from the registration form
	// When the user logs in, a token will be created with user's information
	const data = {
		id : user.id,
		email: user.email,
		isAdmin: user.isAdmin
	};

	// Generate a JSON web token using the jwt's sign method
	// Generates the token using the form data and the secret code with no additional provided
	return jwt.sign(data, secret, {});
};

// [SECTION] Token Verification
/*
Analogy:
	- Receive the gift and open the lock to verify if the sender is legitimate and the gift was not tampered with
	- Verify will be used as a middleware in Express.js
	- Functions added as argument in an ExpressJS route are considered as middleware and is able to receive the request and response objects as well as next() function
*/

// [SECTION] Error handling while Calling Promise-based Methods
// ExpressJS has also a built-in support for error handling middleware which allows you to handle errors that occur during the execution of the application such as req, res, error, and next
module.exports.verify = (req, res, next) => {
	console.log(req.headers.authorization);

	// "req.headers.authorization" contains sensitive data and especially our token
	let token = req.headers.authorization;

	// This if statement will check if a token variable contains "undefined" or a proper jwt. We will check token's data type with "typeof", if it is "undefined" we will send a message to the client. Else if it is not, then we return the token.
	if(typeof token === "undefined"){
		return res.send({ auth: "Failed. No Token" });
	} else {
		console.log(token);
		token = token.slice(7, token.length);
		console.log(token);

		// [SECTION] Token Decryption
		/*
			Analogy:
				- Open the gift and get the content
				- Validate the tokenn using the "verify" method decrypting the token using the secret code
				- token - the jwt token passed from the request headers authorization
				- secret - the secret word from earlier which validates our token
				- function(err, decodedToken) - err contains error in verification, decodedToken contains the decoded data within the token after verification
		*/
		jwt.verify(token, secret, function(err, decodedToken){
			// If there was an error in verification, an erratic token, a wrong secret within the token, we will send a message to the client.
			if(err){
				return res.send({
					auth: "Failed",
					message: err.message
				});
			} else {
				// Contains the data from our token
				console.log("result from verify method:");
				console.log(decodedToken);

				// Else, if our token is verified to be correct, then we will update the request and add the user's decoded details.
				req.user = decodedToken;

				// next() is an expressJS function which allows us to move to the next function in the route. It also passes details of request and response to the next function/middleware
				next();
			}
		})
	}
}

// [SECTION] Verify if the user is admin
module.exports.verifyAdmin = (req, res, next) => {
	// console.log("result from verifyAdmin method:");
	// console.log(req.user);

	// Checks if the onwer of the token is an admin
	if(req.user.isAdmin){
		// If it is, move to the next middleware/controller using next() method.
		next();
	} else {
		// Else, end the request-response cycle by sending the appropriate response and status code
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}
}

// Middleware to check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) => {

	if(req.user) {
		next();
	} else {
		res.sendStatus(401);
	}
}