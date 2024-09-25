import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Send login credentials to the backend
      const res = await axios.post("http://localhost:4000/login", {
        email,
        password,
      }); // Ensure URL is correct

      // Get the token from the response
      const { token } = res.data;

      // Store the token in localStorage
      localStorage.setItem("authToken", token);

      // Navigate to the dashboard or home page
      navigate("/");
    } catch (err) {
      console.error(err);
      // Display specific error message based on response
      if (err.response && err.response.status === 400) {
        setError("Invalid login credentials");
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false); // Ensure loading is reset whether the request fails or succeeds
    }
  };

  return (
    <div className="container mx-auto h-screen flex">
      {/* Left side for the company logo */}
      <div className="w-6/12 px-4 flex items-center justify-center">
        <img
          src={logo} // Use the imported logo variable
          alt="Company Logo" // Descriptive alt text
          className="h-24" // Adjust height as needed
        />
      </div>

      {/* Right side for the login form */}
      <div className="w-6/12 px-4 flex items-center justify-center">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
          <div className="flex-auto px-4 py-5">
            <div className="text-blueGray-400 text-center mb-3 font-bold">
              <small>Or sign in with credentials</small>
            </div>

            {/* Display error message */}
            {error && (
              <div
                className="text-red-500 text-center mb-3 font-bold"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-1"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  type="email"
                  className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-blueGray-600 text-xs font-bold mb-1"
                  htmlFor="password"
                >
                  Password
                </label>
                <input
                  type="password"
                  className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    id="customCheckLogin"
                    type="checkbox"
                    className="form-checkbox border-0 rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  />
                  <span className="ml-2 text-sm font-semibold text-blueGray-600">
                    Remember me
                  </span>
                </label>
              </div>

              <div className="text-center mt-4">
                <button
                  style={{ backgroundColor: "#fa7c10" }}
                  className="text-black text-sm font-bold uppercase px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  type="submit"
                  disabled={loading} // Disable button while loading
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>

            {/* Links for Forgot Password and Create New Account */}
            <div className="flex flex-col items-center mt-4">
              <Link to="/forgot-password" className="text-blueGray-600 text-sm">
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
