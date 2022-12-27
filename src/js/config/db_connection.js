const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '564793',
    database: 'sup'
});

module.exports = db;