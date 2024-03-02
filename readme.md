# CAPSTONE 2: E-Commerce API Overview

# MeowExpress (Your Cats Need is In Your Hand)

## Team Members
- Clavecilla, Jonnabelle T.
- Andraje, Rey John

## User credentials:

### Admin User
- **Email**: admin@gmail.com
- **Password**: admin123/belle123


### Customers / Other Users

## Customer_1
- **First Name**: John
- **Last Name**: Doe 
- **Email**: john.doe@gmail.com
- **Password**: john1234
- **Mobile Number**: 09876543210
- **Address**: 123 Main Street, Cityville, Manila, Philipines


## Customer_2
- **First Name**: Alice
- **Last Name**: Smith 
- **Email**: alice.smith@gmail.com
- **Password**: alice1234
- **Mobile Number**: 09998877665
- **Address**: 456 Elm Street, Townsville, Cavite, Philipines

## Customer_3
- **First Name**: Michael
- **Last Name**: Johnson 
- **Email**: michael_johnson@gmail.com
- **Password**: michael1234
- **Mobile Number**: 09554433221
- **Address**: 789 Oak Street, Villagetown, Laguna, Philipines

## Customer_4
- **First Name**: Emily
- **Last Name**: Brown 
- **Email**: emily.brown@gmail.com
- **Password**: emily1234
- **Mobile Number**: 09123456789
- **Address**: 321 Pine Street, Hamletville, Batangas, Philipines

## Customer_5
- **First Name**: Sarah
- **Last Name**: Wilson 
- **Email**: sarah.wilson@gmail.com
- **Password**: sarah1234
- **Mobile Number**: 09449876543
- **Address**: 567 Maple Street, Riverside, Quezon, Philipines


## Features by Jonnabelle Clavecilla & Rey John Andraje


### 1. Users
- **POST - User Registration**: Register a new user.
- **POST - User Authentication**: Authenticate user and generate access token.
- **PATCH - Set User as Admin (Admin Only)**: Authenticate if user is an admin then update other user as an admin.
- **GET - Retrieve User Details**: Retrieve details of a specific user.
- **PATCH - Update Password**: Authenticate user and update password of user.
- **PUT - Update User Details**: Authenticate and update users details.
- **GET - Retrieve All Users (Admin Only)**: Authenticate and verify if user is an admin then retrieve the list of all users.
- **PATCH - Remove User as Admin (Admin Only)**: Authenticate logged in user if an admin then update other user to non-admin.


### 2. Products
- **POST - Create Product (Admin only)**: Authenticate logged in user then create a new product.
- **GET - Retrieve All Products**: Retrieve a list of all products.
- **GET - Retrieve All Available Products**: Retrieve a list of all available products.
- **GET - Retrieve Single Product Details**: Retrieve details of a specific product.
- **PUT - Update Product Information (Admin Only)**: Authenticate user and update details of an existing product.
- **PATCH - Archive Product (Admin Only)**: Authenticate user if an admin then remove a product.
- **PATCH - Activate Product (Admin Only)**: Authenticate user if an admin then make a product available.
- **GET - Search Products by Name**: Retrieve details of a specific product.
- **GET - Search Products by Price**: Retrieve details of a specific product.


### 3. Cart Resources
- **GET - Retrieve Users Cart**: Authenticate and retrieve user's cart.
- **POST - Add to Cart**: Add a product to the user's Cart.
- **PUT - Change Product Quantities**: Authenticate and update quantities of an existing product from cart.
- **Delete - Remove Products from Cart**: Authenticate and remove products from the cart.
- **Delete - Remove All Products from Cart**: Authenticate and remove all products from cart.


### 4. Order Resources
- **POST - Create Checkout**: Authenticate logged in user then create an order checkout.
- **GET - Retrieve Authenticated User's Orders**: Retrieve orders of authenticated user.
- **GET - Retrieve All Orders (Admin-only)**: Retrieve all orders of users.
