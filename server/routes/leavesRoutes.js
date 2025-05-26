const express = require("express");
const router = express.Router();
const pool = require("../database"); // your configured promise-based pool

// GET all leave requests
router.get("/all", async (req, res) => {
  try {
    const [results] = await pool.query(
      "SELECT * FROM leave_requests ORDER BY createdAt DESC"
    );
    res.json(results);
  } catch (error) {
    console.error("Error fetching leave requests:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// PUT update leave request status
router.put("/update-status/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["Approved", "Rejected", "Pending"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE leave_requests SET status = ? WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Leave request not found" });
    }

    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
