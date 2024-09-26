const db = require('../database');

const PersonalDetails = {
    create: (data, callback) => {
        const sql = `INSERT INTO personaldetails (name, email, phone, emergency_contact, address, date_of_birth, gender, country, marital_status, dependents)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql, [data.name, data.email, data.phone, data.emergency_contact, data.address, data.date_of_birth, data.gender, data.country, data.marital_status, data.dependents], (error, results) => {
            if (error) return callback(error);
            callback(null, results);
        });
    },
};

module.exports = PersonalDetails;
