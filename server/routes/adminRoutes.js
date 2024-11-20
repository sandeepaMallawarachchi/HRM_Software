const express = require("express");
const router = express.Router();
const pool = require("../database");
const nodemailer = require("nodemailer");
const { validationResult } = require("express-validator");

//send emails
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// add employee salary
router.post('/addSalary/:empId', async (req, res) => {
    const empId = req.params.empId;
    const { date, total_days_worked, total_hours_worked, earnings, deductions } = req.body;

    try {
        // Calculate total earnings from earnings JSON object
        const total_earnings =
            (parseFloat(earnings.basic || 0) +
                parseFloat(earnings.allowance || 0) +
                parseFloat(earnings.bonus || 0) +
                parseFloat(earnings.overtime || 0)).toFixed(2);

        // Calculate total deductions from deductions JSON object
        const total_deductions =
            (parseFloat(deductions.leave || 0) +
                parseFloat(deductions.loan || 0) +
                parseFloat(deductions.tax || 0)).toFixed(2);

        // Calculate net pay (total earnings - total deductions)
        const net_pay = (total_earnings - total_deductions).toFixed(2);

        // Create the new salary record
        const newSalary = {
            empId,
            date,
            total_days_worked,
            total_hours_worked,
            earnings: JSON.stringify(earnings),
            deductions: JSON.stringify(deductions),
        };

        // Insert the salary record into the database
        const [results] = await pool.query(
            `INSERT INTO salary (empId, date, total_days_worked, total_hours_worked, earnings, deductions)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [newSalary.empId, newSalary.date, newSalary.total_days_worked, newSalary.total_hours_worked, newSalary.earnings, newSalary.deductions]
        );

        // Send success response with calculated fields
        res.status(201).json({
            message: 'Employee salary created successfully',
            salaryId: results.insertId,
            total_earnings,
            total_deductions,
            net_pay
        });

    } catch (error) {
        console.error('Error saving employee salary:', error);
        res.status(500).json({ error: 'Error saving employee salary' });
    }
});

// get payslip by employee ID
router.get('/getPayslip/:empId', async (req, res) => {
    const empId = req.params.empId;

    try {
        // Query the database to get all salary records for the given empId
        const [salaryRecords] = await pool.query(
            'SELECT * FROM salary WHERE empId = ? ORDER BY date DESC', // Fetch all salary records for empId, ordered by date
            [empId]
        );

        // Check if any salary records exist
        if (salaryRecords.length === 0) {
            return res.status(404).json({ message: 'No salary records found for this employee' });
        }

        // Function to calculate total from dynamic fields
        const calculateTotal = (items) => {
            return Object.values(items).reduce((acc, value) => acc + parseFloat(value || 0), 0);
        };

        // Map over all salary records and format the response
        const payslips = salaryRecords.map((salary) => {
            let earnings, deductions;

            // Validate and parse earnings
            if (typeof salary.earnings === 'string') {
                earnings = JSON.parse(salary.earnings);
            } else if (typeof salary.earnings === 'object') {
                earnings = salary.earnings;
            } else {
                console.error('Earnings field is not valid:', salary.earnings);
                earnings = {};
            }

            // Validate and parse deductions
            if (typeof salary.deductions === 'string') {
                deductions = JSON.parse(salary.deductions);
            } else if (typeof salary.deductions === 'object') {
                deductions = salary.deductions;
            } else {
                console.error('Deductions field is not valid:', salary.deductions);
                deductions = {};
            }

            // Calculate total earnings and deductions
            const total_earnings = calculateTotal(earnings).toFixed(2);
            const total_deductions = calculateTotal(deductions).toFixed(2);

            // Calculate net pay (total earnings - total deductions)
            const net_pay = (total_earnings - total_deductions).toFixed(2);

            const formattedDate = new Date(salary.date).toISOString().split('T')[0];

            return {
                empId: salary.empId,
                date: formattedDate,
                total_days_worked: salary.total_days_worked,
                total_hours_worked: salary.total_hours_worked,
                earnings: earnings,
                total_earnings: total_earnings,
                deductions: deductions,
                total_deductions: total_deductions,
                net_pay: net_pay,
                createdAt: salary.createdAt
            };
        });

        // Send the response with all payslips
        res.status(200).json(payslips);

    } catch (error) {
        console.error('Error retrieving payslips:', error);
        res.status(500).json({ error: 'Error retrieving payslips' });
    }
});

// Get all employee details
router.get("/getAllEmployee", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT p.name, l.empId, l.role, w.department, w.designation FROM logindetails l, workdetails w, personaldetails p WHERE l.empId = w.empId AND l.empId = p.empId"
        );

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: "Employee details not found" });
        }
    } catch (error) {
        console.error("Error fetching Employee details:", error);
        res.status(500).json({ error: "Error fetching Employee details" });
    }
});

//add members to chat
router.post("/addMember", async (req, res) => {
    const { members, chatId } = req.body;

    if (!members || members.length === 0) {
        return res.status(400).json({ error: "No members provided" });
    }

    try {
        const chatMemberValues = members.map(empId => [empId, chatId]);

        const [results] = await pool.query(
            "INSERT INTO chatmembers (empId, chatId) VALUES ?",
            [chatMemberValues]
        );

        res.status(201).json({
            message: "Employees added to chat successfully",
            insertedRows: results.affectedRows,
        });
    } catch (error) {
        console.error("Error saving employee chat data:", error);
        res.status(500).json({ error: "Error saving employee chat data" });
    }
});

// Get all chat records for an employee, ordered by latest first
router.get("/getMember/:empId", async (req, res) => {
    const employeeId = req.params.empId;

    try {
        const [rows] = await pool.query(
            "SELECT * FROM chatmembers WHERE empId = ? ORDER BY created_at DESC",
            [employeeId]
        );

        if (rows.length > 0) {
            res.status(200).json(rows); // Return all rows
        } else {
            res.status(404).json({ message: "No chat records found for this employee" });
        }
    } catch (error) {
        console.error("Error fetching chat member details:", error);
        res.status(500).json({ error: "Error fetching chat member details" });
    }
});

//mark as read
router.put("/markAsRead/:empId/:chatId", async (req, res) => {
    const empId = req.params.empId;
    const chatId = req.params.chatId;

    try {
        const [results] = await pool.query(
            "UPDATE chatmembers SET `read` = 'read' WHERE empId = ? AND chatId = ?",
            [empId, chatId]
        );

        if (results.affectedRows > 0) {
            res.status(200).json({
                message: "Marked as read successfully",
                affectedRows: results.affectedRows,
            });
        } else {
            res.status(404).json({
                message: "No messages found for the provided empId",
            });
        }
    } catch (error) {
        console.error("Error updating employee chat data:", error);
        res.status(500).json({ error: "Error updating employee chat data" });
    }
});

//add members to new team
router.post("/createTeam/:empId", async (req, res) => {
    const creator = req.params.empId;
    const { teamName, members } = req.body;

    if (!members || members.length === 0) {
        return res.status(400).json({ error: "No members provided" });
    }

    try {
        await pool.query(
            "INSERT INTO teams (empId, teamName) VALUES (?, ?)",
            [creator, teamName]
        );

        // Insert each member into the teammembers table
        const teamMemberValues = members.map(({ empId, role, department, name }) => [empId, name, teamName, role, department, creator]);

        const [results] = await pool.query(
            "INSERT INTO teammembers (empId, name, teamName, role, department, creator) VALUES ?",
            [teamMemberValues]
        );

        res.status(201).json({
            message: "Team created and members added successfully",
            insertedRows: results.affectedRows,
        });
    } catch (error) {
        console.error("Error saving employee team data:", error);
        res.status(500).json({ error: "Error creating team" });
    }
});

// Get team by creator's empId
router.get("/getTeam/:empId/:filteredTeamName", async (req, res) => {
    const employeeId = req.params.empId;
    const teamName = req.params.filteredTeamName;

    try {
        const [rows] = await pool.query(
            `SELECT t.teamName, tm.empId, tm.name, tm.role, tm.department
             FROM teams t JOIN teammembers tm ON t.empId = tm.creator
             WHERE t.empId = ? AND t.teamName = ?
             ORDER BY t.created_at DESC`,
            [employeeId, teamName]
        );

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: "No team records found for this creator" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error fetching team details" });
    }
});

// Get all teams
router.get("/getAllTeams/:empId", async (req, res) => {
    const employeeId = req.params.empId;

    try {
        const [rows] = await pool.query(
            "SELECT * FROM teams WHERE empId = ?",
            [employeeId]
        );

        if (rows.length > 0) {
            res.status(200).json(rows); 
        } else {
            res.status(404).json({ message: "No team records found" });
        }
    } catch (error) {
        console.error("Error fetching team details:", error);
        res.status(500).json({ error: "Error fetching team details" });
    }
});
module.exports = router;