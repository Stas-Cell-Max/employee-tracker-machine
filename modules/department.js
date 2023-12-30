const inquirer = require('inquirer');
const db = require('../db/connection.js'); 
 
 // Function to display all departments from the database
 function viewAllDepartments(returnToMainMenu) {
    console.log('Viewing all departments...');

    db.promise().query('SELECT * FROM departments') // Query the database and display results
    .then(([rows]) => {
      console.table(rows);
    })
    .catch(console.log)   //Log any errors
    .then(() => returnToMainMenu());  // Return to main menu after action is complete
} 

// Function to add a new department
function addDepartment(returnToMainMenu) {
    console.log('Adding a new department...');

    inquirer.prompt({   // Prompt user for new department name
    name: 'newDepartment',
    type: 'input',
    message: 'What is the name of the new department?',
    validate: input => input.trim() !== '' ? true : 'This field cannot be empty. Please enter a department name.'
  })
  .then(answer => {  // Insert new department into the database
    db.promise().query('INSERT INTO departments (name) VALUES (?)', [answer.newDepartment])
      .then(() => console.log(`Added ${answer.newDepartment} to the database`))
      .catch(console.log)
      .then(() => returnToMainMenu());
  });
}

//Exporting function to index.js
module.exports = {
    viewAllDepartments,
    addDepartment
};