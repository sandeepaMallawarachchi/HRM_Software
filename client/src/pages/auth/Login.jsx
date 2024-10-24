import React, { useState } from "react";
import logo from "../../images/hrm withoutbackground.png";
import axios from "axios";
import { FaKey, FaEnvelope } from "react-icons/fa";
import ForgotPasswordModal from "./ForgotPassword";
import backgroundVideo from "../../videos/hrm intro.mp4";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/auth/login", {
        email,
        password,
      });

      const { token, employeeId, email: userEmail } = res.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("empId", employeeId);
      localStorage.setItem("email", userEmail); // Store the email in localStorage

      window.location.href = "/dashboard";
    } catch (err) {
      console.error(err);
      setError("Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto h-screen flex ">
      {/* Background Video */}
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        src={backgroundVideo}
        autoPlay
        muted
      />
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setIsForgotPasswordOpen(false)}
      />

      <div className="w-6/12 px-4 flex items-center justify-center">
        <img src={logo} alt="Company Logo" className="h-24" />
      </div>

      <div className="w-[500px] px-4 flex items-center justify-center">
        <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
          <h1 className="text-3xl text-gray-600 font-semibold text-center my-5">
            Login
          </h1>
          <div className="flex-auto px-4 py-5">
            {error && (
              <div
                className="text-red-600 text-center mb-3"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="relative w-full mb-3">
                <label
                  className="block uppercase text-gray-600 text-xs font-bold mb-1"
                  htmlFor="email"
                >
                  <FaEnvelope className="inline-block mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  className="mt-1 block w-full border rounded-md p-2"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative w-full mb-3 mt-5">
                <label
                  className="block uppercase text-gray-600 text-xs font-bold mb-1"
                  htmlFor="password"
                >
                  <FaKey className="inline-block mr-2" />
                  Password
                </label>
                <input
                  type="password"
                  className="mt-1 block w-full border rounded-md p-2"
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
                    className="form-checkbox border rounded text-blueGray-700 ml-1 w-5 h-5 ease-linear transition-all duration-150"
                  />
                  <span className="ml-2 text-sm font-semibold text-blueGray-600">
                    Remember me
                  </span>
                </label>
              </div>

              <div className="text-center mt-4">
                <button
                  className="text-white text-sm uppercase bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-[20px] shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </div>
            </form>

            <div className="flex flex-col items-center mt-4">
              <button
                onClick={() => setIsForgotPasswordOpen(true)}
                className="text-orange-500 text-sm underline"
              >
                Forgot Password?
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
