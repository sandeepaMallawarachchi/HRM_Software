const express = require("express");
const router = express.Router();
const pool = require("../database"); // Adjust the path as needed
const bcrypt = require("bcrypt");

router.post("/register", async (req, res) => {
  const {
    username,
    email,
    password,
    phone,
    address,
    country,
    gender,
    maritalStatus,
  } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newEmployee = {
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      country,
      gender,
      maritalStatus,
    };

    // Use connection pool to insert the new employee
    const [results] = await pool.query(
      "INSERT INTO employees (username, email, password, phone, address, country, gender, marital_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        newEmployee.username,
        newEmployee.email,
        newEmployee.password,
        newEmployee.phone,
        newEmployee.address,
        newEmployee.country,
        newEmployee.gender,
        newEmployee.maritalStatus,
      ]
    );

    res
      .status(201)
      .json({
        message: "Employee registered successfully",
        employeeId: results.insertId,
      });
  } catch (error) {
    console.error("Error saving employee data:", error);
    res.status(500).json({ error: "Error saving employee data" });
  }
});

module.exports = router;
