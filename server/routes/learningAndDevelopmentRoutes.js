const express = require("express");
const router = express.Router();
const pool = require("../database");

//add skill
router.post("/addSkill/:empId", async (req, res) => {
    const empId = req.params.empId;
    const { skill, level } = req.body;

    try {
        await pool.query(
            "INSERT INTO skills (empId, skill, level) VALUES (?, ?, ?)",
            [empId, skill, level]
        );

        res.status(201).json({ message: "Skill added successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error adding skill" });
        console.error("Error adding skill:", error);
    }
});

//get skill
router.get("/getSkill/:empId", async (req, res) => {
    const { empId } = req.params;

    try {
        const [rows] = await pool.query(`
              SELECT * 
              FROM skills
              WHERE empId = ? 
          `, [empId]);
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching skills:", error);
        res.status(500).json({ error: "Error fetching skills" });
    }
});

//update skill level
router.put("/updateSkill/:id/:level", async (req, res) => {
    const { id, level } = req.params;

    try {
        const [result] = await pool.query(
            "UPDATE skills SET level = ? WHERE id = ?",
            [level, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "No matching record found to update" });
        }

        res.status(200).json({ message: "Skill level updated successfully" });
    } catch (error) {
        console.error("Error updating skill level:", error);
        res.status(500).json({ error: "Error updating skill level" });
    }
});

module.exports = router;