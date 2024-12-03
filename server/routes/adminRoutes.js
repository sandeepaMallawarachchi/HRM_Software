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

// Get all chat members
router.get("/getAllMembers/:chatId", async (req, res) => {
    const chatId = req.params.chatId;

    try {
        const [rows] = await pool.query(
            "SELECT p.name, c.empId, c.chatId FROM chatmembers c JOIN personaldetails p ON c.empId = p.empId WHERE c.chatId = ?",
            [chatId]
        );

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: "No chat records found for this chat id" });
        }
    } catch (error) {
        console.error("Error fetching chat members:", error);
        res.status(500).json({ error: "Error fetching chat members" });
    }
});

//delete chat
router.delete("/deleteChat/:chatId", async (req, res) => {
    const chatId = req.params.chatId;

    try {
        const [result] = await pool.query(
            "DELETE FROM chatmembers WHERE chatId = ?",
            [chatId]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Chat deleted successfully." });
        } else {
            res.status(404).json({ message: "Chat not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error." });
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
        if (error.code === "ER_DUP_ENTRY") {
            res.status(409).json({ error: "Team name already taken. Please choose a different name." });
        } else {
            console.error("Error saving employee team data:", error);
            res.status(500).json({ error: "Error creating team" });
        }
    }
});

// Get team by creator's empId
router.get("/getTeam/:empId/:filteredTeamName", async (req, res) => {
    const employeeId = req.params.empId;
    const teamName = req.params.filteredTeamName;

    try {
        const [rows] = await pool.query(
            `SELECT t.teamName, tm.empId, tm.name, tm.role, tm.department, tm.performance, tm.taskcompleted
             FROM teams t 
             JOIN teammembers tm 
             ON t.empId = tm.creator AND t.teamName = tm.teamName
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

//update team
router.post("/updateTeam/:empId", async (req, res) => {
    const creatorEmpId = req.params.empId;
    const { teamName, members } = req.body;

    if (!members || members.length === 0) {
        return res.status(400).json({ error: "No members provided" });
    }

    try {

        // Update teammembers table
        const teamMemberValues = members.map(({ empId, role, department, name }) => [empId, name, teamName, role, department, creatorEmpId]);

        const [results] = await pool.query(
            "INSERT INTO teammembers (empId, name, teamName, role, department, creator) VALUES ?",
            [teamMemberValues]
        );

        res.status(201).json({
            message: "Team created and members added successfully",
            insertedRows: results.affectedRows,
        });
    } catch (error) {
        if (error.code === "ER_DUP_ENTRY") {
            res.status(409).json({ error: "Team name already taken. Please choose a different name." });
        } else {
            console.error("Error saving employee team data:", error);
            res.status(500).json({ error: "Error creating team" });
        }
    }
});

//delete member from team
router.delete("/deleteTeamMember/:empId/:teamName", async (req, res) => {
    const empId = req.params.empId;
    const teamName = req.params.teamName;

    try {
        const [result] = await pool.query(
            "DELETE FROM teammembers WHERE empId = ? and teamName = ?",
            [empId, teamName]
        );

        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Team member deleted successfully." });
        } else {
            res.status(404).json({ message: "Team member not found." });
        }
    } catch (error) {
        res.status(500).json({ message: "Server error." });
    }
});

//add employee's performance
router.post("/addPerformance/:empId/:teamName", async (req, res) => {
    const { empId, teamName } = req.params;
    const { performance, taskcompleted } = req.body;

    try {
        await pool.query(
            "UPDATE teammembers SET performance = ?, taskcompleted = ?, updated_at = NOW() WHERE empId = ? AND teamName = ?",
            [performance, taskcompleted, empId, teamName]
        );
        res.status(200).json({ message: "Performance updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error updating performance" });
    }
});

// Get all strategic plans by id
router.get("/getPlans/:empId", async (req, res) => {
    const employeeId = req.params.empId;

    try {
        const [rows] = await pool.query(
            "SELECT * FROM strategicplans WHERE empId = ?",
            [employeeId]
        );

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: "No strategic plan records found" });
        }
    } catch (error) {
        console.error("Error fetching strategic plan details:", error);
        res.status(500).json({ error: "Error fetching strategic plan details" });
    }
});

//create strategic plan
router.post("/addStrategicPlan/:empId", async (req, res) => {
    const empId = req.params.empId;
    const { goal, description, deadline, progress } = req.body;

    try {
        await pool.query(
            "INSERT INTO strategicplans (empId, goal, description, deadline, progress) VALUES (?, ?, ?, ?, ?)",
            [empId, goal, description, deadline, progress]
        );
        res.status(201).json({ message: "Strategic plan added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error adding startegic plan" });
    }
});

// Get all strategic plans by id
router.get("/getPlans/:empId", async (req, res) => {
    const employeeId = req.params.empId;

    try {
        const [rows] = await pool.query(
            "SELECT * FROM strategicplans WHERE empId = ?",
            [employeeId]
        );

        if (rows.length > 0) {
            res.status(200).json(rows);
        } else {
            res.status(404).json({ message: "No strategic plan records found" });
        }
    } catch (error) {
        console.error("Error fetching strategic plan details:", error);
        res.status(500).json({ error: "Error fetching strategic plan details" });
    }
});

//get employee count by department
router.get("/getEmployeeStats/:department", async (req, res) => {
    const department = req.params.department;

    try {
        const [rows] = await pool.query(
            `SELECT COUNT(DISTINCT empId) AS employeeCount
             FROM teammembers 
             WHERE department = ?`,
            [department]
        );

        const [topPerformerRow] = await pool.query(
            `SELECT name, FORMAT(AVG(performance), 2) AS avgPerformance 
             FROM teammembers 
             WHERE department = ? 
             GROUP BY empId 
             ORDER BY avgPerformance DESC 
             LIMIT 1`,
            [department]
        );

        const [monthlyAvgPerformanceRows] = await pool.query(
            `SELECT DATE_FORMAT(created_at, '%Y-%m') AS month, 
                    FORMAT(AVG(performance), 2) AS avgPerformance 
             FROM teammembers 
             WHERE department = ? 
             GROUP BY month
             ORDER BY month DESC`,
            [department]
        );

        const [employeePerformanceRows] = await pool.query(
            `SELECT name, performance
             FROM teammembers
             WHERE department = ?`,
            [department]
        );

        const employeeCount = rows[0]?.employeeCount || 0;
        const topPerformer = topPerformerRow[0] || null;
        const monthlyAvgPerformance = monthlyAvgPerformanceRows || [];
        const employeePerformance = employeePerformanceRows || [];

        res.status(200).json({
            employeeCount,
            topPerformer,
            monthlyAvgPerformance,
            employeePerformance,
        });
    } catch (error) {
        console.error("Error fetching employee stats:", error);
        res.status(500).json({ error: "Error fetching employee stats" });
    }
});

//get all departments
router.get("/getAllDepartments", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT DISTINCT department 
            FROM workdetails 
            WHERE department IS NOT NULL AND department != ''
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching departments:", error);
        res.status(500).json({ error: "Error fetching departments" });
    }
});

//allocate budget for departments
router.post("/allocateBudget/:department", async (req, res) => {
    const department = req.params.department;
    const { date, budget } = req.body;

    try {
        await pool.query(
            "INSERT INTO budgets (department, date, budget) VALUES (?, ?, ?)",
            [department, date, budget]
        );
        res.status(201).json({ message: "Budget added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error adding budget" });
    }
});

//get allocated budgets by year and month
router.get("/getAllocatedBudget/:department/:year/:month", async (req, res) => {
    const { department, year, month } = req.params;

    try {
        const [rows] = await pool.query(
            `
            SELECT * 
            FROM budgets 
            WHERE department = ? AND DATE_FORMAT(date, '%Y-%m') = ?`,
            [department, `${year}-${month}`]
        );
        res.status(200).json(rows[0]);
    } catch (error) {
        console.error("Error fetching budget:", error);
        res.status(500).json({ error: "Error fetching budget" });
    }
});

//get spent budget
router.get("/getSpentBudget/:department/:year/:month", async (req, res) => {
    const { department, year, month } = req.params;

    try {

        const [totals] = await pool.query(
            `SELECT 
                SUM(\`operational costs\`) AS "OperationalCosts",
                SUM(marketing) AS Marketing,
                SUM(\`research & development\`) AS "ResearchDevelopment",
                SUM(miscellaneous) AS Miscellaneous,
                SUM(\`operational costs\` + marketing + \`research & development\` + miscellaneous) AS Total
            FROM expenses_data
            WHERE department = ? AND DATE_FORMAT(date, '%Y-%m') = ?`,
            [department, `${year}-${month}`]
        );
        res.status(200).json(totals[0]);

    } catch (error) {
        res.status(500).json({ error: "Error retrieving expenses data" });
    }
});

//get team and average performance
router.get("/getTeamAndPerformance", async (req, res) => {
    try {
        const [teamsWithPerformance] = await pool.query(
            `SELECT 
                t.teamName, 
                t.creator AS creatorEmpId,
                p.NAME AS creatorName, 
                FORMAT(AVG(t.performance), 2) AS avgPerformance
            FROM teammembers t
            JOIN personaldetails p ON p.empId = t.creator
            GROUP BY t.teamName, p.NAME`
        );

        res.status(200).json(teamsWithPerformance);
    } catch (error) {
        console.error("Error fetching team and performance:", error);
        res.status(500).json({ error: "Error fetching team and performance" });
    }
});

//add new resourse
router.post("/addNewResource", async (req, res) => {
    const { resource, type, quantity } = req.body;

    try {
        await pool.query(
            "INSERT INTO resource (resource, type, quantity) VALUES (?, ?, ?)",
            [resource, type, quantity]
        );
        res.status(201).json({ message: "resource added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error adding resource" });
    }
});

//get all resources
router.get("/getAllResources", async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT * 
            FROM resource 
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching resources:", error);
        res.status(500).json({ error: "Error fetching resources" });
    }
});

//update resource
router.put("/updateResource/:id/:quantity", async (req, res) => {
    const { id, quantity } = req.params;
    try {
        await pool.query(`
            UPDATE resource
            SET quantity = ? 
            WHERE id = ?
        `, [quantity, id]);
        res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        console.error("Error updating resources:", error);
        res.status(500).json({ error: "Error updating resources" });
    }
});

//allocate resource to employee
router.post("/allocateResource/:empId", async (req, res) => {
    const empId = req.params.empId;
    const { id, resource, quantity, allocatedate, returneddate } = req.body;

    try {
        await pool.query(
            "INSERT INTO allocatedresources (empId, resource, quantity, allocatedate, returneddate) VALUES (?, ?, ?, ?, ?)",
            [empId, resource, quantity, allocatedate, returneddate]
        );

        const [currentQuantityResult] = await pool.query(
            "select quantity from resource where id = ?",
            [id]
        );

        const currentQuantity = currentQuantityResult[0].quantity;

        if (currentQuantity < quantity) {
            return res.status(400).json({ error: "Not enough resource available" });
        }

        const newQuantity = currentQuantity - quantity;

        await pool.query(`
            UPDATE resource
            SET quantity = ? 
            WHERE id = ?
        `, [newQuantity, id]);

        res.status(201).json({ message: "Resource allocated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error allocating resource" });
        console.error("Error allocating resource:", error);
    }
});

//get allocated resources by empId
router.get("/getAllocatedResources/:empId", async (req, res) => {
    const { empId } = req.params;

    try {
        const [rows] = await pool.query(`
            SELECT * 
            FROM allocatedresources
            WHERE empId = ? 
        `, [empId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching allocated resources:", error);
        res.status(500).json({ error: "Error fetching allocated resources" });
    }
});

//get all allocated resources
router.get("/getAllAllocatedResources", async (req, res) => {

    try {
        const [rows] = await pool.query(`
            SELECT a.empId, p.NAME, a.resource, a.quantity, a.allocatedate, a.returneddate, a.status
            FROM allocatedresources a JOIN personaldetails p ON a.empId = p.empId
            ORDER By a.created_at DESC
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching allocated resources:", error);
        res.status(500).json({ error: "Error fetching allocated resources" });
    }
});

//update quantity after returned
router.put("/updateQuantity/:resource/:quantity/:empId", async (req, res) => {
    const { resource, empId } = req.params;
    const quantity = parseInt(req.params.quantity, 10);

    try {

        const [currentQuantityResult] = await pool.query(
            "select quantity from resource where resource = ?",
            [resource]
        );

        const currentQuantity = currentQuantityResult[0].quantity;

        const newQuantity = currentQuantity + quantity;

        await pool.query(`
            UPDATE resource
            SET quantity = ? 
            WHERE resource = ?
        `, [newQuantity, resource]);

        await pool.query(`
            UPDATE allocatedresources
            SET status = "Returned" 
            WHERE resource = ? AND empId = ?
        `, [resource, empId]);

        res.status(200).json({ message: "Updated successfully" });
    } catch (error) {
        console.error("Error updating resources:", error);
        res.status(500).json({ error: "Error updating resources" });
    }
});

module.exports = router;