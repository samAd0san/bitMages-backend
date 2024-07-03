const express = require('express');
const mongoose = require('mongoose');

const homeRoutes = require('./routes/homeRoutes');
const userRoutes = require('./routes/userRoutes');
const tokenAuth = require('./middleware/auth');

const userResponseRoutes = require('./routes/userResponseRoutes');

//  imports the GoogleGenerativeAI class from the @google/generative-ai package. This package allows you to interact with Google's generative AI models.
const { GoogleGenerativeAI } = require("@google/generative-ai");

require("dotenv").config();

// console.log("API Key:", process.env.GEN_AI_API_KEY);

const cors = require("cors");
const app = express();
// app.use(cors());
app.use(
    cors({
        origin: ['http://localhost:3000','http://localhost:3001','http://localhost:3002','http://localhost:5173'],  // Replace with your frontend domain
        // credentials: true,
      })
)
const port = 3000;
app.listen(port, () => {
  console.log(`The server is running on http://localhost:${port}`);
});

app.use(express.json());

// Access your API key as an environment variable 
// const genAI = new GoogleGenerativeAI(process.env.GEN_AI_API_KEY);
// const GEN_AI_API_KEY = "AIzaSyBfsecoQihitldvOag07uU5d5rwMmdVEUo"; // Hard-coded API key
// const genAI = new GoogleGenerativeAI(GEN_AI_API_KEY);
// console.log("API Key:", GEN_AI_API_KEY);

// async function run(userResponse) {
//   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//   const prompt = `
//     **multiple choice questions for User Assessment  starts**
// Step 1 . Fitness Goals:
// i) What is your primary fitness goal?
//   A) Build muscle
//   B) Lose weight
//   C) Improve endurance
//   D) Increase flexibility
// Step 2:  Workout Preferences: 
// i). How many days per week can you commit to working out?
//   A) 1-2 days
//   B) 3-4 days
//   C) 5-6 days
//   D) Every day
// ii) What type of workouts do you prefer?
//   A) Strength training
//   B) Cardio
//   C) Flexibility and mobility
//   D) Mixed routines
// Step 3. Dietary Habits: 
// i) Do you have any dietary restrictions?
//   A) None
//   B) Vegetarian
//   C) Vegan
//   D) Gluten-free
//   E) Other (Specify)
// ii)How often do you eat out?
//   A) Rarely
//   B) 1-2 times per week
//   C) 3-4 times per week
//   D) Almost every day
// Step 4 :Body Type and Metabolism:
// i). How would you describe your body type?
//   A) Ectomorph (lean, difficulty gaining weight)
//   B) Mesomorph (athletic, gains muscle easily)
//   C) Endomorph (higher body fat, gains weight easily)
// ii) How would you describe your metabolism?
//   A) Fast
//   B) Average
//   C) Slow
// Step 5: Lifestyle and Activity Level: 
// i). What is your daily activity level?
//   A) Sedentary (little to no exercise)
//   B) Lightly active (light exercise/sports 1-3 days/week)
//   C) Moderately active (moderate exercise/sports 3-5 days/week)
//   D) Very active (hard exercise/sports 6-7 days/week)
// ii)How much time can you dedicate to meal preparation each day?
//   o A) Less than 30 minutes
//   o B) 30-60 minutes
//   o C) More than 60 minutes
//   **Assessment Ends**
  
//   **User Response STARTS **

//   Based on the following user responses:

//   Step 1 . Fitness Goals:
//     i) What is your primary fitness goal?
//   Fitness Goal: ${userResponse.fitnessGoal}

//   Step 2:  Workout Preferences: 
//   i). How many days per week can you commit to working out?
//   Workout Days: ${userResponse.workoutDays}
//   ii) What type of workouts do you prefer?
//   Workout Type: ${userResponse.workoutType}

//   Step 3. Dietary Habits: 
//   i) Do you have any dietary restrictions?
//   Dietary Restrictions: ${userResponse.dietaryRestrictions}
//   ii)How often do you eat out?
//   Eating Out Frequency: ${userResponse.eatingOutFrequency}

//   Step 4 :Body Type and Metabolism:
//   i). How would you describe your body type?
//   Body Type: ${userResponse.bodyType}
//   ii) How would you describe your metabolism?
//   Metabolism: ${userResponse.metabolism}

//   Step 5: Lifestyle and Activity Level: 
//   i). What is your daily activity level?
//   Activity Level: ${userResponse.activityLevel}
//   ii)How much time can you dedicate to meal preparation each day?
//   Meal Preparation Time: ${userResponse.mealPreparationTime}

//   Generate the best possible workout plan and diet plan.
//   *User Response ENDS **

//   Output format :
//   **Output Starts**
//   workoutPlan{
//   //days will be array of 7 representing monday ,tuesday ,wednesday etc.
//   days:[
//   {
//   day:'Monday'
//   workoutPlan : 
//   },...
//   ]
//   }
//   dietPlan{
//   //days will be array of 7 representing monday ,tuesday ,wednesday etc.
//   days:[
//   {
//   day:'Monday'
//   dietPlan : 
//   },...
//   }
//   *Output Ends*
//   `;

//   const result = await model.generateContent(prompt);
//   const response = await result.response;
//   const final = response.text().substring(7, response.text().length - 4);
//   return JSON.parse(final);
// }

// mongoose.connect('mongodb://localhost:27017/bitMages-db');

const dbConnect = process.env.dbConStr || 'mongodb+srv://admin:admin@samadscluster.a4s9jvf.mongodb.net/';
mongoose.connect(dbConnect);

app.use(userRoutes);
app.use(userResponseRoutes);

app.use(tokenAuth);

app.use(homeRoutes);
