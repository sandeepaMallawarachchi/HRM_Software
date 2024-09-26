const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const employeeRoutes = require('./routes/employeeRoutes');

const app = express();
const port = process.env.PORT || 4000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use the employee routes
app.use('/employees', employeeRoutes);

app.use('/uploads', express.static('uploads'));

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
