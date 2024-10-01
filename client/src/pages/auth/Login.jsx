import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../images/logo.png";
import axios from "axios";

export default function Login({ setIsAuthenticated }) {
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
      const res = await axios.post("http://localhost:4000/employees/login", {
        email,
        password,
      });

      const { token, employeeId } = res.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("id", employeeId);

      // Set authenticated state
      setIsAuthenticated(true);

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 400) {
        setError("Invalid login credentials");
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto h-screen flex">
      <div className="w-6/12 px-4 flex items-center justify-center">
        <img
          src={logo}
          alt="Company Logo"
          className="h-24"
        />
      </div>

      <div className="w-[500px] px-4 flex items-center justify-center">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
          <div className="flex-auto px-4 py-5">
            <div className="text-blueGray-400 text-center mb-3 font-bold">
              <small>Or sign in with credentials</small>
            </div>

            {error && (
              <div
                className="text-red-600 text-center mb-3 font-bold"
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
                  className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded-md text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
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
                  className="border-0 px-3 py-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded-md text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
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
                  className="text-white text-sm font-bold uppercase bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-[20px] shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>

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