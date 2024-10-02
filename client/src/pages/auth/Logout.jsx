import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const confirmLogout = () => {
      const confirm = window.confirm("Are you sure you want to log out?");
      if (confirm) {
        // Clear the auth token from localStorage
        localStorage.removeItem("authToken");
        // Set isAuthenticated to false
        setIsAuthenticated(false);
        // Redirect to the login page
        navigate("/");
      }
    };

    confirmLogout();
  }, [navigate, setIsAuthenticated]);

  return null;
};

export default Logout;