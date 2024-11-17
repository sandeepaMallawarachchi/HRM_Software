import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }) => {
  const token = localStorage.getItem("authToken");
  const [isSessionExpired, setIsSessionExpired] = useState(false);
  const INACTIVITY_LIMIT = 6 * 60 * 60 * 1000;

  useEffect(() => {
    let inactivityTimer;

    const resetInactivityTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        setIsSessionExpired(true);
        localStorage.removeItem("empId");
        localStorage.removeItem("loginTimestamp");
      }, INACTIVITY_LIMIT);
    };

    // List of events to consider as activity
    const activityEvents = ['mousemove', 'keydown', 'scroll', 'click'];

    // Attach event listeners to reset the timer on user activity
    activityEvents.forEach(event => window.addEventListener(event, resetInactivityTimer));

    // Initialize the inactivity timer
    resetInactivityTimer();

    return () => {
      clearTimeout(inactivityTimer);
      activityEvents.forEach(event => window.removeEventListener(event, resetInactivityTimer));
    };
  }, []);

  if (isSessionExpired) {
    alert("Session expired due to inactivity. You will be redirected to the login page.");
    return <Navigate to="/" />;
  }

  return token ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
