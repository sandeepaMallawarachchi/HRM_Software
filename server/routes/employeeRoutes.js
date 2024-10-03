const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pool = require("../database");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
const crypto = require("crypto");

//send emails
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// Create login credentials
router.post("/loginCredentials", async (req, res) => {
    const { empId, email, password } = req.body;

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Log the hashed password for debugging
        console.log("Hashed Password:", hashedPassword);

        const newEmployeeLogin = { empId, email, password: hashedPassword };

        const [results] = await pool.query(
            "INSERT INTO logindetails (empId, email, password) VALUES (?, ?, ?)",
            [
                newEmployeeLogin.empId,
                newEmployeeLogin.email,
                newEmployeeLogin.password,
            ]
        );

        // Get the newly created employee ID
        const employeeId = results.empId; // Use results.insertId to get the new employee's ID

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
        const token = jwt.sign({ empId: employee.empId }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ message: "Login successful", token, employeeId: employee.empId });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ error: "Error during login" });
    }
});

// Get employee by id
router.get('/getEmployee/:empId', async (req, res) => {
    const employeeId = req.params.empId;

    try {
        const [rows] = await pool.query('SELECT * FROM logindetails WHERE empId = ?', [employeeId]);

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
router.get('/getEmployee/:empId', async (req, res) => {
    const employeeId = req.params.empId;

    try {
        const [rows] = await pool.query('SELECT * FROM logindetails WHERE empId = ?', [employeeId]);

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
router.get("/getWorkDetails/:empId", async (req, res) => {
    const employeeId = req.params.empId;

    try {
        const [rows] = await pool.query("SELECT * FROM workdetails WHERE empId = ?", [
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
router.post('/savePersonalDetails/:empId', async (req, res) => {
    const { empId } = req.params;
    const {
        name, email, phone, emergency_contact, address,
        date_of_birth, gender, country, marital_status, dependents
    } = req.body;

    try {
        const [existing] = await pool.query('SELECT * FROM personaldetails WHERE empId = ?', [empId]);

        if (existing.length > 0) {
            // Update existing record
            await pool.query(
                'UPDATE personaldetails SET name = ?, email = ?, phone = ?, emergency_contact = ?, address = ?, date_of_birth = ?, gender = ?, country = ?, marital_status = ?, dependents = ? WHERE empId = ?',
                [name, email, phone, emergency_contact, address, date_of_birth, gender, country, marital_status, dependents, empId]
            );
            return res.json({ message: 'Personal details updated successfully' });
        } else {
            // Insert new record
            await pool.query(
                'INSERT INTO personaldetails (empId, name, email, phone, emergency_contact, address, date_of_birth, gender, country, marital_status, dependents) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [empId, name, email, phone, emergency_contact, address, date_of_birth, gender, country, marital_status, dependents]
            );
            return res.status(201).json({ message: 'Personal details created successfully' });
        }
    } catch (error) {
        console.error("Error saving personal details:", error);
        return res.status(500).json({ message: 'Error saving personal details' });
    }
});


// Get personal details by ID
router.get('/getPersonalDetails/:empId', async (req, res) => {
    const employeeId = req.params.empId;

    try {
        const [rows] = await pool.query('SELECT * FROM personaldetails WHERE empId = ?', [employeeId]);

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
router.post("/uploadProfileImage/:empId", upload.single("profileImage"), (req, res) => {
    const empId = req.params.empId;
    const imagePath = `/uploads/${req.file.filename}`;

    const sql = "UPDATE personaldetails SET profilepic = ? WHERE empId = ?";
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
router.get("/getProfileImage/:empId", async (req, res) => {
    const empId = req.params.empId;

    try {
        const [rows] = await pool.query(
            "SELECT profilepic FROM personaldetails WHERE empId = ?",
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

        // Fetch the updated experience
        const [updatedExperience] = await pool.query('SELECT * FROM experience WHERE id = ?', [expId]);

        res.status(200).json(updatedExperience[0]);  // Return the updated experience
    } catch (error) {
        console.error('Error updating employee experience:', error);
        res.status(500).json({ error: 'Error updating employee experience' });
    }
});

//delete experience
router.delete('/deleteExperience/:empId/:expId', async (req, res) => {
    const empId = req.params.empId;
    const expId = req.params.expId;

    try {
        const [result] = await pool.query('DELETE FROM experience WHERE empId = ? and id = ?', [empId, expId]);

        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Experience deleted successfully.' });
        } else {
            res.status(404).json({ message: 'Experience not found.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error.' });
    }
});

//save support details
router.post('/support/:empId', async (req, res) => {
    const empId = req.params.empId;
    const { email, subject, message } = req.body;

    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        // Create a new contact entry
        const newSupport = { empId, email, subject, message };

        const [results] = await pool.query(
            'INSERT INTO support (empId, email, subject, message) VALUES (?, ?, ?, ?)',
            [newSupport.empId, newSupport.email, newSupport.subject, newSupport.message]
        );

        // Respond with the newly created support entry and query result
        res.status(201).json({
            message: 'Support entry created successfully',
            support: newSupport,
            supportId: results.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.post('/requestPasswordReset', async (req, res) => {
    try {
        const { empId, email } = req.body;

        if (!empId && !email) {
            return res.status(400).json({ message: "Please provide either employee ID or email." });
        }

        // Query the database using either empId or email
        let query = '';
        let queryParam = '';

        if (empId) {
            query = 'SELECT * FROM logindetails WHERE empId = ?';
            queryParam = empId;
        } else if (email) {
            query = 'SELECT * FROM logindetails WHERE email = ?';
            queryParam = email;
        }

        const [rows] = await pool.query(query, [queryParam]);

        if (rows.length === 0) {
            return res.status(404).json({ message: "Employee not found" });
        }

        const employee = rows[0];

        // Generate a random 6-digit code
        const resetCode = crypto.randomInt(100000, 999999);

        // Save the reset code and its expiration time (you'll need to adjust this part for your DB model)
        const resetCodeExpires = Date.now() + 15 * 60 * 1000; // 15 minutes

        await pool.query(
            'UPDATE logindetails SET resetcode = ?, resetcodeexpires = ? WHERE empId = ?',
            [resetCode, resetCodeExpires, employee.empId]
        );

        // Send the reset code via email
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: employee.email,
            subject: "Password Reset Request",
            text: `Your password reset code is ${resetCode}. It will expire in 15 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Reset code sent to email" });
    } catch (error) {
        console.error("Error requesting password reset:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

//reset password
router.post('/resetPassword', async (req, res) => {
    try {
        const { resetCode, newPassword } = req.body;

        const [rows] = await pool.query('SELECT * FROM logindetails WHERE resetcode = ?', [resetCode]);

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: 'Resetcode not found' });
        }

        // Check if the reset code is not expired
        if (rows.resetcodeexpires < Date.now()) {
            return res.status(400).json({ message: "Reset code has expired" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password
        admin.password = hashedPassword;
        admin.resetCode = undefined;
        admin.resetCodeExpires = undefined;
        await admin.save();

        res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Error resetting password:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
});

module.exports = router;
