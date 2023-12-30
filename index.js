// Required packages and files for the application
const inquirer = require('inquirer');
const db = require('./db/connection.js'); 
const mainMenuQuestions = require('./prompts/mainPrompts.js');

// Function to handle user's menu choice
 function handleUserChoice(choice) {

    // Determine the action based on the user's choice
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
    init(); // Re-display the menu if the choice is invalid       
  }
}

 // Function to display all departments from the database
function viewAllDepartments() {
    console.log('Viewing all departments...');

    db.promise().query('SELECT * FROM departments') // Query the database and display results
    .then(([rows]) => {
      console.table(rows);
    })
    .catch(console.log)   //Log any errors
    .then(() => init());  // Return to main menu after action is complete
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

// Function to add a new department
function addDepartment() {
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
      .then(() => init());
  });
}

// Function to add a new role with prompts for role details
function addRole() {
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
        ,
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
            .then(() => init());
    });
}

// Function to add a new employee with prompts for their details
function addEmployee() {
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
            .then(() => init());
    });
}

// Function to update an existing employee's role
function updateEmployeeRole() {
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
          .then(() => init());
      });
}

// Function to exit the application
function exitApplication() {
    console.log('Goodbye!');
    process.exit(); // This will close the application
}

 // Initialize the application
function init() {
    // Display the main menu and handle the user's choice
    inquirer.prompt(mainMenuQuestions).then((answers) => {
        handleUserChoice(answers.action);  // Call handleUserChoice with the user's choice
    });
}

// Start the application
init();