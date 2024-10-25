const express = require("express");
const router = express.Router();
const pool = require("../database");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");
const { initializeApp } = require("firebase/app");
const {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
} = require("firebase/storage");
const multer = require("multer");
const config = require("../config/firebase.config");
const validRoles = [
  "Employee",
  "Team Leader",
  "HR",
  "Mid Lvl Manager",
  "Top Lvl Manager",
  "Ceo",
];
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
  const { empId, email, password, role } = req.body;

  // Validate the role
  if (!validRoles.includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Log the hashed password for debugging

    const newEmployeeLogin = { empId, email, password: hashedPassword, role };

    const [results] = await pool.query(
      "INSERT INTO logindetails (empId, email, password, role) VALUES (?, ?, ?, ?)",
      [
        newEmployeeLogin.empId,
        newEmployeeLogin.email,
        newEmployeeLogin.password,
        newEmployeeLogin.role, // Include the role in the insert
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
    const token = jwt.sign({ empId: employee.empId }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      employeeId: employee.empId,
      role: employee.role,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Error during login" });
  }
});

// Get employee by id
router.get("/getEmployee/:empId", async (req, res) => {
  const employeeId = req.params.empId;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM logindetails WHERE empId = ?",
      [employeeId]
    );

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
router.get("/getEmployee/:empId", async (req, res) => {
  const employeeId = req.params.empId;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM logindetails WHERE empId = ?",
      [employeeId]
    );

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
router.get("/getWorkDetails/:empId", async (req, res) => {
  const employeeId = req.params.empId;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM workdetails WHERE empId = ?",
      [employeeId]
    );

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
router.post("/savePersonalDetails/:empId", async (req, res) => {
  const { empId } = req.params;
  const {
    name,
    email,
    phone,
    emergency_contact,
    address,
    date_of_birth,
    gender,
    country,
    marital_status,
    dependents,
  } = req.body;

  try {
    const [existing] = await pool.query(
      "SELECT * FROM personaldetails WHERE empId = ?",
      [empId]
    );

    if (existing.length > 0) {
      // Update existing record
      await pool.query(
        "UPDATE personaldetails SET name = ?, email = ?, phone = ?, emergency_contact = ?, address = ?, date_of_birth = ?, gender = ?, country = ?, marital_status = ?, dependents = ? WHERE empId = ?",
        [
          name,
          email,
          phone,
          emergency_contact,
          address,
          date_of_birth,
          gender,
          country,
          marital_status,
          dependents,
          empId,
        ]
      );
      return res.json({ message: "Personal details updated successfully" });
    } else {
      // Insert new record
      await pool.query(
        "INSERT INTO personaldetails (empId, name, email, phone, emergency_contact, address, date_of_birth, gender, country, marital_status, dependents) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          empId,
          name,
          email,
          phone,
          emergency_contact,
          address,
          date_of_birth,
          gender,
          country,
          marital_status,
          dependents,
        ]
      );
      return res
        .status(201)
        .json({ message: "Personal details created successfully" });
    }
  } catch (error) {
    console.error("Error saving personal details:", error);
    return res.status(500).json({ message: "Error saving personal details" });
  }
});

// Get personal details by ID
router.get("/getPersonalDetails/:empId", async (req, res) => {
  const employeeId = req.params.empId;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM personaldetails WHERE empId = ?",
      [employeeId]
    );

    if (rows.length > 0) {
      res.status(200).json(rows[0]);
    } else {
      res.status(404).json({ message: "Personal details not found" });
    }
  } catch (error) {
    console.error("Error fetching Personal details:", error);
    res.status(500).json({ error: "Error fetching Personal details" });
  }
});

//upload profile image
initializeApp(config.firebaseConfig);
const storage = getStorage();
const upload = multer({ storage: multer.memoryStorage() });

function giveCurrentDateTime() {
  return new Date().toISOString().replace(/:/g, "-");
}

router.post(
  "/uploadProfileImage/:empId",
  upload.single("profilePic"),
  async (req, res) => {
    const empId = req.params.empId;

    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded.");
      }

      const dateTime = giveCurrentDateTime();
      const storageRef = ref(
        storage,
        `profilepic/${req.file.originalname} ${dateTime}`
      );
      const metadata = {
        contentType: req.file.mimetype,
      };

      const snapshot = await uploadBytesResumable(
        storageRef,
        req.file.buffer,
        metadata
      );
      const downloadURL = await getDownloadURL(snapshot.ref);

      // Update profile picture URL in the database
      const updateQuery =
        "UPDATE personaldetails SET profilepic = ? WHERE empId = ?";
      await pool.query(updateQuery, [downloadURL, empId]);

      return res.send({
        message:
          "File uploaded to Firebase Storage and profile picture updated successfully",
        name: req.file.originalname,
        type: req.file.mimetype,
        downloadURL: downloadURL,
      });
    } catch (error) {
      console.error("Error uploading file or updating profile picture:", error);
      return res.status(500).send(error.message);
    }
  }
);

router.get("/getProfileImage/:empId", async (req, res) => {
  const empId = req.params.empId;

  try {
    const [rows] = await pool.query(
      "SELECT profilepic FROM personaldetails WHERE empId = ?",
      [empId]
    );

    if (rows.length > 0) {
      res.status(200).json({ imageUrl: `${rows[0].profilepic}` });
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    console.error("Error fetching profile image:", error);
    res.status(500).json({ error: "Error fetching profile image" });
  }
});

//add experinces
router.post("/experience/:empId", async (req, res) => {
  const empId = req.params.empId;
  const { date_from, date_to, company, role } = req.body;

  try {
    const newExperience = { empId, date_from, date_to, company, role };

    const [results] = await pool.query(
      "INSERT INTO experience (empId, date_from, date_to, company, role) VALUES (?, ?, ?, ?, ?)",
      [
        newExperience.empId,
        newExperience.date_from,
        newExperience.date_to,
        newExperience.company,
        newExperience.role,
      ]
    );

    res.status(201).json({
      message: "Employee experience created successfully",
      employeeId: results.insertId,
    });
  } catch (error) {
    console.error("Error saving employee experience:", error);
    res.status(500).json({ error: "Error saving employee experience" });
  }
});

//get experience by id
router.get("/getexperience/:empId", async (req, res) => {
  const employeeId = req.params.empId;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM experience WHERE empId = ?",
      [employeeId]
    );

    if (rows.length > 0) {
      res.status(200).json(rows); // Return all experience records
    } else {
      res.status(404).json({ message: "Experience details not found" });
    }
  } catch (error) {
    console.error("Error fetching experience details:", error);
    res.status(500).json({ error: "Error fetching experience details" });
  }
});

//update experience
router.put("/updateExperience/:empId/:expId", async (req, res) => {
  const empId = req.params.empId;
  const expId = req.params.expId;
  const { date_from, date_to, company, role } = req.body;

  try {
    const [results] = await pool.query(
      "UPDATE experience SET date_from = ?, date_to = ?, company = ?, role = ? WHERE empId = ? AND id = ?",
      [date_from, date_to, company, role, empId, expId]
    );

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "Experience not found" });
    }

    // Fetch the updated experience
    const [updatedExperience] = await pool.query(
      "SELECT * FROM experience WHERE id = ?",
      [expId]
    );

    res.status(200).json(updatedExperience[0]); // Return the updated experience
  } catch (error) {
    console.error("Error updating employee experience:", error);
    res.status(500).json({ error: "Error updating employee experience" });
  }
});

//delete experience
router.delete("/deleteExperience/:empId/:expId", async (req, res) => {
  const empId = req.params.empId;
  const expId = req.params.expId;

  try {
    const [result] = await pool.query(
      "DELETE FROM experience WHERE empId = ? and id = ?",
      [empId, expId]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Experience deleted successfully." });
    } else {
      res.status(404).json({ message: "Experience not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

//add education
router.post("/education/:empId", async (req, res) => {
  const empId = req.params.empId;
  const { date_from, date_to, institution, degree } = req.body;

  try {
    const newEducation = { empId, date_from, date_to, institution, degree };

    const [results] = await pool.query(
      "INSERT INTO education (empId, date_from, date_to, institution, degree) VALUES (?, ?, ?, ?, ?)",
      [
        newEducation.empId,
        newEducation.date_from,
        newEducation.date_to,
        newEducation.institution,
        newEducation.degree,
      ]
    );

    res.status(201).json({
      message: "Employee education created successfully",
      employeeId: results.insertId,
    });
  } catch (error) {
    console.error("Error saving employee education:", error);
    res.status(500).json({ error: "Error saving employee education" });
  }
});

//get education by id
router.get("/getEducation/:empId", async (req, res) => {
  const employeeId = req.params.empId;

  try {
    const [rows] = await pool.query("SELECT * FROM education WHERE empId = ?", [
      employeeId,
    ]);

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: "Education details not found" });
    }
  } catch (error) {
    console.error("Error fetching education details:", error);
    res.status(500).json({ error: "Error fetching education details" });
  }
});

//update education
router.put("/updateEducation/:empId/:eduId", async (req, res) => {
  const empId = req.params.empId;
  const eduId = req.params.eduId;
  const { date_from, date_to, institution, degree } = req.body;

  try {
    const [results] = await pool.query(
      "UPDATE education SET date_from = ?, date_to = ?, institution = ?, degree = ? WHERE empId = ? AND id = ?",
      [date_from, date_to, institution, degree, empId, eduId]
    );

    if (results.affectedRows === 0) {
      return res.status(404).json({ error: "education not found" });
    }

    // Fetch the updated education
    const [updatedEducation] = await pool.query(
      "SELECT * FROM education WHERE id = ?",
      [eduId]
    );

    res.status(200).json(updatedEducation[0]);
  } catch (error) {
    console.error("Error updating employee education:", error);
    res.status(500).json({ error: "Error updating employee education" });
  }
});

//delete education
router.delete("/deleteEducation/:empId/:eduId", async (req, res) => {
  const empId = req.params.empId;
  const eduId = req.params.eduId;

  try {
    const [result] = await pool.query(
      "DELETE FROM education WHERE empId = ? and id = ?",
      [empId, eduId]
    );

    if (result.affectedRows > 0) {
      res.status(200).json({ message: "Education deleted successfully." });
    } else {
      res.status(404).json({ message: "Education not found." });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error." });
  }
});

//save support details
router.post("/support/:empId", async (req, res) => {
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
      "INSERT INTO support (empId, email, subject, message) VALUES (?, ?, ?, ?)",
      [
        newSupport.empId,
        newSupport.email,
        newSupport.subject,
        newSupport.message,
      ]
    );

    // Respond with the newly created support entry and query result
    res.status(201).json({
      message: "Support entry created successfully",
      support: newSupport,
      supportId: results.insertId,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
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

        // Fetch the user with the given reset code
        const [rows] = await pool.query('SELECT * FROM logindetails WHERE resetcode = ?', [resetCode]);

        // If no user is found with the reset code
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Reset code not found' });
        }

        const user = rows[0];

        // Check if the reset code is expired
        if (new Date(user.resetCodeExpires) < Date.now()) {
            return res.status(400).json({ message: 'Reset code has expired' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password and clear the reset code fields
        await pool.query(
            'UPDATE logindetails SET password = ?, resetcode = NULL, resetcodeexpires = NULL WHERE empId = ?',
            [hashedPassword, user.empId]
        );

        res.status(200).json({ message: 'Password updated successfully' });

    } catch (error) {
        console.error("Error resetting password:", error.message);
        res.status(500).json({ message: 'Internal server error' });
    }
});

//request leave
router.post("/requestLeave/:empId", async (req, res) => {
  const empId = req.params.empId;
  const {
    leave_type,
    date_from,
    date_to,
    time_from,
    time_to,
    description,
    status,
  } = req.body;
  const createdAt = new Date();

  try {
    const newLeave = {
      empId,
      leave_type,
      date_from,
      date_to,
      time_from,
      time_to,
      description,
      status,
      createdAt,
    };

    const [results] = await pool.query(
      "INSERT INTO leave_requests (empId, leave_type, date_from, date_to, time_from, time_to, description, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        newLeave.empId,
        newLeave.leave_type,
        newLeave.date_from,
        newLeave.date_to,
        newLeave.time_from,
        newLeave.time_to,
        newLeave.description,
        newLeave.status,
        newLeave.createdAt,
      ]
    );

    res.status(201).json({
      message: "Employee leave created successfully",
      leaveId: results.insertId,
    });
  } catch (error) {
    console.error("Error saving employee leave:", error);
    res.status(500).json({ error: "Error saving employee leave" });
  }
});

//get leave request by id
router.get("/getLeaveRequest/:empId", async (req, res) => {
  const employeeId = req.params.empId;

  try {
    const [rows] = await pool.query(
      "SELECT * FROM leave_requests WHERE empId = ?",
      [employeeId]
    );

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: "Leave details not found" });
    }
  } catch (error) {
    console.error("Error fetching leave details:", error);
    res.status(500).json({ error: "Error fetching leave details" });
  }
});

//delete leave request
router.delete("/deleteLeave/:empId/:leaveId", async (req, res) => {
  const leaveId = req.params.leaveId;
  const empId = req.params.empId;

  try {
    // Get the leave request's creation time
    const [leave] = await pool.query(
      "SELECT createdAt FROM leave_requests WHERE empId = ? and id = ?",
      [empId, leaveId]
    );

    if (!leave.length) {
      return res.status(404).json({ error: "Leave request not found" });
    }
    await pool.query("DELETE FROM leave_requests WHERE empId = ? AND id = ?", [
      empId,
      leaveId,
    ]);
    res.status(200).json({ message: "Leave request deleted successfully" });
  } catch (error) {
    console.error("Error deleting leave request:", error);
    res.status(500).json({ error: "Error deleting leave request" });
  }
});

//get leave analysis by empId
router.get("/leaveAnalysis/:empId", async (req, res) => {
  const employeeId = req.params.empId;

  try {
    const [rows] = await pool.query(
      `SELECT leave_type, 
                    COUNT(*) AS total_leaves, 
                    SUM(TIMESTAMPDIFF(HOUR, CONCAT(date_from, ' ', time_from), CONCAT(date_to, ' ', time_to))) AS total_hours,
                    SUM(DATEDIFF(date_to, date_from) + 1) AS total_days
             FROM leave_requests 
             WHERE empId = ? 
             GROUP BY leave_type`,
      [employeeId]
    );

    if (rows.length > 0) {
      res.status(200).json(rows);
    } else {
      res.status(404).json({ message: "No leave data found" });
    }
  } catch (error) {
    console.error("Error fetching leave analysis:", error);
    res.status(500).json({ error: "Error fetching leave analysis" });
  }
});

//attendance
router.post("/attendance/:empId", async (req, res) => {
  const empId = req.params.empId;
  const { punch_in_time, punch_out_time, note } = req.body;
  const createdAt = new Date();
  const currentDate = createdAt.toISOString().split("T")[0];

  try {
    const [existingRecord] = await pool.query(
      "SELECT * FROM attendance WHERE empId = ? AND punch_in_date = ?",
      [empId, currentDate]
    );

    if (existingRecord.length > 0) {
      const updatedRecord = await pool.query(
        "UPDATE attendance SET punch_out_time = ?, note = ? WHERE empId = ? AND punch_in_date = ?",
        [punch_out_time, note, empId, currentDate]
      );

      return res.status(200).json({
        message: "Employee attendance updated successfully",
        attendanceId: existingRecord[0].attendanceId,
      });
    } else {
      const newAttendance = {
        empId,
        punch_in_date: currentDate,
        punch_out_date: currentDate,
        punch_in_time,
        punch_out_time,
        note,
        createdAt,
      };
      const [results] = await pool.query(
        "INSERT INTO attendance (empId, punch_in_date, punch_out_date, punch_in_time, punch_out_time, note, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          newAttendance.empId,
          newAttendance.punch_in_date,
          newAttendance.punch_out_date,
          newAttendance.punch_in_time,
          newAttendance.punch_out_time,
          newAttendance.note,
          newAttendance.createdAt,
        ]
      );

      return res.status(201).json({
        message: "Employee attendance created successfully",
        attendanceId: results.insertId,
      });
    }
  } catch (error) {
    console.error("Error saving employee attendance:", error);
    res.status(500).json({ error: "Error saving employee attendance" });
  }
});

// Get attendance records by empId
const moment = require("moment");

router.get("/getAttendance/:empId", async (req, res) => {
  const empId = req.params.empId;

  try {
    // Get all attendance records for the employee
    const [records] = await pool.query(
      "SELECT punch_in_date, punch_in_time, punch_out_time FROM attendance WHERE empId = ?",
      [empId]
    );

    // Calculate worked hours for each record
    const attendanceWithWorkedHours = records.map((record) => {
      if (record.punch_in_time && record.punch_out_time) {
        // Use moment.js to calculate the difference between punch in and punch out times
        const punchIn = moment(record.punch_in_time, "HH:mm:ss");
        const punchOut = moment(record.punch_out_time, "HH:mm:ss");

        // Calculate worked hours as the duration between punch in and punch out times
        const workedHours = moment.duration(punchOut.diff(punchIn)).asHours();

        return {
          ...record,
          worked_hours: workedHours.toFixed(2),
        };
      } else {
        return {
          ...record,
          worked_hours: "N/A",
        };
      }
    });

    res.status(200).json(attendanceWithWorkedHours);
  } catch (error) {
    console.error("Error fetching employee attendance:", error);
    res.status(500).json({ error: "Error fetching employee attendance" });
  }
});

//get attendance analysis by empId
router.get("/attendanceAnalysis/:empId", async (req, res) => {
  const empId = req.params.empId;

  try {
    // Query to get worked hours for the week (grouped by day of the week)
    const weekQuery = `
            SELECT 
                DAYNAME(punch_in_date) AS dayOfWeek, 
                ROUND(SUM(TIMESTAMPDIFF(MINUTE, punch_in_time, punch_out_time)) / 60, 2) AS workedHours
            FROM attendance
            WHERE empId = ? 
            AND WEEK(punch_in_date) = WEEK(CURDATE())
            GROUP BY dayOfWeek;
        `;
    const [weekData] = await pool.query(weekQuery, [empId]);

    // Query to get total hours worked per month
    const monthQuery = `
            SELECT 
                MONTHNAME(punch_in_date) AS month, 
                ROUND(SUM(TIMESTAMPDIFF(MINUTE, punch_in_time, punch_out_time)) / 60, 2) AS workedHours
            FROM attendance
            WHERE empId = ? 
            GROUP BY month
            ORDER BY MONTH(punch_in_date);
        `;
    const [monthData] = await pool.query(monthQuery, [empId]);

    // Sending the response with both week and month data
    return res.status(200).json({
      weekData,
      monthData,
    });
  } catch (error) {
    console.error("Error fetching attendance analysis:", error);
    return res
      .status(500)
      .json({ error: "Error fetching attendance analysis" });
  }
});

//get attendance of current date
router.get("/getCurrentDateAttendance/:empId", async (req, res) => {
  const empId = req.params.empId;

  try {
    const [records] = await pool.query(
      "SELECT punch_in_time, punch_out_time FROM attendance WHERE empId = ? AND punch_in_date = CURDATE()",
      [empId]
    );

    if (records.length > 0) {
      res.status(200).json(records[0]);
    } else {
      res.status(200).json({ punch_in_time: null, punch_out_time: null });
    }
  } catch (error) {
    console.error("Error fetching today's attendance:", error);
    res.status(500).json({ error: "Error fetching today's attendance" });
  }
});

module.exports = router;
