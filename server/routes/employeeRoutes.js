const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();

const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../database");

// Create login credentials
router.post("/loginCredentials", async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Log the hashed password for debugging
    console.log("Hashed Password:", hashedPassword);

    const newEmployeeLogin = { username, email, password: hashedPassword };

    const [results] = await pool.query(
      "INSERT INTO logindetails (username, email, password) VALUES (?, ?, ?)",
      [
        newEmployeeLogin.username,
        newEmployeeLogin.email,
        newEmployeeLogin.password,
      ]
    );

    // Get the newly created employee ID
    const employeeId = results.insertId; // Use results.insertId to get the new employee's ID

    // Send success response with employee ID
    res
      .status(201)
      .json({ message: "Employee Login Created successfully", employeeId });
  } catch (error) {
    console.error("Error saving employee login data:", error);
    res.status(500).json({ error: "Error saving employee login data" });
  }
});

// Create work details
router.post("/workDetails", async (req, res) => {
  const {
    workEmail,
    workPhone,
    department,
    location,
    designation,
    supervisor,
  } = req.body;

  try {
    const newWorkDetails = {
      workEmail,
      workPhone,
      department,
      location,
      designation,
      supervisor,
    };

    const [results] = await pool.query(
      "INSERT INTO workdetails (workEmail, workPhone, department, location, designation, supervisor) VALUES (?, ?, ?, ?, ?, ?)",
      [
        newWorkDetails.workEmail,
        newWorkDetails.workPhone,
        newWorkDetails.department,
        newWorkDetails.location,
        newWorkDetails.designation,
        newWorkDetails.supervisor,
      ]
    );

    res.status(201).json({
      message: "Employee Work Details Created successfully",
      employeeId: results.insertId,
    });
  } catch (error) {
    console.error("Error saving employee work data:", error);
    res.status(500).json({ error: "Error saving employee work data" });
  }
});

// Get employee by id
router.get("/getEmployee/:id", async (req, res) => {
  const employeeId = req.params.id;

  try {
    const [rows] = await pool.query("SELECT * FROM logindetails WHERE id = ?", [
      employeeId,
    ]);

    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    console.error("Error fetching employee details:", error);
    res.status(500).json({ error: "Error fetching employee details" });
  }
});

// Get employee work details by id
router.get("/getWorkDetails/:id", async (req, res) => {
  const employeeId = req.params.id;

  try {
    const [rows] = await pool.query("SELECT * FROM workdetails WHERE id = ?", [
      employeeId,
    ]);

    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: "Work details not found" });
    }
  } catch (error) {
    console.error("Error fetching work details:", error);
    res.status(500).json({ error: "Error fetching work details" });
  }
});

// Login employee
router.post("/login", async (req, res) => {
  const { email, password } = req.body; // Only use email

  try {
    // Retrieve employee by email
    const [rows] = await pool.query(
      "SELECT * FROM logindetails WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid email" });
    }

    const employee = rows[0];

    // Compare password with hashed password
    const match = await bcrypt.compare(password, employee.password);
    if (!match) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // Successful login
    res
      .status(200)
      .json({ message: "Login successful", employeeId: employee.id });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Error during login" });
  }
});

// Upload profile picture
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// Endpoint to upload profile picture
router.post(
  "/uploadProfileImage/:id",
  upload.single("profileImage"),
  (req, res) => {
    const empId = req.params.id;
    const imagePath = `/uploads/${req.file.filename}`;

    const sql = "UPDATE employees SET profilepic = ? WHERE id = ?";
    pool.query(sql, [imagePath, empId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send("Error updating profile image.");
      }
      res.status(200).json({ imageUrl: imagePath });
    });
  }
);

// Get profile picture by id
router.get("/getProfileImage/:id", async (req, res) => {
  const empId = req.params.id;

  try {
    const [rows] = await pool.query(
      "SELECT profilepic FROM employees WHERE id = ?",
      [empId]
    );

    if (rows.length > 0) {
      res.status(200).json({ imageUrl: rows[0].profilepic });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    console.error("Error fetching profile image:", error);
    res.status(500).json({ error: "Error fetching profile image" });
  }
});

module.exports = router;
