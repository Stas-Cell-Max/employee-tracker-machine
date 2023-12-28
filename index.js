const inquirer = require('inquirer');
const db = require('./db/connection'); // adjust the path as necessary
const mainMenuQuestions = require('./prompts/mainPrompts');

// Define the handleUserChoice function outside of the init function
 function handleUserChoice(choice) {
    switch (choice) {
    case 'View all departments':
        return viewAllDepartments();
    // Add more cases as per need
    case 'View all roles':
        return viewAllRoles();
    case 'View all employees':
        return viewAllEmployees();
    case 'Add a department':
        return addDepartment();
    case 'Add a role':
        return addRole();
    case 'Add an employee':
        return addEmployee();
    case 'Update an employee role':
        return updateEmployeeRole();
    case 'Exit':
        return exitApplication();
    default:
    console.log('Invalid choice!');        
  }
}

 // Define the viewAllDepartments function (as a placeholder for now)
function viewAllDepartments() {
    console.log('Viewing all departments...');
    
    db.promise().query('SELECT * FROM departments')
    .then(([rows]) => {
      console.table(rows);
    })
    .catch(console.log)
    .then(() => init());
}     

function viewAllRoles() {
    console.log('Viewing all roles...');

    db.promise().query('SELECT * FROM roles')
    .then(([rows]) => {
      console.table(rows);
    })
    .catch(console.log)
    .then(() => init());
}

function viewAllEmployees() {
    console.log('Viewing all employees...');

    db.promise().query('SELECT * FROM employees')
    .then(([rows]) => {
      console.table(rows);
    })
    .catch(console.log)
    .then(() => init());
}

function addDepartment() {
    console.log('Adding a new department...');

    inquirer.prompt({
    name: 'newDepartment',
    type: 'input',
    message: 'What is the name of the new department?',
  }).then(answer => {
    db.promise().query('INSERT INTO departments (name) VALUES (?)', [answer.newDepartment])
      .then(() => console.log(`Added ${answer.newDepartment} to the database`))
      .catch(console.log)
      .then(() => init());
  });
}

function addRole() {
    console.log('Adding a new role...');

    inquirer.prompt({
        name: 'newRole',
        type: 'input',
        message: 'What is the name of the new role?',
      }).then(answer => {
        db.promise().query('INSERT INTO roles (name) VALUES (?)', [answer.newRole])
          .then(() => console.log(`Added ${answer.newRole} to the database`))
          .catch(console.log)
          .then(() => init());
      });
}

function addEmployee() {
    console.log('Adding a new employee ...');

    inquirer.prompt({
        name: 'newEmployee',
        type: 'input',
        message: 'What is the name of the new role?',
      }).then(answer => {
        db.promise().query('INSERT INTO employee (name) VALUES (?)', [answer.newEmployee])
          .then(() => console.log(`Added ${answer.newEmployee} to the database`))
          .catch(console.log)
          .then(() => init());
      });
}

function updateEmployeeRole() {
    console.log('Updating an employee role...');
   
    inquirer.prompt({
        name: 'newEmployeeRole',
        type: 'input',
        message: 'What is the name of the employee new role ?',
      }).then(answer => {
        db.promise().query('INSERT INTO employee role (name) VALUES (?)', [answer.newEmployeeRole])
          .then(() => console.log(`Added ${answer.newEmployeeRole} to the database`))
          .catch(console.log)
          .then(() => init());
      });
}

// Define the exitApplication function
function exitApplication() {
    console.log('Goodbye!');
    process.exit(); // This will close the application
}

 // Initialize the application
function init() {
    inquirer.prompt(mainMenuQuestions).then((answers) => {
        // Call handleUserChoice with the user's choice
        handleUserChoice(answers.action);
    });
}

// Start the application
init();