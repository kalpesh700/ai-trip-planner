import React, { useEffect, useState } from "react";

function PlaceCard({ place, bestTimeToVisit }) {
  const [photoUrl, setPhotoUrl] = useState(place.PlaceImageUrl || "/placeholder.jpg"); // Default image
  const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; // API Key from .env
  const API_URL = "https://api.unsplash.com/search/photos";

  // Function to fetch image from Unsplash if not provided
  const fetchImage = async (query) => {
    try {
      const response = await fetch(
        `${API_URL}?query=${encodeURIComponent(query)}&orientation=landscape&per_page=1`,
        {
          headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch image");

      const data = await response.json();
      if (data.results.length > 0) {
        setPhotoUrl(data.results[0].urls.regular); // Set first image URL
      } else {
        console.log("No image found, using placeholder");
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  useEffect(() => {
    if (!place.PlaceImageUrl && place.placeName) {
      fetchImage(place.placeName);
    }
  }, [place.placeName, place.PlaceImageUrl]);

  // Determine background color based on bestTimeToVisit
  const getBackgroundColor = (time) => {
    switch (time) {
      case "Morning":
        return "bg-yellow-100"; // Light Yellow
      case "Afternoon":
        return "bg-orange-100"; // Light Orange
      case "Evening":
        return "bg-blue-100"; // Light Blue
      default:
        return "bg-white"; // Default White
    }
  };

  return (
    <div 
      className={`w-80 sm:w-full md:w-96 lg:w-80 xl:w-96 h-auto border rounded-2xl shadow-md overflow-hidden ${getBackgroundColor(bestTimeToVisit)} hover:shadow-lg transition-all`}
    >
      {/* Display Place Image - Adjusted for better visibility */}
      <img 
        src={photoUrl} 
        alt={place.placeName} 
        className="w-full h-60 sm:h-56 md:h-64 lg:h-60 xl:h-64 object-cover rounded-t-2xl" 
      />

      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">📍 {place.placeName}</h3>
        <p className="text-gray-700 mb-2">📝 <strong>Details:</strong> {place.PlaceDetails}</p>
        <p className="text-gray-600 text-sm">⭐ <strong>Rating:</strong> {place.rating} / 5</p>
        <p className="text-gray-600 text-sm">🕒 <strong>Travel Time:</strong> {place.TimeTravel}</p>
        <p className="text-gray-600 text-sm">🎟️ <strong>Ticket Price:</strong> {place.ticketPricing}</p>

        {/* Button to View on Google Maps */}
        <div className="mt-4">
          <button 
            onClick={() => window.open(
              `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.placeName)}`, "_blank"
            )}
            className="px-4 py-2 bg-green-500 text-white text-sm rounded-lg hover:bg-green-600 transition-colors"
          >
            🗺️ View on Map
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlaceCard;
