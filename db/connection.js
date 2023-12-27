const mysql = require('mysql2');

// Create the connection to the database
const connection = mysql.createConnection({
  host: 'localhost', 
  user: 'root', 
  password: 'BootCamp2023', 
  database: 'employee_tracker_machine' 
});

connection.connect(function(err) {
  if (err) throw err;
  console.log('Connected to the MySQL server.');
});

module.exports = connection;