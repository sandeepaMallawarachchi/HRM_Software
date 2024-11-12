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

module.exports = router;