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

// Function to add a role 
function deleteRole(returnToMainMenu) {
    console.log('Deleting a role...');

    // Fetch Roles
    db.promise().query('SELECT id, title FROM roles')
    .then(([roles]) => {
        // Prompt to Select a Role to Delete
        return inquirer.prompt([
            {
                name: 'roleId',
                type: 'list',
                choices: roles.map(role => ({ name: role.title, value: role.id })),
                message: 'Select a role to delete:',
            }
        ])
        .then(answer => {
            const roleId = answer.roleId;
            // Delete the Selected Role
            return db.promise().query('DELETE FROM roles WHERE id = ?', [roleId])
            .then(() => {
                console.log(`Role deleted successfully.`);
            });
        });
    })
    .catch(console.log)
    .then(() => returnToMainMenu());
}




//Exporting function to index.js
module.exports = {
    viewAllRoles,
    addRole,
    deleteRole
};