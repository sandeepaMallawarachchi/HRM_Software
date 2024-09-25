const db = require('../database');

const Employee = {
    create: (data, callback) => {
        const sql = `INSERT INTO employees (username, email, password, phone, address, country, gender, marital_status)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [data.username, data.email, data.password, data.phone, data.address, data.country, data.gender, data.maritalStatus], (error, results) => {
            if (error) return callback(error);
            callback(null, results);
        });
    },
};

module.exports = Employee;
