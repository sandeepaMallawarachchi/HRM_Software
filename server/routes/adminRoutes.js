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
        // Query the database to get the employee's salary record by empId
        const [salaryRecord] = await pool.query(
            'SELECT * FROM salary WHERE empId = ? ORDER BY date DESC LIMIT 1', // Fetch the most recent salary record
            [empId]
        );

        // Check if salary record exists
        if (salaryRecord.length === 0) {
            return res.status(404).json({ message: 'No salary record found for this employee' });
        }

        // Extract the salary record
        const salary = salaryRecord[0];

        // Validate and parse earnings
        let earnings;
        if (typeof salary.earnings === 'string') {
            earnings = JSON.parse(salary.earnings);
        } else if (typeof salary.earnings === 'object') {
            earnings = salary.earnings; // already an object
        } else {
            console.error('Earnings field is not valid:', salary.earnings);
            return res.status(500).json({ error: 'Invalid earnings data format' });
        }

        // Validate and parse deductions
        let deductions;
        if (typeof salary.deductions === 'string') {
            deductions = JSON.parse(salary.deductions);
        } else if (typeof salary.deductions === 'object') {
            deductions = salary.deductions; // already an object
        } else {
            console.error('Deductions field is not valid:', salary.deductions);
            return res.status(500).json({ error: 'Invalid deductions data format' });
        }

        // Function to calculate total from dynamic fields
        const calculateTotal = (items) => {
            return Object.values(items).reduce((acc, value) => acc + parseFloat(value || 0), 0);
        };

        // Calculate total earnings dynamically
        const total_earnings = calculateTotal(earnings).toFixed(2);

        // Calculate total deductions dynamically
        const total_deductions = calculateTotal(deductions).toFixed(2);

        // Calculate net pay (total earnings - total deductions)
        const net_pay = (total_earnings - total_deductions).toFixed(2);

        const formattedDate = new Date(salary.date).toISOString().split('T')[0];


        // Send the response with all details
        res.status(200).json({
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
        });

    } catch (error) {
        console.error('Error retrieving payslip:', error);
        res.status(500).json({ error: 'Error retrieving payslip' });
    }
});

module.exports = router;