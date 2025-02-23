import React, { useState, useEffect } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate for navigation

function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); // Hook for programmatic navigation

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

    // Navigate to home page after logout
    navigate("/");
  };

  return (
    <div className="p-4 bg-white text-black shadow-md flex justify-between items-center">
      {/* Logo - Clicking navigates to home */}
      <Link to="/">
        <img src="/logo.png" alt="Logo" className="h-20 w-20 cursor-pointer" />
      </Link>

      {/* Title - Clicking navigates to home */}
      <Link to="/" className="text-xl font-semibold cursor-pointer">
        AI Trip Planner
      </Link>

      {/* Google Login/Profile */}
      <div>
        {user ? (
          <img
            src={user.picture}
            alt="User"
            className="h-10 w-10 rounded-full cursor-pointer"
            onClick={handleGoogleLogout} // Clicking logs out and redirects
          />
        ) : (
          <GoogleLogin onSuccess={handleGoogleLoginSuccess} theme="outline" />
        )}
      </div>
    </div>
  );
}

export default Header;
