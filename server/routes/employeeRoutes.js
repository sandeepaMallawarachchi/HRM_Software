const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
<<<<<<< HEAD
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
=======
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pool = require('../database');

// Create login credentials
router.post('/loginCredentials', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newEmployeeLogin = { username, email, password: hashedPassword };

        const [results] = await pool.query(
            'INSERT INTO logindetails (username, email, password) VALUES (?, ?, ?)',
            [newEmployeeLogin.username, newEmployeeLogin.email, newEmployeeLogin.password]
        );
>>>>>>> developer

      const employee = result[0]; // Assuming result is an array of rows and we need the first one

<<<<<<< HEAD
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
=======
// Create work details
router.post('/workDetails', async (req, res) => {
    const { workEmail, workPhone, department, location, designation, supervisor } = req.body;

    try {
        const newWorkDetails = { workEmail, workPhone, department, location, designation, supervisor };

        const [results] = await pool.query(
            'INSERT INTO workdetails (workEmail, workPhone, department, location, designation, supervisor) VALUES (?, ?, ?, ?, ?, ?)',
            [newWorkDetails.workEmail, newWorkDetails.workPhone, newWorkDetails.department, newWorkDetails.location, newWorkDetails.designation, newWorkDetails.supervisor]
        );

        res.status(201).json({ message: 'Employee Work Details Created successfully', employeeId: results.insertId });
    } catch (error) {
        console.error('Error saving employee work data:', error);
        res.status(500).json({ error: 'Error saving employee work data' });
    }
});

// Get employee by id
router.get('/getEmployee/:id', async (req, res) => {
    const employeeId = req.params.id;

    try {
        const [rows] = await pool.query('SELECT * FROM logindetails WHERE id = ?', [employeeId]);

        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        console.error('Error fetching employee details:', error);
        res.status(500).json({ error: 'Error fetching employee details' });
    }
>>>>>>> developer
});

// Get employee work details by id
router.get('/getWorkDetails/:id', async (req, res) => {
    const employeeId = req.params.id;

    try {
        const [rows] = await pool.query('SELECT * FROM workdetails WHERE id = ?', [employeeId]);

        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Work details not found' });
        }
    } catch (error) {
        console.error('Error fetching work details:', error);
        res.status(500).json({ error: 'Error fetching work details' });
    }
});

// Upload profile picture
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Upload profile picture
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

router.post('/uploadProfileImage/:id', upload.single('profileImage'), (req, res) => {
    const empId = req.params.id;
    const imagePath = `/uploads/${req.file.filename}`;

    const sql = "UPDATE employees SET profilepic = ? WHERE id = ?";
    pool.query(sql, [imagePath, empId], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error updating profile image.');
        }
        res.status(200).json({ imageUrl: imagePath });
    });
});

//get profile picture by id
router.get('/getProfileImage/:id', async (req, res) => {
    const empId = req.params.id;

    try {
        const [rows] = await pool.query('SELECT profilepic FROM employees WHERE id = ?', [empId]);

        if (rows.length > 0) {
            res.status(200).json({ imageUrl: rows[0].profilepic });
        } else {
            res.status(404).json({ message: 'Employee not found' });
        }
    } catch (error) {
        console.error('Error fetching profile image:', error);
        res.status(500).json({ error: 'Error fetching profile image' });
    }
});

module.exports = router;