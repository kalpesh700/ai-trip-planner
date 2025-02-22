import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("API key is missing or invalid");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Define the function to generate a travel plan
export const generateTravelPlan = async (location, duration, travelers, budget) => {
  // Generate the prompt dynamically based on input
  const FINAL_PROMPT = `
  Generate a structured travel plan for:
  - Location: ${location}
  - Duration: ${duration} days
  - Travelers: ${travelers}
  - Budget: ${budget}
  
  ### **Response Format (JSON)**
  Return a **JSON object** with the following keys:
  
  1. **TravelPlan** (object)
     - **hotels** (array of objects) → List of recommended hotels, each with:
       - hotelName (string)
       - hotelAddress (string)
       - price (string)
       - hotelImageUrl (string)
       - geoCoordinates (object: { latitude, longitude })
       - rating (number)
       - description (string)
    
     - **itinerary** (object) → Each day's plan structured as:
       - **day1, day2, ..., day${duration}** (objects), each containing:
         - bestTimeToVisit (string)
         - places (array of objects), each with:
           - placeName (string)
           - placeDetails (string)
           - placeImageUrl (string)
           - geoCoordinates (object: { latitude, longitude })
           - ticketPricing (string)
           - rating (number)
           - timeTravel (string) (travel time from the previous location)
  
  Return **only valid JSON** without additional text or explanations.
  `;
  

  try {
    // Start a new chat session with the generative AI model
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [{ text: FINAL_PROMPT }],
        },
      ],
    });

    // Send the message and get the response
    const result = await chatSession.sendMessage(FINAL_PROMPT);
    const response = await result.response.text();

    return response;
  } catch (error) {
    console.error("Error generating travel plan:", error);
    throw new Error("Failed to generate travel plan. Please try again.");
  }
};
