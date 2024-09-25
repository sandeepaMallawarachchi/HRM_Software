const express = require("express");
const router = express.Router();
const pool = require("../database"); // Adjust the path as needed
const bcrypt = require("bcrypt");

// Login with email and password
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Fetch the employee record by email
    const [rows] = await pool.query(
      "SELECT * FROM logindetails WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ error: "No employee found with this email" });
    }

    const employee = rows[0];

    // Compare the provided password with the hashed password
    const isPasswordMatch = await bcrypt.compare(password, employee.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // If login is successful, you can send a token or success response
    res.status(200).json({
      message: "Login successful",
      employeeId: employee.id, // Assuming the employee ID is stored in `id`
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Error during login" });
  }
});

module.exports = router;
