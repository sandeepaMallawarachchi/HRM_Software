const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const employeeRoutes = require("./routes/employeeRoutes"); // Adjust the path as necessary

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Use the employee routes
app.use("/employee", employeeRoutes); // Now POST requests can be made to /employee/login

<<<<<<< HEAD
// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
=======
app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
>>>>>>> developer
});
