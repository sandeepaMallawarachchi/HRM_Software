const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const employeeRoutes = require("./routes/employeeRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Use the employee routes
app.use("/employees", employeeRoutes);

// Use the admin routes
app.use("/admin", adminRoutes);

// Serve static files from the uploads directory
app.use("/uploads", express.static("uploads"));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
