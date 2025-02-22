import React, { useState, useEffect } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function Header() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Function to update user state when login occurs from another component
    const updateUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    // Initial check when component mounts
    updateUser();

    // Listen for login events from other components
    window.addEventListener("storage", updateUser);

    return () => {
      window.removeEventListener("storage", updateUser);
    };
  }, []);

  const handleGoogleLoginSuccess = (response) => {
    const token = response?.credential;
    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      localStorage.setItem("user", JSON.stringify(decoded));

      // Trigger storage event manually to update other components
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("JWT decoding error:", error);
    }
  };

  const handleGoogleLogout = () => {
    googleLogout();
    setUser(null);
    localStorage.removeItem("user");

    // Trigger storage event manually
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="p-4 bg-white text-black shadow-md flex justify-between items-center">
      {/* Logo */}
      <img src="/logo.png" alt="Logo" className="h-20 w-20" />


      {/* Title */}
      <div className="text-xl font-semibold">
        <span>AI Trip Planner</span>
      </div>

      {/* Google Login/Profile */}
      <div>
        {user ? (
          <img
            src={user.picture}
            alt="User"
            className="h-10 w-10 rounded-full cursor-pointer"
            onClick={handleGoogleLogout}
          />
        ) : (
          <GoogleLogin onSuccess={handleGoogleLoginSuccess} theme="outline" />
        )}
      </div>
    </div>
  );
}

export default Header;
