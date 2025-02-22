import axios from "axios";

const BASE_URL = "https://places.googleapis.com/v1/places:searchText";

export const GetPlaceDetails = async (data) => {
  try {
    const response = await axios.post(BASE_URL, data, {
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": process.env.REACT_APP_GOOGLE_API_KEY, // Corrected key format
        "X-Goog-FieldMask": "places.photos,places.displayName,places.id",
      },
    });
    return response.data; // Return data so it can be used in the component
  } catch (error) {
    console.error("Error fetching place details:", error.response?.data || error.message);
    return null; // Handle errors gracefully
  }
};
