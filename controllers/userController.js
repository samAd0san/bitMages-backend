const userResponseRepository = require("../repositories/userResponseRepository");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require("../config/index");

const genAI = new GoogleGenerativeAI(config.GEN_AI_API_KEY);

const generationConfig = {
  temperature: 0.5,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

async function submitUserResponse(req, res) {
  try {
    const userResponseData = req.body;
    // The user response is sent to the repo layer so that it can be saved in the database
    // const userResponse = await userResponseRepository.saveUserResponse(
    //   userResponseData
    // );

    // Generate a report based on the saved response
    const report = await run(userResponseData);
    res.json(report);
    // console.log(report);
  } catch (error) {
    console.error("Error submitting user response:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

async function run(userResponseData) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  //     const prompt = `
  //   generated some input questions for user assessment you have to provide answers like body type, workout plan, workout splits, everyday meals with calories.

  //   **multiple choice questions for User Assessment  starts**

  //   Step 1 . Fitness Goals:
  //   i) What is your primary fitness goal?
  //   A) Build muscle
  //   B) Lose weight
  //   C) Improve endurance
  //   D) Increase flexibility

  //   Step 2:  Workout Preferences:
  //   i). How many days per week can you commit to working out?
  //   A) 1-2 days
  //   B) 3-4 days
  //   C) 5-6 days
  //   D) Every day
  //   ii) What type of workouts do you prefer?
  //   A) Strength training
  //   B) Cardio
  //   C) Flexibility and mobility
  //   D) Mixed routines

  //   Step 3. Dietary Habits:
  //   i) Do you have any dietary restrictions?
  //   A) None
  //   B) Vegetarian
  //   C) Vegan
  //   D) Gluten-free
  //   E) Other (Specify)
  //   ii)How often do you eat out?
  //   A) Rarely
  //   B) 1-2 times per week
  //   C) 3-4 times per week
  //   D) Almost every day

  //   Step 4 :Body Type and Metabolism:
  //   i). How would you describe your body type?
  //   A) Ectomorph (lean, difficulty gaining weight)
  //   B) Mesomorph (athletic, gains muscle easily)
  //   C) Endomorph (higher body fat, gains weight easily)
  //   ii) How would you describe your metabolism?
  //   A) Fast
  //   B) Average
  //   C) Slow

  //   Step 5: Lifestyle and Activity Level:
  //   i). What is your daily activity level?
  //   A) Sedentary (little to no exercise)
  //   B) Lightly active (light exercise/sports 1-3 days/week)
  //   C) Moderately active (moderate exercise/sports 3-5 days/week)
  //   D) Very active (hard exercise/sports 6-7 days/week)
  //   ii)How much time can you dedicate to meal preparation each day?
  //   o A) Less than 30 minutes
  //   o B) 30-60 minutes
  //   o C) More than 60 minutes

  //   **Assessment Ends**

  //     **User Response STARTS **

  //     Based on the following user responses:

  //     Step 1 . Fitness Goals:
  //       i) What is your primary fitness goal?
  //     Fitness Goal: ${userResponse.fitnessGoal}

  //     Step 2:  Workout Preferences:
  //     i). How many days per week can you commit to working out?
  //     Workout Days: ${userResponse.workoutDays}
  //     ii) What type of workouts do you prefer?
  //     Workout Type: ${userResponse.workoutType}

  //     Step 3. Dietary Habits:
  //     i) Do you have any dietary restrictions?
  //     Dietary Restrictions: ${userResponse.dietaryRestrictions}
  //     ii)How often do you eat out?
  //     Eating Out Frequency: ${userResponse.eatingOutFrequency}

  //     Step 4 :Body Type and Metabolism:
  //     i). How would you describe your body type?
  //     Body Type: ${userResponse.bodyType}
  //     ii) How would you describe your metabolism?
  //     Metabolism: ${userResponse.metabolism}

  //     Step 5: Lifestyle and Activity Level:
  //     i). What is your daily activity level?
  //     Activity Level: ${userResponse.activityLevel}
  //     ii)How much time can you dedicate to meal preparation each day?
  //     Meal Preparation Time: ${userResponse.mealPreparationTime}

  //     Generate the best possible workout plan and diet plan.
  //     *User Response ENDS **

  //     Output format :
  //   *Output Starts*

  //   workoutPlan{
  //   //days will be array of 7 representing monday ,tuesday ,wednesday etc.
  //   days:[
  //   {
  //   day:'Monday'
  //   workoutPlan : [
  //   {
  //   workoutType:' Warmup',

  //   workoutSteps: [
  //   {
  //   workoutVariation: 'bench press',
  //   workoutSets: ''
  //   }
  //   ]

  //   }

  //   ]
  //   }

  //   },...

  //   ]
  //   }
  //   dietPlan{
  //   //days will be array of 7 representing monday ,tuesday ,wednesday etc.
  //   days:[
  //   {
  //   day:'Monday'
  //   dietPlan : [
  //   {
  //   meal: 'Breakfast',
  //   foodItems: 'Tuna salad',
  //   calories: 300
  //   }
  //   ]

  //   },...

  //   }
  //   Output Ends

  //   **INSTRUCTIONS**
  // 1. The large language model (LLM) will generate the best possible workout plan and dietPlan according to user response
  // 2. Generate Output in only json format as mentioned in Output Format
  // 3. For consistent results,use the same model,temperature and other generation settings .
  // 4. do not provide any other information like Explanation or Key considerations except json
  // 5. Exclude all '*' symbols and unnessary spaces, make it clean and easy to read

  //     `;
  const parts = [
    {
      text: 'instructions: you are a professional gym trainer and nutritionist which tailors workout plans (sets and variations) and diet plans(calorie intake) according to the user answers from  the questionnaire\n\nquestionnaire: \n""a. Fitness Goals:*\n1. What is your primary fitness goal?(select one or two options)\n   * A) Build muscle\n   * B) Lose weight\n   * C) Improve endurance\n   * D) General fitness\n     b.  **Body Type and Metabolism:* 1. How would you describe your body type?\n* A) Ectomorph (lean, difficulty gaining weight)\n·        B) Mesomorph (athletic, gains muscle easily)\n* C) Endomorph (higher body fat, gains weight easily)\n2.        How would you describe your metabolism?\nA) Fast\nB) Average\nC) Slow\n 3. What is your daily activity level?\n* A) Sedentary (little to no exercise)\n* B) Lightly active (light exercise/sports 1-3 days/week)\n* C) Moderately active (moderate exercise/sports 3-5 days/week)\n* D) Very active (hard exercise/sports 6-7 days/week)\n*b. Workout Preferences:\n1.Gym Access?\n·       Yes\n·       No\n 2. How many days per week can you commit to working out?\n A) 1-2 days\n* B) 3-4 days\n* C) 5-6 days\n* D) Every day\n3.  Duration of workout?\n·       30min\n·       60min\n·       90min\n·       More\n4.        What type of workouts do you prefer?(select one or two options)\nA) Strength training\nB) Cardio\nC) Flexibility and mobility\nD) Mixed routines\n5. Type of Difficulty level?\n·       None\n·       Beginners\n·       Intermediate\n·       Experts\n \n*c. Dietary Habits:\n1. Do you have any dietary restrictions?(select one or two options)\n A) None\n* B) Vegetarian\n* C) Vegan\n* D) Gluten-free\n* E) Low carb, High protien\n2.        What type of cuisine do you prefer?(select one or two options)\n·       Asian\n·       European\n·       American\n·       Mediterranean\n·       Middle eastern\n3.        Any Allergies?\n·        if any specify\n4.        Special notes( eg : I have pcos, I like spicy food)**optional""\n\n\n\noutput: mention workout (sets and variation) and diet plan(calorie intake) as shown in the examples, do not add extra information and output must be in the json format.',
    },
    {
      text: "User 1: build muscle, mesomorph, average, moderately active, yes, 5-6 days, 60min,\nstrength training, intermediate, none, European and American, no allergies,\nprefers high protein meals",
    },
    {
      text: "output: Estimated daily\ncalorie intake: 2800-3000 calories (based on muscle building goal and activity\nlevel)\n\nworkout\n\n{\n\nmonday{\n\nChest and Triceps:\n\n- Bench Press: 4\nsets, 8-10 reps\n\n- Incline Dumbbell\nPress: 3 sets, 10-12 reps\n\n- Chest Flyes: 3\nsets, 12-15 reps\n\n- Tricep Pushdowns:\n3 sets, 10-12 reps\n\n- Overhead Tricep\nExtensions: 3 sets, 10-12 reps\n\n- 10 minutes light\ncardio cooldown\n\n}\n\ntuesday{\n\nBack and Biceps:\n\n- Deadlifts: 4\nsets, 6-8 reps\n\n- Pull-ups or Lat\nPulldowns: 4 sets, 8-10 reps\n\n- Bent-over Rows: 3\nsets, 10-12 reps\n\n- Barbell Curls: 3\nsets, 10-12 reps\n\n- Hammer Curls: 3\nsets, 10-12 reps\n\n- 10 minutes light\ncardio cooldown\n\n}\n\nwednesday{\n\nLegs and Shoulders:\n\n- Squats: 4 sets,\n8-10 reps\n\n- Leg Press: 3\nsets, 10-12 reps\n\n- Leg Curls: 3\nsets, 12-15 reps\n\n- Military Press: 4\nsets, 8-10 reps\n\n- Lateral Raises: 3\nsets, 12-15 reps\n\n- 10 minutes light\ncardio cooldown\n\n}\n\nthursday{\n\nRest day or light\ncardio (30 minutes)\n\n}\n\nfriday{\n\nChest and Triceps:\n\n- Incline Bench\nPress: 4 sets, 8-10 reps\n\n- Dumbbell Flyes: 3\nsets, 10-12 reps\n\n- Cable Crossovers:\n3 sets, 12-15 reps\n\n- Close-grip Bench\nPress: 3 sets, 10-12 reps\n\n- Dips: 3 sets,\n10-12 reps\n\n- 10 minutes light\ncardio cooldown\n\n}\n\nsaturday{\n\nBack and Biceps:\n\n- Barbell Rows: 4\nsets, 8-10 reps\n\n- T-Bar Rows: 3\nsets, 10-12 reps\n\n- Seated Cable\nRows: 3 sets, 12-15 reps\n\n- Preacher Curls: 3\nsets, 10-12 reps\n\n- Incline Dumbbell\nCurls: 3 sets, 10-12 reps\n\n- 10 minutes light cardio\ncooldown\n\n}\n\nsunday{\n\nRest day\n\n}\n\n}\n\ndiet\n\n{\n\nmonday{\n\nBreakfast: Oatmeal\nwith whey protein, banana, and almonds (600 cal)\n\nSnack: Greek yogurt\nwith berries and granola (300 cal)\n\nLunch: Grilled\nchicken breast, brown rice, and mixed vegetables (700 cal)\n\nPre-workout: Whole\ngrain toast with peanut butter and a small apple (300 cal)\n\nPost-workout:\nProtein shake with milk and a banana (400 cal)\n\nDinner: Lean beef\nsteak, sweet potato, and steamed broccoli (600 cal)\n\n}\n\ntuesday{\n\nBreakfast:\nScrambled eggs with whole grain toast and avocado (600 cal)\n\nSnack: Cottage\ncheese with pineapple (300 cal)\n\nLunch: Tuna salad\nsandwich on whole grain bread with a side salad (700 cal)\n\nPre-workout: Trail\nmix with nuts and dried fruits (300 cal)\n\nPost-workout:\nProtein shake with milk and oats (400 cal)\n\nDinner: Grilled\nsalmon, quinoa, and roasted asparagus (600 cal)\n\n}\n\nwednesday{\n\nBreakfast: Protein\npancakes with maple syrup and mixed berries (600 cal)\n\nSnack: Hard-boiled\neggs and carrot sticks (300 cal)\n\nLunch: Turkey and\ncheese wrap with hummus and vegetables (700 cal)\n\nPre-workout: Banana\nwith almond butter (300 cal)\n\nPost-workout:\nProtein shake with milk and a handful of nuts (400 cal)\n\nDinner: Chicken\nstir-fry with mixed vegetables and brown rice (600 cal)\n\n}\n\nthursday{\n\nBreakfast: Greek\nyogurt parfait with granola and mixed fruits (600 cal)\n\nSnack: Protein bar\nand an apple (300 cal)\n\nLunch: Grilled\nchicken Caesar salad with whole grain croutons (700 cal)\n\nSnack: Cottage\ncheese with peaches (300 cal)\n\nDinner: Lean pork\nchop, mashed potatoes, and green beans (700 cal)\n\nEvening snack:\nCasein protein shake (300 cal)\n\n}\n\nfriday{\n\nBreakfast: Whole\ngrain toast with smashed avocado and poached eggs (600 cal)\n\nSnack: Smoothie\nwith whey protein, spinach, and mixed berries (300 cal)\n\nLunch: Lean beef\nburger on whole grain bun with side salad (700 cal)\n\nPre-workout: Rice\ncakes with peanut butter (300 cal)\n\nPost-workout:\nProtein shake with milk and a banana (400 cal)\n\nDinner: Grilled\ntilapia, couscous, and roasted vegetables (600 cal)\n\n}\n\nsaturday{\n\nBreakfast: Egg\nwhite omelet with vegetables and whole grain toast (600 cal)\n\nSnack: Low-fat\nstring cheese and an orange (300 cal)\n\nLunch: Grilled\nchicken breast sandwich with avocado and sweet potato fries (700 cal)\n\nPre-workout: Greek\nyogurt with honey and almonds (300 cal)\n\nPost-workout:\nProtein shake with milk and a handful of mixed nuts (400 cal)\n\nDinner: Lean\nsirloin steak, baked potato, and steamed broccoli (600 cal)\n\n}\n\nsunday{\n\nBreakfast: Whole\ngrain waffles with peanut butter and sliced banana (600 cal)\n\nSnack: Hummus with\nvegetable sticks (300 cal)\n\nLunch: Grilled\nshrimp skewers with quinoa salad (700 cal)\n\nSnack: Protein\nsmoothie with mixed berries (400 cal)\n\nDinner: Baked\nchicken breast, sweet potato, and grilled zucchini (600 cal)\n\nEvening snack:\nCottage cheese with cinnamon and almonds (300 cal)\n\n}\n\n}",
    },
    {
      text: "User : improve endurance, ectomorph, fast, very active, yes, every day, 90min, mixed routines, experts, vegan, Asian, no allergies, I'm training for a marathon.",
    },
    {
      text: "output: Estimated daily\ncalorie intake: 3000-3200 calories (high calorie needs due to high activity\nlevel and fast metabolism)\n\nworkout\n\n{\n\nmonday{\n\nEndurance Run:\n\n- 10 min warm-up\n\n- 70 min\nsteady-state run at moderate pace\n\n- 10 min cool-down\n\n}\n\ntuesday{\n\nStrength and Core:\n\n- 10 min warm-up\n\n- Circuit (3\nrounds):\n\n* 12 pull-ups\n\n* 20 push-ups\n\n* 30 bodyweight\nsquats\n\n* 40 mountain\nclimbers\n\n- 30 min core\nworkout\n\n- 10 min cool-down\n\n}\n\nwednesday{\n\nInterval Training:\n\n- 10 min warm-up\n\n- 8x800m repeats\nwith 90 sec rest\n\n- 20 min easy jog\n\n- 10 min cool-down\n\n}\n\nthursday{\n\nCross-training:\n\n- 45 min cycling\n\n- 35 min swimming\n\n- 10 min cool-down\nstretching\n\n}\n\nfriday{\n\nHill Training:\n\n- 10 min warm-up\n\n- 10x1 min hill\nsprints with jog back down recovery\n\n- 30 min\nsteady-state run\n\n- 10 min cool-down\n\n}\n\nsaturday{\n\nLong Run:\n\n- 10 min warm-up\n\n- 70-80 min long\ndistance run at conversational pace\n\n- 10 min cool-down\n\n}\n\nsunday{\n\nActive Recovery:\n\n- 60 min yoga or\nlight stretching\n\n- 30 min easy walk\n\n}\n\n}\n\ndiet\n\n{\n\nmonday{\n\nBreakfast: Tofu\nscramble with vegetables and whole grain toast (600 cal)\n\nSnack: Banana with\nalmond butter (300 cal)\n\nLunch: Quinoa and\nblack bean bowl with avocado (700 cal)\n\nPre-workout: Energy\nbar and apple (300 cal)\n\nPost-workout: Vegan\nprotein shake with soy milk (400 cal)\n\nDinner: Stir-fried\ntempeh with brown rice and vegetables (600 cal)\n\nEvening snack:\nMixed nuts and dried fruits (300 cal)\n\n}\n\ntuesday{\n\nBreakfast: Oatmeal\nwith chia seeds, berries, and maple syrup (600 cal)\n\nSnack: Hummus with\ncarrot and celery sticks (300 cal)\n\nLunch: Lentil and\nvegetable curry with brown rice (700 cal)\n\nPre-workout: Whole\ngrain crackers with avocado (300 cal)\n\nPost-workout: Vegan\nprotein shake with banana (400 cal)\n\nDinner: Grilled\ntofu steaks with sweet potato and broccoli (600 cal)\n\nEvening snack:\nVegan yogurt with granola (300 cal)\n\n}\n\nwednesday{\n\nBreakfast: Whole\ngrain bagel with peanut butter and sliced banana (600 cal)\n\nSnack: Edamame and\ncherry tomatoes (300 cal)\n\nLunch: Vegan sushi\nrolls with miso soup (700 cal)\n\nPre-workout: Rice\ncakes with hummus (300 cal)\n\nPost-workout: Vegan\nprotein shake with mixed berries (400 cal)\n\nDinner: Chickpea\nand vegetable stir-fry with rice noodles (600 cal)\n\nEvening snack:\nRoasted chickpeas (300 cal)\n\n}\n\nthursday{\n\nBreakfast: Vegan\nprotein pancakes with fruit compote (600 cal)\n\nSnack: Trail mix\nwith nuts and seeds (300 cal)\n\nLunch: Vegan\nburrito bowl with rice, beans, and guacamole (700 cal)\n\nPre-workout: Banana\nand date smoothie (300 cal)\n\nPost-workout: Vegan\nprotein shake with spinach (400 cal)\n\nDinner: Lentil and\nvegetable soup with whole grain bread (600 cal)\n\nEvening snack:\nApple slices with peanut butter (300 cal)\n\n}\n\nfriday{\n\nBreakfast: Vegan\nbreakfast burrito with tofu and vegetables (600 cal)\n\nSnack: Coconut\nyogurt with berries (300 cal)\n\nLunch: Tempeh and\navocado sandwich with side salad (700 cal)\n\nPre-workout: Energy\nballs (dates, nuts, cocoa) (300 cal)\n\nPost-workout: Vegan\nprotein shake with almond milk (400 cal)\n\nDinner: Vegan pad\nthai with tofu (600 cal)\n\nEvening snack:\nSeaweed snacks and almonds (300 cal)\n\n}\n\nsaturday{\n\nBreakfast: Smoothie\nbowl with vegan protein, fruits, and granola (600 cal)\n\nSnack: Rice cakes\nwith almond butter (300 cal)\n\nLunch: Vegan pho\nwith extra vegetables and tofu (700 cal)\n\nPre-workout: Banana\nand handful of walnuts (300 cal)\n\nPost-workout: Vegan\nprotein shake with pea protein (400 cal)\n\nDinner: Grilled\nvegetable and tofu skewers with quinoa (600 cal)\n\nEvening snack:\nVegan protein bar (300 cal)\n\n}\n\nsunday{\n\nBreakfast: Vegan\nFrench toast with maple syrup and fruit (600 cal)\n\nSnack: Vegetable\nsushi rolls (300 cal)\n\nLunch: Vegan buddha\nbowl with tahini dressing (700 cal)\n\nSnack: Green\nsmoothie with vegan protein powder (400 cal)\n\nDinner: Vegan\nlentil loaf with mashed potatoes and green beans (600 cal)\n\nEvening snack: Dark\nchocolate and mixed berries (300 cal)\n\n}\n\n}",
    },
    {
      text: "User : lose weight, endomorph, slow, sedentary, no, 3-4 days, 30min, cardio, beginners, vegetarian, Mediterranean, allergic to nuts, I have hypothyroidism.",
    },
    {
      text: 'output: Estimated daily\ncalorie intake: 1600-1800 calories (calorie deficit for weight loss, accounting\nfor slow metabolism)\n\nworkout\n\n{\n\nmonday{\n\nCardio:\n\n- 5 min warm-up\nwalk\n\n- 20 min interval\nwalking/jogging (1 min jog, 2 min walk)\n\n- 5 min cool-down\nwalk\n\n}\n\nwednesday{\n\nBodyweight Circuit:\n\n- 5 min warm-up\n\n- 3 rounds of:\n\n* 10 squats\n\n* 10 push-ups (on\nknees if needed)\n\n* 10 lunges (each\nleg)\n\n* 30 sec plank\n\n- 5 min cool-down\nstretch\n\n}\n\nfriday{\n\nCardio:\n\n- 5 min warm-up\n\n- 20 min low-impact\naerobics or dance workout\n\n- 5 min cool-down\nstretch\n\n}\n\nsaturday{\n\nYoga or Pilates:\n\n- 30 min\nbeginner-friendly session focusing on flexibility and core strength\n\n}\n\n}\n\ndiet\n\n{\n\nmonday{\n\nBreakfast: Greek\nyogurt with berries and chia seeds (300 cal)\n\nSnack: Carrot\nsticks with hummus (100 cal)\n\nLunch: Lentil soup\nwith whole grain bread (400 cal)\n\nSnack: Apple slices\nwith almond butter (150 cal)\n\nDinner: Grilled\nvegetable and tofu skewers with quinoa (450 cal)\n\n}\n\ntuesday{\n\nBreakfast: Whole\ngrain toast with avocado and cherry tomatoes (300 cal)\n\nSnack: Celery with\ncottage cheese (100 cal)\n\nLunch: Greek salad\nwith feta cheese and olive oil dressing (400 cal)\n\nSnack: Handful of\nsunflower seeds (150 cal)\n\nDinner: Vegetarian\nstuffed bell peppers with side salad (450 cal)\n\n}\n\nwednesday{\n\nBreakfast:\nVegetable omelette with whole grain toast (300 cal)\n\nSnack: Cucumber\nslices with tzatziki (100 cal)\n\nLunch: Chickpea and\nvegetable curry with brown rice (400 cal)\n\nSnack: Roasted\nchickpeas (150 cal)\n\nDinner: Grilled\nportobello mushroom "steak" with roasted vegetables (450 cal)\n\n}\n\nthursday{\n\nBreakfast:\nOvernight oats with almond milk and mixed berries (300 cal)\n\nSnack: Cherry\ntomatoes with low-fat mozzarella (100 cal)\n\nLunch: Vegetarian\nMediterranean wrap with side salad (400 cal)\n\nSnack: Edamame (150\ncal)\n\nDinner: Baked\nfalafel with tahini sauce and mixed greens (450 cal)\n\n}\n\nfriday{\n\nBreakfast: Smoothie\nbowl with spinach, banana, and hemp seeds (300 cal)\n\nSnack: Rice cake\nwith peanut butter (100 cal)\n\nLunch: Caprese\nsandwich on whole grain bread (400 cal)\n\nSnack: Sliced bell\npeppers with guacamole (150 cal)\n\nDinner: Vegetable\nand bean soup with whole grain roll (450 cal)\n\n}\n\nsaturday{\n\nBreakfast: Whole\ngrain pancakes with fresh fruit (300 cal)\n\nSnack: Greek yogurt\nwith honey (100 cal)\n\nLunch: Quinoa and\nroasted vegetable bowl (400 cal)\n\nSnack: Pear slices\nwith ricotta cheese (150 cal)\n\nDinner: Eggplant\nparmesan with side salad (450 cal)\n\n}\n\nsunday{\n\nBreakfast:\nVegetable frittata with whole grain toast (300 cal)\n\nSnack: Handful of\npistachios (100 cal)\n\nLunch: Lentil and\nvegetable salad with olive oil dressing (400 cal)\n\nSnack: Baked\nzucchini chips (150 cal)\n\nDinner: Vegetarian\nmoussaka with Greek salad (450 cal)\n\n}\n\n}',
    },
    {
      text: "User  : general fitness, mesomorph, average, lightly active, yes, 3-4 days, 60min, flexibility and mobility, beginners, gluten-free, American, lactose intolerant, I have lower back pain.",
    },
    {
      text: "output: Estimated daily calorie intake: 2000-2200 calories (maintenance calories with slight deficit for general fitness)\nworkout\n{\nmonday{\nFull Body and Flexibility:\n- 10 min warm-up (light cardio and dynamic stretching)\n- 30 min circuit (2 rounds):\n* 10 bodyweight squats\n* 10 modified push-ups\n* 10 glute bridges\n* 30 sec plank\n* 10 bird-dogs (each side)\n- 20 min yoga flow focusing on back-friendly poses\n}\nwednesday{\nCardio and Core:\n- 10 min warm-up\n- 30 min low-impact cardio (stationary bike or elliptical)\n- 20 min core workout:\n* Cat-cow stretches (10 reps)\n* Dead bug exercise (10 reps each side)\n* Side planks (20 sec each side)\n* Supermans (10 reps)\n- 10 min cool-down stretches\n}\nfriday{\nStrength and Mobility:\n- 10 min warm-up\n- 30 min strength training:\n* Wall sits (3 sets, 30 sec hold)\n* Resistance band rows (3 sets, 12 reps)\n* Step-ups (3 sets, 10 reps each leg)\n* Dumbbell shoulder press (3 sets, 10 reps)\n- 20 min mobility work focusing on hip and shoulder mobility\n}\n}\ndiet\n{\nmonday{\nBreakfast: Gluten-free oatmeal with almond milk, banana, and chia seeds (400 cal)\nSnack: Hard-boiled eggs and carrot sticks (200 cal)\nLunch: Grilled chicken salad with mixed greens and olive oil dressing (500 cal)\nSnack: Apple slices with almond butter (200 cal)\nDinner: Baked salmon with quinoa and roasted vegetables (600 cal)\n}\ntuesday{\nBreakfast: Smoothie with spinach, berries, lactose-free protein powder, and almond milk (400 cal)\nSnack: Rice cakes with avocado (200 cal)\nLunch: Turkey and vegetable soup with gluten-free crackers (500 cal)\nSnack: Greek yogurt (lactose-free) with berries (200 cal)\nDinner: Grilled steak with sweet potato and steamed broccoli (600 cal)\n}\nwednesday{\nBreakfast: Scrambled eggs with spinach and gluten-free toast (400 cal)\nSnack: Handful of mixed nuts (200 cal)\nLunch: Tuna salad (made with avocado instead of mayo) on gluten-free bread (500 cal)\nSnack: Celery sticks with hummus (200 cal)\nDinner: Grilled chicken breast with zucchini noodles and tomato sauce (600 cal)\n}\nthursday{\nBreakfast: Gluten-free pancakes with maple syrup and strawberries (400 cal)\nSnack: Lactose-free cheese stick and cucumber slices (200 cal)\nLunch: Quinoa bowl with black beans, corn, and avocado (500 cal)\nSnack: Roasted chickpeas (200 cal)\nDinner: Baked cod with brown rice and asparagus (600 cal)\n}\nfriday{\nBreakfast: Overnight oats made with almond milk, chia seeds, and sliced almonds (400 cal)\nSnack: Turkey roll-ups with lettuce and tomato (200 cal)\nLunch: Grilled vegetable and chicken skewers with quinoa (500 cal)\nSnack: Lactose-free yogurt with gluten-free granola (200 cal)\nDinner: Lean beef stir-fry with mixed vegetables and rice noodles (600 cal)\n}\nsaturday{\nBreakfast: Veggie omelette with gluten-free toast (400 cal)\nSnack: Banana with almond butter (200 cal)\nLunch: Grilled shrimp salad with mixed greens and lemon vinaigrette (500 cal)\nSnack: Gluten-free protein bar (200 cal)\nDinner: Roast turkey breast with mashed potatoes (using lactose-free milk) and green beans (600 cal)\n}\nsunday{\nBreakfast: Gluten-free waffles with fresh berries and maple syrup (400 cal)\nSnack: Carrot and cucumber sticks with guacamole (200 cal)\nLunch: Grilled chicken Caesar salad (without croutons) (500 cal)\nSnack: Rice cake with peanut butter (200 cal)\nDinner: Baked tofu with quinoa and roasted Brussels sprouts (600 cal)\n}\n}",
    },
    {
      text: `User : ${userResponseData.prompt}`,
    },
  ];
  // const result = await model.generateContent(prompt);
  // const response = await result.response;
  // const final = response.text().substring(7, response.text().length - 4);
  // return JSON.parse(final);
  const result = await model.generateContent({
    contents: [{ role: "user", parts }],
    generationConfig,
    // safetySettings: Adjust safety settings
    // See https://ai.google.dev/gemini-api/docs/safety-settings
  });
  console.log(result.response.text());
  return JSON.parse(result.response.candidates[0].content.parts[0].text);
}

module.exports = {
  submitUserResponse,
};
