import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("authToken");

  if (!token) {
    // If there's no token, redirect to login
    return <Navigate to="/" />;
  }

  // If authenticated, render the children components
  return children;
};

export default PrivateRoute;