import React, { useEffect, useState, useCallback } from "react";

function InfoSection({ trip }) {
  const [photoUrl, setPhotoUrl] = useState("/placeholder.jpg"); // Default image
  const [loading, setLoading] = useState(true);

  const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY; // API Key from .env
  const API_URL = "https://api.unsplash.com/search/photos";

  // Function to fetch image from Unsplash
  const fetchImage = useCallback(async (query) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}?query=${encodeURIComponent(query + " travel landscape")}&per_page=1`,
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
    } finally {
      setLoading(false);
    }
  }, [UNSPLASH_ACCESS_KEY]);

  useEffect(() => {
    if (trip?.userSelection?.destination) {
      fetchImage(trip.userSelection.destination);
    }
  }, [trip, fetchImage]);

  // Share button handler
  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: "Trip Details",
          text: `Check out this trip to ${trip?.userSelection?.destination}!`,
          url: window.location.href,
        })
        .then(() => console.log("Share successful"))
        .catch((error) => console.error("Error sharing", error));
    } else {
      alert("Sharing is not supported in this browser.");
    }
  };

  return (
    <div className="info-section">
      {loading ? (
        <div className="h-[340px] w-full flex items-center justify-center bg-gray-200 rounded-xl">
          <p className="text-gray-500">Loading image...</p>
        </div>
      ) : (
        <img
          src={photoUrl}
          className="h-[340px] w-full object-cover rounded-xl"
          alt="Trip Destination"
        />
      )}
      <div className="my-5 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">
            {trip?.userSelection?.destination || "No destination provided"}
          </h2>
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-1 bg-blue-500 text-white text-sm rounded-full hover:bg-blue-600"
          >
            Share
          </button>
        </div>
        <div className="flex gap-2">
          <h2 className="p-1 text-lg px-3 bg-gray-200 rounded-full text-gray-500">
            📅 {trip?.userSelection?.days}
          </h2>
          <h2 className="p-1 text-lg px-3 bg-gray-200 rounded-full text-gray-500">
            💰 {trip?.userSelection?.budget}
          </h2>
          <h2 className="p-1 text-lg px-3 bg-gray-200 rounded-full text-gray-500">
            🧑‍🤝‍🧑 {trip?.userSelection?.companions}
          </h2>
        </div>
      </div>
    </div>
  );
}

export default InfoSection;
