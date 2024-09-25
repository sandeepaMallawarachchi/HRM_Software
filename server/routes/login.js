// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const EmployeeModel = require("../models/Employee"); // Use a distinct name for your model
const { body, validationResult } = require("express-validator");
require("dotenv").config(); // Load environment variables

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET; // Use an environment variable

// Login Route
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email format"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      // Find the Employee by email
      const employee = await EmployeeModel.findOne({ email });
      if (!employee) {
        return res.status(400).json({ message: "Invalid email" });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, employee.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid password" });
      }

      // Create a JWT token
      const payload = { employeeId: employee._id }; // Use a lowercase property name for consistency
      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

      // Send the token back to the client
      res.json({ token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  }
);

module.exports = router;
