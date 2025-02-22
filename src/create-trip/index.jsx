import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { SelectBudgetList, SelectTravelList, AI_PROMPT } from "@/constant/options";
import { generateTravelPlan } from "@/service/ai_model";
import { doc, setDoc } from "firebase/firestore"; 
import { db } from "@/service/firebaseConfig";
import { useNavigate } from "react-router-dom";

function CreateTrip() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    destination: "",
    days: "",
    budget: "",
    companions: "",
  });
  const [suggestions, setSuggestions] = useState([]);
  const [selectedBudget, setSelectedBudget] = useState("");
  const [selectedTravelCompanions, setSelectedTravelCompanions] = useState("");
  const [loading, setLoading] = useState(false);

  // Update form data state when inputs change
  const handleInputChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const API_KEY = import.meta.env.VITE_GEO_API;

  // Fetch location suggestions from Geoapify API
  const fetchLocations = async (input) => {
    setQuery(input);
    if (!input) return;
    try {
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${input}&apiKey=${API_KEY}`
      );
      setSuggestions(
        response.data.features.map((place) => place.properties.formatted)
      );
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  // When a suggestion is clicked, update query and formData
  const handleLocationSelect = (location) => {
    setQuery(location);
    setSuggestions([]);
    handleInputChange("destination", location);
  };

  const handleBudgetSelect = (budget) => {
    setSelectedBudget(budget);
    handleInputChange("budget", budget);
  };

  const handleTravelCompanionsSelect = (companions) => {
    setSelectedTravelCompanions(companions);
    handleInputChange("companions", companions);
  };

  // Generate the AI prompt by replacing placeholders in the prompt template
  const generateTripPrompt = (data) => {
    return AI_PROMPT
      .replace("${location}", data.destination)
      .replace("${days}", data.days)
      .replace("${budget}", data.budget)
      .replace("${companions}", data.companions);
  };

  // Function to generate the trip using your AI service and then save to Firestore
  const handleGenerateTrip = async () => {
    const user = localStorage.getItem("user");
    if (!user) {
      setOpenDialog(true);
      return;
    }
    setLoading(true);
    const FINAL_PROMPT = generateTripPrompt(formData);
    console.log("Final prompt:", FINAL_PROMPT);
    try {
      const result = await generateTravelPlan(
        formData.destination,
        formData.days,
        formData.companions,
        formData.budget
      );
      console.log("Generated Trip Plan:", result);
      // Save the generated trip data to Firestore and navigate afterward
      await saveAiTrip(result);
    } catch (error) {
      console.error("Error generating trip:", error);
    } finally {
      setLoading(false);
    }
  };

  // Save generated trip details to Firestore and navigate to the view-trip page
  const saveAiTrip = async (TripData) => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const docId = Date.now().toString();
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: JSON.parse(TripData),
        userEmail: user?.email,
        id: docId, 
      });
      console.log("Trip saved successfully with docId:", docId);
      navigate(`/view-trip/${docId}`);
    } catch (error) {
      console.error("Error saving trip:", error);
    }
    setLoading(false);
  };

  // Google Login Success: decode token and store user info in localStorage
  const handleGoogleLoginSuccess = (response) => {
    console.log("Google login successful:", response);
    const token = response?.credential;
    try {
      const decoded = jwtDecode(token);
      console.log("Decoded token information:", decoded);
      localStorage.setItem("user", JSON.stringify(decoded));
      setOpenDialog(false);
    } catch (error) {
      console.error("JWT decoding error:", error);
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error("Google login failed:", error);
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 mt-16 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <svg
            className="animate-spin h-12 w-12 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            ></path>
          </svg>
        </div>
      )}
      
      <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-10">
        <h1 className="font-extrabold text-4xl text-center mb-6 text-blue-600">
          Plan Your Dream Trip!
        </h1>
        <p className="text-xl text-gray-500 text-center mb-8">
          Provide some basic details about your upcoming journey, and we'll create a personalized plan just for you.
        </p>

        {/* Location Input Field */}
        <div className="mt-8">
          <input
            type="text"
            className="border p-4 w-full rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
            placeholder="Type a location..."
            value={query}
            onChange={(e) => fetchLocations(e.target.value)}
          />
          <ul className="mt-2 max-h-60 overflow-y-auto bg-white border p-4 rounded-xl shadow-sm">
            {suggestions.map((location, index) => (
              <li
                key={index}
                className="p-3 hover:bg-gray-200 cursor-pointer rounded-lg"
                onClick={() => handleLocationSelect(location)}
              >
                {location}
              </li>
            ))}
          </ul>
        </div>

        {/* Days Input Field */}
        <div className="mt-8">
          <h2 className="text-2xl my-4 font-medium">
            How many days are you planning your trip?
          </h2>
          <Input
            type="number"
            placeholder="Ex. 3"
            className="w-full p-4 rounded-xl border focus:ring-2 focus:ring-blue-400 mb-6"
            value={formData.days}
            onChange={(e) => handleInputChange("days", e.target.value)}
          />
        </div>

        {/* Budget Selection Field */}
        <div className="mt-8">
          <h2 className="text-2xl my-4 font-medium">What is your Budget?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SelectBudgetList.map((item, index) => (
              <div
                key={index}
                className={`p-6 border rounded-xl transition-all hover:shadow-lg cursor-pointer ${
                  selectedBudget === item.title ? "bg-blue-100 border-blue-500" : "hover:bg-gray-100"
                }`}
                onClick={() => handleBudgetSelect(item.title)}
              >
                <h2 className="text-2xl font-semibold">{item.icons}</h2>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-gray-600">{item.desc}</p>
                <p className="text-sm text-gray-500">{item.range}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Travel Companions Selection Field */}
        <div className="mt-8">
          <h2 className="text-2xl my-4 font-medium">Who are you traveling with?</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {SelectTravelList.map((item, index) => (
              <div
                key={index}
                className={`p-6 border rounded-xl transition-all hover:shadow-lg cursor-pointer ${
                  selectedTravelCompanions === item.title ? "bg-blue-100 border-blue-500" : "hover:bg-gray-100"
                }`}
                onClick={() => handleTravelCompanionsSelect(item.title)}
              >
                <h2 className="text-2xl font-semibold">{item.icons}</h2>
                <h2 className="text-xl font-semibold">{item.title}</h2>
                <p className="text-gray-600">{item.desc}</p>
                <p className="text-sm text-gray-500">{item.people}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Generate Trip Button */}
        <div className="mt-10 flex justify-center">
          {loading ? (
            <Button className="px-8 py-4 bg-gray-400 text-white font-semibold text-lg rounded-xl shadow-lg" disabled>
              Generating...
            </Button>
          ) : (
            <Button
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold text-lg rounded-xl shadow-xl transform transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={handleGenerateTrip}
            >
              Generate Trip
            </Button>
          )}
        </div>
      </div>

      {/* Google Login Dialog */}
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              Please sign in with Google to proceed.
            </DialogDescription>
            <GoogleLogin
              onSuccess={handleGoogleLoginSuccess}
              onError={handleGoogleLoginFailure}
              useOneTap
              theme="outline"
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
