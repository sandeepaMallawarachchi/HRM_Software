const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
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

// Use the secret key from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

//employee login
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

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

        // Successful login: create a token
        const token = jwt.sign({ id: employee.id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: "Login successful", token, employeeId: employee.id });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Error during login" });
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

// Save personal details
router.post('/savePersonalDetails/:id', async (req, res) => {
    const { id } = req.params;
    const {
        name, email, phone, emergency_contact, address,
        date_of_birth, gender, country, marital_status, dependents
    } = req.body;

    try {
        const [existing] = await pool.query('SELECT * FROM personaldetails WHERE id = ?', [id]);

        if (existing.length > 0) {
            // Update existing record
            await pool.query(
                'UPDATE personaldetails SET name = ?, email = ?, phone = ?, emergency_contact = ?, address = ?, date_of_birth = ?, gender = ?, country = ?, marital_status = ?, dependents = ? WHERE id = ?',
                [name, email, phone, emergency_contact, address, date_of_birth, gender, country, marital_status, dependents, id]
            );
            return res.json({ message: 'Personal details updated successfully' });
        } else {
            // Insert new record
            await pool.query(
                'INSERT INTO personaldetails (id, name, email, phone, emergency_contact, address, date_of_birth, gender, country, marital_status, dependents) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [id, name, email, phone, emergency_contact, address, date_of_birth, gender, country, marital_status, dependents]
            );
            return res.status(201).json({ message: 'Personal details created successfully' });
        }
    } catch (error) {
        console.error("Error saving personal details:", error);
        return res.status(500).json({ message: 'Error saving personal details' });
    }
});


// Get personal details by ID
router.get('/getPersonalDetails/:id', async (req, res) => {
    const employeeId = req.params.id;

    try {
        const [rows] = await pool.query('SELECT * FROM personaldetails WHERE id = ?', [employeeId]);

        if (rows.length > 0) {
            res.status(200).json(rows[0]);
        } else {
            res.status(404).json({ message: 'Personal details not found' });
        }
    } catch (error) {
        console.error('Error fetching Personal details:', error);
        res.status(500).json({ error: 'Error fetching Personal details' });
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

//add experinces
router.post('/experience/:empId', async (req, res) => {
    const empId = req.params.empId;
    const { date_from, date_to, company, role } = req.body;

    try {
        const newExperience = { empId, date_from, date_to, company, role };

        const [results] = await pool.query(
            'INSERT INTO experience (empId, date_from, date_to, company, role) VALUES (?, ?, ?, ?, ?)',
            [newExperience.empId, newExperience.date_from, newExperience.date_to, newExperience.company, newExperience.role]
        );

        res.status(201).json({ message: 'Employee experience created successfully', employeeId: results.insertId });
    } catch (error) {
        console.error('Error saving employee experience:', error);
        res.status(500).json({ error: 'Error saving employee experience' });
    }
});

//get experience by id
router.get('/getexperience/:empId', async (req, res) => {
    const employeeId = req.params.empId;

    try {
        const [rows] = await pool.query('SELECT * FROM experience WHERE empId = ?', [employeeId]);

        if (rows.length > 0) {
            res.status(200).json(rows); // Return all experience records
        } else {
            res.status(404).json({ message: 'Experience details not found' });
        }
    } catch (error) {
        console.error('Error fetching experience details:', error);
        res.status(500).json({ error: 'Error fetching experience details' });
    }
});

//update experience
router.put('/updateExperience/:empId/:expId', async (req, res) => {
    const empId = req.params.empId;
    const expId = req.params.expId;
    const { date_from, date_to, company, role } = req.body;

    try {
        const [results] = await pool.query(
            'UPDATE experience SET date_from = ?, date_to = ?, company = ?, role = ? WHERE empId = ? AND id = ?',
            [date_from, date_to, company, role, empId, expId]
        );

        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Experience not found' });
        }

        res.status(200).json({ message: 'Employee experience updated successfully' });
    } catch (error) {
        console.error('Error updating employee experience:', error);
        res.status(500).json({ error: 'Error updating employee experience' });
    }
});

//delete experience
router.delete('/deleteExperience/:id', async (req, res) => {
    const experienceId = parseInt(req.params.id, 10); // Convert to integer

    try {
        const result = await pool.query('DELETE FROM experience WHERE id = ?', [experienceId]);
        console.log(result); // Log the result of the query

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Experience deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Experience not found.' });
        }
    } catch (error) {
        console.error('Error deleting experience:', error.message); // Log the error message
        res.status(500).json({ message: 'Server error.' });
    }
});

module.exports = router;
