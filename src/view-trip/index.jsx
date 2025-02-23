import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import InfoSection from "@/components/InfoSection";
import Hotels from "@/components/Hotels";
import PlacesToVisit from "@/components/PlacesToVisit";

function ViewTrip() {
  const { tripId } = useParams();
  const navigate = useNavigate();
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0); // Progress state

  // Simulate loading progress
  useEffect(() => {
    let interval;
    if (loading) {
      interval = setInterval(() => {
        setProgress((oldProgress) => {
          if (oldProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return oldProgress + 10; // Increase by 10% every interval
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const getTripData = async () => {
    try {
      const docRef = doc(db, "AITrips", tripId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        console.log("Document data:", docSnap.data());
        setTripData(docSnap.data());
      } else {
        console.log("No such document");
      }
    } catch (error) {
      console.error("Error fetching trip data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getTripData();
  }, [tripId]);

  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      {/* Back Button */}
      <button
        onClick={() => navigate("/CreateTrip")}
        className="mb-6 px-4 py-2 bg-gray-300 hover:bg-gray-400 text-black rounded-md"
      >
        ← Back to Create Trip
      </button>

      {/* Progress Bar */}
      {loading ? (
        <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
          <div
            className="bg-blue-500 h-3 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      ) : (
        <>
          <InfoSection trip={tripData} />
          <Hotels trip={tripData} />
          <PlacesToVisit trip={tripData} />
        </>
      )}
    </div>
  );
}

export default ViewTrip;
