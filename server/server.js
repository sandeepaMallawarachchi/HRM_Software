const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const adminRoutes = require("./routes/adminRoutes");
const cvRoutes = require("./routes/cvRoutes");
const salaryroutes = require("./routes/salaryroutes");
const newsroutes = require("./routes/newsroutes");
const learningAndDevelopmentRoutes = require("./routes/learningAndDevelopmentRoutes");
const medicalClaimRoutes = require("./routes/medicalClaimRoutes");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Use the auth routes
app.use("/auth", authRoutes);

// Use the employee routes
app.use("/employees", employeeRoutes);

// Use the admin routes
app.use("/admin", adminRoutes);

// Use the admin routes
app.use("/cv", cvRoutes);

// Use the news routes
app.use("/news", newsroutes);

// Use the salary routes
app.use("/salary", salaryroutes);

// Use the learning routes
app.use("/learning", learningAndDevelopmentRoutes);

// Use the medical routes
app.use("/medical", medicalClaimRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
