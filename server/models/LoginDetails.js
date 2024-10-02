const db = require("../database");

const LoginDetails = {
  create: (data, callback) => {
    const sql = `INSERT INTO logindetails (email, password) VALUES (?, ?)`;
    db.query(sql, [data.email, data.password], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
    });
  },

  // Find employee by email
  findByEmail: (email, callback) => {
    const sql = `SELECT * FROM logindetails WHERE email = ?`;
    db.query(sql, [email], (error, results) => {
      if (error) return callback(error);
      callback(null, results); // results will contain the employee(s) found
    });
  },
};

module.exports = LoginDetails;
