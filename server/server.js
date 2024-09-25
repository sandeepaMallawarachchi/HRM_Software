const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const login = require("./routes/employeeRoutes");

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the employee routes

app.use("/login", login);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
