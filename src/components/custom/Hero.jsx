import React from "react";
import { Link } from "react-router-dom";
import Aurora from "../../../y/Aurora/Aurora"; // Import the Aurora component

function Hero() {
  return (
    <div className="relative w-full h-[500px] flex flex-col items-center justify-center text-white overflow-hidden px-4">
      {/* Aurora Animated Background */}
      <div className="absolute inset-0 z-0">
        <Aurora colorStops={["#00d8ff", "#7cff67", "#00d8ff"]} amplitude={1.0} />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center mx-4 max-w-[90%] sm:max-w-[600px]">
        <h1 className="font-extrabold text-4xl sm:text-5xl md:text-[60px] leading-tight sm:leading-[1.2]">
          From Ideas to Itinerary— 
          <span className="text-red-500"> Let AI Plan Your Next Adventure!</span>
        </h1>
        <h2 className="text-lg sm:text-xl text-gray-300 mt-4">
          Smart, stress-free travel planning with personalized suggestions.
        </h2>
        <Link to={"/CreateTrip"}>
          <button className="mt-6 px-6 py-3 text-lg sm:text-xl bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Get Started
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Hero;
