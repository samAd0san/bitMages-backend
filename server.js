const express = require('express');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();
const cors = require("cors");
const app = express();
app.use(
    cors({
        origin: ['http://localhost:3000','http://localhost:3002'],  // Replace with your frontend domain
        // credentials: true,
      })
)
const port = 3005;
app.listen(port,()=>{
    console.log(`The server is running on http://localhost:${port}`);
});

function home(req,res) {
    res.send('Welcome to Express Page');
}

app.get('/',home);

app.post('/getFullReport',async(req,res)=>{
    
    // var {weight,height}=req.body
    // console.log(req.body);
    var report =await run();
    // console.log(report)

    res.send(report);

})


// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEN_AI_API_KEY);

async function run() {

  // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

  const prompt = `
   
generated some input questions for user assessment you have to provide answers like body type, workout plan, workout splits, everyday meals with calories.

**multiple choice questions for User Assessment  starts**

Step 1 . Fitness Goals:
i) What is your primary fitness goal?
 A) Build muscle
B) Lose weight
C) Improve endurance
D) Increase flexibility

Step 2:  Workout Preferences: 
i). How many days per week can you commit to working out?
 A) 1-2 days
 B) 3-4 days
 C) 5-6 days
 D) Every day
ii) What type of workouts do you prefer?
A) Strength training
B) Cardio
C) Flexibility and mobility
D) Mixed routines

Step 3. Dietary Habits: 
i) Do you have any dietary restrictions?
 A) None
 B) Vegetarian
 C) Vegan
 D) Gluten-free
 E) Other (Specify)
ii)How often do you eat out?
 A) Rarely
B) 1-2 times per week
C) 3-4 times per week
D) Almost every day

Step 4 :Body Type and Metabolism:
i). How would you describe your body type?
A) Ectomorph (lean, difficulty gaining weight)
B) Mesomorph (athletic, gains muscle easily)
C) Endomorph (higher body fat, gains weight easily)
ii) How would you describe your metabolism?
A) Fast
B) Average
C) Slow

Step 5: Lifestyle and Activity Level: 
i). What is your daily activity level?
A) Sedentary (little to no exercise)
B) Lightly active (light exercise/sports 1-3 days/week)
C) Moderately active (moderate exercise/sports 3-5 days/week)
D) Very active (hard exercise/sports 6-7 days/week)
ii)How much time can you dedicate to meal preparation each day?
o A) Less than 30 minutes
o B) 30-60 minutes
o C) More than 60 minutes

**Assessment Ends**



**User Response STARTS **

Step 1 . Fitness Goals:
i) What is your primary fitness goal?
 A) Build muscle
B) Lose weight

Step 2:  Workout Preferences: 
i). How many days per week can you commit to working out?
 B) 3-4 days
ii) What type of workouts do you prefer?
A) Strength training

Step 3. Dietary Habits: 
i) Do you have any dietary restrictions?
 C) Vegan

ii)How often do you eat out?
 C) 3-4 times per week


Step 4 :Body Type and Metabolism:
i). How would you describe your body type?
A) Ectomorph (lean, difficulty gaining weight)

ii) How would you describe your metabolism?
C) Slow

Step 5: Lifestyle and Activity Level: 
i). What is your daily activity level?
C) Moderately active (moderate exercise/sports 3-5 days/week)
ii)How much time can you dedicate to meal preparation each day?
C) More than 60 minutes

**User Response ENDS **


Output format :
**Output Starts**

workoutPlan{
//days will be array of 7 representing monday ,tuesday ,wednesday etc.
 days:[
{
day:'Monday'
workoutPlan : 

},...
]
}
dietPlan{
//days will be array of 7 representing monday ,tuesday ,wednesday etc.
 days:[
{
day:'Monday'
dietPlan : 

},...

}
 *Output Ends*

**INSTRUCTIONS**
1. The large language model (LLM) will generate the best possible workout plan and dietPlan according to user response
2. Generate Output in only json format as mentioned in Output Format
3. For consistent results,use the same model,temperature and other generation settings .
4. do not provide any other information like Explanation or Key considerations except json 

  
  `

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const final = response.text().substring(7,response.text().length-4);
  return JSON.parse(final);
}

const mongoose = require('mongoose');

const homeRoutes = require('./routes/homeRoutes');
const userRoutes = require('./routes/userRoutes');
const tokenAuth = require('./middleware/auth');


app.use(express.json());
// The name of the db is 'bitMages-db'

// mongoose.connect('mongodb://localhost:27017/bitMages-db');
const dbConnect = process.env.dbConStr || 'mongodb+srv://admin:admin@samadscluster.a4s9jvf.mongodb.net/bitMages-db';
mongoose.connect(dbConnect);

app.use(userRoutes);
app.use(homeRoutes);

app.use(tokenAuth);