const express = require("express");
const router = express.Router();
const pool = require("../database");

router.post("/salaries", async (req, res) => {
  const { department, designation, basic_salary } = req.body;

  if (!department || !designation || !basic_salary) {
    return res.status(400).send({ error: "All fields are required." });
  }

  try {
    const query = `
      INSERT INTO salary_details (department, designation, basic_salary) 
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE basic_salary = VALUES(basic_salary)`;

    const [results] = await pool.query(query, [
      department,
      designation,
      basic_salary,
    ]);

    res.status(201).send({
      id: results.insertId,
      department,
      designation,
      basic_salary,
    });
  } catch (err) {
    console.error("Error inserting salary record:", err);
    res.status(500).send({ error: "Database error." });
  }
});

// Get all salary records
router.get("/salaries", async (req, res) => {
  try {
    const query = "SELECT * FROM salary_details";
    const [results] = await pool.query(query);
    res.status(200).send(results);
  } catch (err) {
    console.error("Error fetching salary records:", err);
    res.status(500).send({ error: "Database error." });
  }
});

// Get a salary record by ID
router.get("/salaries/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const query = "SELECT * FROM salary_details WHERE id = ?";
    const [results] = await pool.query(query, [id]);

    if (results.length === 0) {
      return res.status(404).send({ error: "Record not found." });
    }
    res.status(200).send(results[0]);
  } catch (err) {
    console.error("Error fetching salary record:", err);
    res.status(500).send({ error: "Database error." });
  }
});

// Update a salary record by ID
router.put("/salaries/:id", async (req, res) => {
  const { id } = req.params;
  const { department, designation, basic_salary } = req.body;

  if (!department || !designation || !basic_salary) {
    return res.status(400).send({ error: "All fields are required." });
  }

  try {
    const query =
      "UPDATE salary_details SET department = ?, designation = ?, basic_salary = ? WHERE id = ?";
    const [results] = await pool.query(query, [
      department,
      designation,
      basic_salary,
      id,
    ]);

    if (results.affectedRows === 0) {
      return res.status(404).send({ error: "Record not found." });
    }
    res.status(200).send({ id, department, designation, basic_salary });
  } catch (err) {
    console.error("Error updating salary record:", err);
    res.status(500).send({ error: "Database error." });
  }
});

// Delete a salary record by ID
router.delete("/salaries/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const query = "DELETE FROM salary_details WHERE id = ?";
    const [results] = await pool.query(query, [id]);

    if (results.affectedRows === 0) {
      return res.status(404).send({ error: "Record not found." });
    }
    res.status(200).send({ message: `Record with ID ${id} deleted.` });
  } catch (err) {
    console.error("Error deleting salary record:", err);
    res.status(500).send({ error: "Database error." });
  }
});

module.exports = router;
