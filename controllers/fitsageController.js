
const userResponseRepository = require('../repositories/userResponseRepository');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const config = require('../config/index');

const genAI = new GoogleGenerativeAI(config.GEN_AI_API_KEY);

async function FitSageInteractWithAi(req, res) {
  try {
    const userResponseData = req.body;
    // The user response is sent to the repo layer so that it can be saved in the database
    // const userResponse = await userResponseRepository.saveUserResponse(userResponseData);
    console.log('userResponse ',userResponseData)
    // Generate a report based on the saved response
    const report = await run(userResponseData);
    res.json(report);
    // console.log(report);
  } catch (error) {
    console.error('Error submitting user response:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

async function run(userResponse) {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro", 
        systemInstruction: "You are virtual Professional gym trainer and nutritionist , people from all around the world going to ask you queries , locate their region depending on their region give results of meal diet.\nuse tone positive and upbeat in your answers. provide the result of the query in JSON format",

     });
     console.log(userResponse?.message);
  
    const prompt = `
        ${userResponse?.message}
    `;
    const generationConfig = {
        temperature: 1,
        topP: 0.95,
        topK: 64,
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
      };
    // const result = await model.generateContent(prompt);
    const chatSession = model.startChat({
        generationConfig,
     // safetySettings: Adjust safety settings
     // See https://ai.google.dev/gemini-api/docs/safety-settings
        history: [
          
    //   {
    //     role: "user",
    //     parts: [
    //       {text: "Hi this is ashfaq"},
    //     ],
    //   },
    //   {
    //     role: "model",
    //     parts: [
    //       {text: "Hey Ashfaq, great to have you here!  Tell me, where in the world are you coming to me from?  Knowing your location helps me create a meal plan that utilizes foods you have access to and that fits your lifestyle.  \n\nLet's get you on track to a healthier, happier you! 💪😊 \n"},
    //     ],
    //   },
    //   {
    //     role: "user",
    //     parts: [
    //       {text: "I am from hyderbad, india"},
    //     ],
    //   },
    //   {
    //     role: "model",
    //     parts: [
    //       {text: "Alright Ashfaq, from Hyderabad!  Love it - such a vibrant city with amazing food. 😉  Now, I'm ready to help you reach your fitness goals, but to personalize a plan just for you, I need a little more information! \n\nTell me: \n\n* **What are your goals?**  Are you looking to lose weight, build muscle, or just eat healthier? \n* **What's your typical activity level like?** Do you exercise regularly, or are you just starting out?\n* **Any dietary restrictions or preferences?** Vegetarian, vegan, allergies, or just foods you really dislike? \n\nThe more details you give me, the better I can tailor a plan specifically for *you*. Let's do this!  💪🇮🇳 \n"},
    //     ],
    //   }
    ]
    })
      const res = await chatSession.sendMessage(prompt);
      console.log(res.response.text());
    // const response = await result.response;
    // const final = response.text().substring(7, response.text().length - 4);
    return res;
  }

module.exports = {
  FitSageInteractWithAi
};
