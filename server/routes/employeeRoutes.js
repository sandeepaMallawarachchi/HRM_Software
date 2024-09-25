const express = require('express');
const router = express.Router();
const pool = require('../database'); // Adjust the path as needed
const bcrypt = require('bcrypt');

router.post('/register', async (req, res) => {
    const { username, email, password, phone, address, country, gender, maritalStatus } = req.body;

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
        const [results] = await pool.query('INSERT INTO employees (username, email, password, phone, address, country, gender, marital_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
        [newEmployee.username, newEmployee.email, newEmployee.password, newEmployee.phone, newEmployee.address, newEmployee.country, newEmployee.gender, newEmployee.maritalStatus]);
        
        res.status(201).json({ message: 'Employee registered successfully', employeeId: results.insertId });
    } catch (error) {
        console.error('Error saving employee data:', error);
        res.status(500).json({ error: 'Error saving employee data' });
    }
});

router.get('/getEmployee/:id', async (req, res) => {
    const employeeId = req.params.id;

    try {
        const [rows] = await pool.query('SELECT * FROM employees WHERE id = ?', [employeeId]);
        
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

module.exports = router;
