// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { get } from "lodash";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDfcjHMv0GXdYour2I-LLjYVVmoUEFpXG0",
  authDomain: "ai-trip-planner-f6afd.firebaseapp.com",
  projectId: "ai-trip-planner-f6afd",
  storageBucket: "ai-trip-planner-f6afd.firebasestorage.app",
  messagingSenderId: "323097913996",
  appId: "1:323097913996:web:721d6850c743e7fda369a9",
  measurementId: "G-LNPDZ6X95L"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app);

//const analytics = getAnalytics(app);