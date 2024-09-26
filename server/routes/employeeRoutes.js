const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const LoginDetails = require("../models/LoginDetails"); // Adjust the path to match your project structure

// Employee login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    // Fetch employee details from the database by email
    LoginDetails.findByEmail(email, async (err, result) => {
      if (err) {
        console.error("Error fetching employee data:", err);
        return res.status(500).json({ error: "Error fetching employee data" });
      }

      // If no employee with the given email was found
      if (result.length === 0) {
        return res
          .status(404)
          .json({ error: "No employee found with this email" });
      }

      const employee = result[0]; // Assuming result is an array of rows and we need the first one

      // Compare the provided password with the stored hashed password
      const isPasswordMatch = await bcrypt.compare(password, employee.password);

      if (!isPasswordMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }

      // Successful login: return a success message (you could also issue a JWT or session token here)
      res.status(200).json({
        message: "Login successful",
        employeeId: employee.id, // Assuming `id` is the employee's identifier
        email: employee.email,
      });
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Error during login" });
  }
});

module.exports = router;
