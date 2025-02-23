import React from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import PlaceCard from "./PlaceCard";

function PlacesToVisit({ trip }) {
  if (!trip || !trip.tripData) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          No trip data provided. Please ensure the trip information is available.
        </AlertDescription>
      </Alert>
    );
  }

  // Extracting tripData properly
  const tripDataObj = trip?.tripData?.TravelPlan || {};

  // Extract itinerary safely
  const itinerary = tripDataObj?.itinerary || {};

  // Extract and sort days that have valid places
  const sortedDays = Object.keys(itinerary)
    .filter(day => Array.isArray(itinerary[day]?.places) && itinerary[day]?.places.length > 0)
    .sort((a, b) => parseInt(a.replace(/\D/g, ""), 10) - parseInt(b.replace(/\D/g, ""), 10));

  if (sortedDays.length === 0) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>No places to visit available for this trip.</AlertDescription>
      </Alert>
    );
  }

  return (
    <section className="mt-5">
      <h2 className="text-2xl font-bold mb-4">🗺️ Places to Visit</h2>

      {sortedDays.map((day) => {
        const dayData = itinerary[day] || {};
        const bestTimeToVisit = dayData?.bestTimeToVisit || "Anytime";
        const places = Array.isArray(dayData?.places) ? dayData.places : [];

        return (
          <div key={day} className="p-5">
            <div className="mb-4">
              <h3 className="text-xl font-semibold">📅 {day.replace(/([A-Z])/g, " $1").trim()}</h3>
              {bestTimeToVisit && (
                <p className="text-gray-600 mt-2">
                  🕒 <span className="font-medium">Best Time to Visit:</span> {bestTimeToVisit}
                </p>
              )}
            </div>

            {places.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                {places.map((place, index) => (
                  <div key={`${day}-place-${index}`} className="flex justify-center">
                    <PlaceCard place={place} />
                  </div>
                ))}
              </div>
            ) : (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>No places available for this day.</AlertDescription>
              </Alert>
            )}
          </div>
        );
      })}
    </section>
  );
}

export default PlacesToVisit;
