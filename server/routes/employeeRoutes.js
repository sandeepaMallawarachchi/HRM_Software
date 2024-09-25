const express = require('express');
const router = express.Router();
const pool = require('../database'); // Adjust the path as needed
const bcrypt = require('bcrypt');

//create login credentials
router.post('/loginCredentials', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Hash the password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const newEmployeeLogin = {
            username,
            email,
            password: hashedPassword,
        };

        // Use connection pool to insert the new employee
        const [results] = await pool.query('INSERT INTO logindetails (username, email, password) VALUES (?, ?, ?)',
            [newEmployeeLogin.username, newEmployeeLogin.email, newEmployeeLogin.password]);

        res.status(201).json({ message: 'Employee Login Details Created successfully', employeeId: results.insertId });
    } catch (error) {
        console.error('Error saving employee login data:', error);
        res.status(500).json({ error: 'Error saving employee login data' });
    }
});

//create work details
router.post('/workDetails', async (req, res) => {
    const { workEmail, workPhone, department, location, designation, supervisor } = req.body;

    try {
        const newWorkDetails = {
            workEmail,
            workPhone,
            department,
            location,
            designation,
            supervisor,
        };

        // Use connection pool to insert the new employee
        const [results] = await pool.query('INSERT INTO workdetails (workEmail, workPhone, department, location, designation, supervisor) VALUES (?, ?, ?, ?, ?, ?)',
            [newWorkDetails.workEmail, newWorkDetails.workPhone, newWorkDetails.department, newWorkDetails.location, newWorkDetails.designation, newWorkDetails.supervisor]);

        res.status(201).json({ message: 'Employee Work Details Created successfully', employeeId: results.insertId });
    } catch (error) {
        console.error('Error saving employee work data:', error);
        res.status(500).json({ error: 'Error saving employee work data' });
    }
});

//get employee by id
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
