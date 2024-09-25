const connection = require('./database');

connection.query('SELECT 1 + 1 AS solution', (error, results) => {
    if (error) {
        console.error('Error executing query:', error);
        return;
    }
    console.log('The solution is: ', results[0].solution);
});
