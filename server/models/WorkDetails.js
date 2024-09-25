const db = require('../database');

const WorkDetails = {
    create: (data, callback) => {
        const sql = `INSERT INTO workdetails (workEmail, workPhone, department, location, designation, supervisor)
                     VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(sql, [data.workEmail, data.workPhone, data.department, data.location, data.designation, data.supervisor], (error, results) => {
            if (error) return callback(error);
            callback(null, results);
        });
    },
};

module.exports = WorkDetails;
