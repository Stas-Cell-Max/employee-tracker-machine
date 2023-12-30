const inquirer = require('inquirer');
const db = require('../db/connection.js'); 

// Function to display all Employees from the database
function viewAllEmployees(returnToMainMenu) {
    console.log('Viewing all employees...');

    db.promise().query('SELECT * FROM employees')
    .then(([rows]) => {
      console.table(rows);
    })
    .catch(console.log)
    .then(() => returnToMainMenu());
}

// Function to add a new employee with prompts for their details
function addEmployee(returnToMainMenu) {
    console.log('Adding a new employee ...');

    inquirer.prompt([
        {
            name: 'firstName',
            type: 'input',
            message: 'What is the employee\'s first name?',
        },
        {
            name: 'lastName',
            type: 'input',
            message: 'What is the employee\'s last name?',
        },
        {
            name: 'roleId',
            type: 'number',
            message: 'What is the employee\'s role ID?',
        },
        {
            name: 'managerId',
            type: 'number',
            message: 'What is the employee\'s manager\'s ID (Enter 0 if no manager)?',
            default: 0, // Assumes that 0 is used for employees without a manager
      validate: input => {
        if(input.trim() === '0') return true; // Allow '0' as a special case
        const parsed = parseInt(input);
        return !isNaN(parsed) && parsed > 0 ? true : 'Please enter a valid ID (a positive integer) or 0 for no manager.';
      } 
    }
    ])
    .then(answers => {
        const { firstName, lastName, roleId, managerId } = answers;
        const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
        const managerValue = managerId === 0 ? null : managerId; // Converts 0 to NULL for no manager
        db.promise().query(query, [firstName, lastName, roleId, managerValue])
            .then(() => console.log(`Added ${firstName} ${lastName} to the database`))
            .catch(console.log)
            .then(() => returnToMainMenu());
    });
}

// Function to update an existing employee's role
function updateEmployeeRole(returnToMainMenu) {
    console.log('Updating an employee role...');
   
    inquirer.prompt([
        {
            name: 'employeeId',
            type: 'number',
            message: 'Enter the ID of the employee to update:',
        },
        {
            name: 'newRoleId',
            type: 'number',
            message: 'Enter the new role ID:',
        }
      ])
      .then(answer => {
        const { newRoleId, employeeId } = answer;
        db.promise().query('UPDATE employees SET role_id = ? WHERE id = ?', [newRoleId, employeeId])
          .then(() => console.log(`Updated employee's role in the database`))
          .catch(console.log)
          .then(() => returnToMainMenu());
      });
}

//Exporting function to index.js
module.exports = {
    viewAllEmployees,
    addEmployee,
    updateEmployeeRole
};