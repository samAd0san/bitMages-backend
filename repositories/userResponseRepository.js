const UserResponse = require('../models/userResponseModel');

// Saving the data in the db
async function saveUserResponse(userResponseData) {
  try {
    const userResponse = new UserResponse(userResponseData);
    await userResponse.save();
    return userResponse;
  } catch (error) {
    throw new Error('Error saving user response');
  }
}

module.exports = {
  saveUserResponse
};
