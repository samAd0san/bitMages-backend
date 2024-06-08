const User = require('../models/userModel');

// Adding the user in the database
const add = (data) => {
    const user = new User(data); // data is related to the model
    return user.save();
};

// Checking whether the user exists in the database or not
const getUserByEmail = (email) => {
    return User.findOne({ email: email },
        { __v: 0, createdDate: 0, updatedDate: 0, _id: 0 })
};

module.exports = {
    add,
    getUserByEmail
}