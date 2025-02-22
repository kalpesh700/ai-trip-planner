import { normalizeKeys } from './utils';

function Hotels({ trip }) {
  const normalizedTrip = normalizeKeys(trip);
  const tripDataObj = normalizedTrip?.tripdata || {}; // Directly access tripdata
  const travelPlan = tripDataObj?.travelplan || {};
  const hotels = travelPlan?.hotels || travelPlan?.hoteloptions || [];

  return (
    <div className="hotels-section mt-5">
      <h2 className="text-2xl font-bold mb-4">🏨 Hotel Recommendations</h2>
      {hotels.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {hotels.map((hotel, index) => (
            <div
              key={index}
              className="border rounded-lg shadow-lg hover:shadow-xl transition-all overflow-hidden bg-white"
            >
              {/* ✅ Always Display Static Image */}
              <img
                src="/hotels.jpg"
                alt="Hotel"
                className="w-full h-48 object-cover"
                onError={(e) => {
                  e.target.onerror = null; // Prevent infinite loop
                  e.target.src = "/hotels.jpg"; // Ensure fallback always loads
                }}
              />
              
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">🏡 {hotel.hotelname}</h3>
                <p className="text-gray-600 mb-2">📍 <strong>Address:</strong> {hotel.hoteladdress}</p>
                <p className="text-gray-500 text-sm">💰 <strong>Price:</strong> {hotel.price}</p>
                <p className="text-gray-500 text-sm">⭐ <strong>Rating:</strong> {hotel.rating} / 5</p>
                {hotel.description && (
                  <p className="text-gray-600 mt-2">ℹ️ {hotel.description}</p>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => window.open(
                      `https://www.google.com/search?q=${encodeURIComponent(hotel.hotelname)}`, "_blank"
                    )}
                    className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                  >
                    🔎 Google Search
                  </button>
                  <button
                    onClick={() => window.open(
                      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hotel.hotelname)}`, "_blank"
                    )}
                    className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                  >
                    🗺️ View on Map
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>❌ No hotel recommendations available.</p>
      )}
    </div>
  );
}

export default Hotels;
