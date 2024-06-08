const mongoose = require('mongoose');

// The user will enter the answer
const userResponseSchema = new mongoose.Schema({
// 1st 
  fitnessGoal: String,
// 2nd 
  workoutDays: String,
  workoutType: String,
// 3rd
  dietaryRestrictions: String,
  eatingOutFrequency: String,
// 4th
  bodyType: String,
  metabolism: String,
// 5th
  activityLevel: String,
  mealPreparationTime: String
});

module.exports = mongoose.model('UserResponse', userResponseSchema);
