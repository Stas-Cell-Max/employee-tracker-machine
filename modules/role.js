const inquirer = require('inquirer');
const db = require('../db/connection.js');

// Function to display all the roles
function viewAllRoles(returnToMainMenu) {
    console.log('Viewing all roles...');

    db.promise().query('SELECT * FROM roles')
    .then(([rows]) => {
      console.table(rows);
    })
    .catch(console.log)
    .then(() => returnToMainMenu());
}

// Function to add a new role with prompts for role details
function addRole(returnToMainMenu) {
    console.log('Adding a new role...');

    inquirer.prompt([
        {
            name: 'title',
            type: 'input',
            message: 'What is the title of the new role?',
        },
        {
            name: 'salary',
            type: 'number',
            message: 'What is the salary for this role?',
        },
        {
            name: 'departmentId',
            type: 'number',
            message: 'What is the department ID for this role?',
        }   
    ])
    .then(answers => {
        const { title, salary, departmentId } = answers;
        db.promise().query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId])
            .then(() => console.log(`Added ${title} with salary ${salary} to department ${departmentId} in the database`))
            .catch(console.log)
            .then(() => returnToMainMenu());
    });
}

//Exporting function to index.js
module.exports = {
    viewAllRoles,
    addRole
};