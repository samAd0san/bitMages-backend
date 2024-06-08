const bcrypt = require('bcrypt');
const UserRepo = require('../repositories/userRepo');

// Helper functions to check for specific error messages
const emailExists = (err) => err.message && err.message.includes('duplicate key error');
const noEmail = (err) => err.message && err.message.includes('Email field');
const noPassword = (err) => err.message && err.message.includes('Password field');
const noFirstName = (err) => err.message && err.message.includes('First Name field');

const signup = async (req, res) => {
    try {
        const payload = req.body;
        
        // Check if password is provided
        if (!payload.password) {
            throw new Error('Password field is required');
        }
        
        payload.createdDate = new Date(); // Add created date to payload
        
        // Hashing the password
        const saltRounds = 10; // Number of salt rounds for hashing
        payload.password = await bcrypt.hash(payload.password, saltRounds);

        await UserRepo.add(payload); // Add the user to the repository
        console.log(`User added:`, payload);

        res.status(201).send('Created'); // Send a success response
    } catch (err) {
        console.error(err.message);
        
        // Handle specific error cases
        if (emailExists(err)) {
            res.status(400).send('Email Already Exists');
        } else if (noEmail(err)) {
            res.status(400).send('Enter the Email');
        } else if (noPassword(err)) {
            res.status(400).send('Enter the Password');
        } else if (noFirstName(err)) {
            res.status(400).send('Enter the First Name');
        } else {
            res.status(500).send('Internal Server Error'); // Handle general errors
        }
    }
};

const signin = async (req, res) => {
    try {
        const payload = req.body;
        
        // Check if email and password are provided
        if (!payload.password || !payload.email) {
            res.status(400).send('Email and password are required');
            return;
        }
        
        // Check if the email exists in the database
        const dbUser = await UserRepo.getUserByEmail(payload.email);

        if (!dbUser) {
            // If the email does not exist in the database
            res.status(404).send('Invalid username or password');
            return;
        }
        
        // Compare the entered password with the hashed password in the database
        const isValid = await bcrypt.compare(payload.password, dbUser.password);
        if (isValid) {
            // If the password is valid, send user details
            res.status(200).json({
                firstName: dbUser.firstName,
                lastName: dbUser.lastName,
            });
        } else {
            // If the password is invalid
            res.status(401).send('Invalid username or password');
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Internal Server Error'); // Handle general errors
    }
}

module.exports = {
    signup,
    signin,
};