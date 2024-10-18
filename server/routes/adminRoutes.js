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

//add payroll
router.post('/payroll/:empId', async (req, res) => {
    const empId = req.params.empId;
    const { month, basic, totalDaysWorked, bonus, ot, grossPay } = req.body;

    try {
        const newPayment = { empId, month, basic, totalDaysWorked, bonus, ot, grossPay };

        const [results] = await pool.query(
            'INSERT INTO payment (empId, month, basic, totalDaysWorked, bonus, ot, grossPay) VALUES (?, ?, ?, ?, ?, ?)',
            [newPayment.empId, newPayment.month, newPayment.basic, newPayment.totalDaysWorked, newPayment.bonus, newPayment.ot, newPayment.grossPay]
        );

        res.status(201).json({ message: 'Employee payment created successfully', employeeId: results.insertId });
    } catch (error) {
        console.error('Error saving employee payment:', error);
        res.status(500).json({ error: 'Error saving employee payment' });
    }
});

//get payroll by id
router.get('/getPayroll/:empId', async (req, res) => {
    const employeeId = req.params.empId;

    try {
        const [rows] = await pool.query('SELECT * FROM payment WHERE empId = ?', [employeeId]);

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: 'Education details not found' });
        }
    } catch (error) {
        console.error('Error fetching education details:', error);
        res.status(500).json({ error: 'Error fetching education details' });
    }
});

module.exports = router;