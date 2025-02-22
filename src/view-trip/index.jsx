import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import InfoSection from "@/components/InfoSection";
import Hotels from "@/components/Hotels";
import PlacesToVisit from "@/components/PlacesToVisit";


function ViewTrip() {
  // Get the tripId parameter from the URL
  const { tripId } = useParams();

  // State to hold fetched trip data and a loading flag
  const [tripData, setTripData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch trip data from Firestore
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

  // Fetch the trip data when the component mounts or when tripId changes
  useEffect(() => {
    getTripData();
  }, [tripId]);

  return (
    <div className="p-10 md:px-20 lg:px-44 xl:px-56">
      {loading ? (
        <p>Loading trip data...</p>
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
