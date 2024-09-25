const db = require("../database");

const LoginDetails = {
  create: (data, callback) => {
    const sql = `INSERT INTO logindetails (email, password)
                     VALUES (?, ?)`;
    db.query(sql, [data.email, data.password], (error, results) => {
      if (error) return callback(error);
      callback(null, results);
    });
  },
};

module.exports = LoginDetails;
