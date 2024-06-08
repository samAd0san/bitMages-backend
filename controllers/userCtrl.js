const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserRepo = require('../repositories/userRepo');
const config = require('../config/index');

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

const signin = async(req,res) => {
    try{
        const payload = req.body;
        // checking if email entered by the user exists in the db or not
        const dbUser = await UserRepo.getUserByEmail(payload.email);

        // Check if email and password are provided
        if (!payload.password || !payload.email) {
            res.status(400).send('Email and password are required');
            return;
        }

        // If the email entered is incorrect/doesnot exist in the db
        if(!dbUser) {
            res.status(404).send('Invalid username or password');
            return;
        }
        
        // converting the password to hash then compare the entered password and existing password(inDb)
        const isValid = await bcrypt.compare(payload.password,dbUser.password);
        if(isValid) {
            res.status(200).json({
                username: dbUser.username,
                password: dbUser.password, // optional not required to mention
                token : jwt.sign({email : dbUser.email},config.jwtSecret,{expiresIn: '1d'})
            });
        }else{
            // If the password entered is inco  rrect
            res.status(401).send('Invalid username or password');
        }
    }catch(err){
        console.log(err);
        res.status(500).send('Internal Server Error');
    }
}

module.exports = {
    signup,
    signin,
};