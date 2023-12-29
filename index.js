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
    ]).then(answers => {
        const { title, salary, departmentId } = answers;
        db.promise().query('INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)', [title, salary, departmentId])
            .then(() => console.log(`Added ${title} with salary ${salary} to department ${departmentId} in the database`))
            .catch(console.log)
            .then(() => init());
    });


}

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
      }  
    ])..then(answers => {
        const { firstName, lastName, roleId, managerId } = answers;
        const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)';
        const managerValue = managerId === 0 ? null : managerId; // Converts 0 to NULL for no manager
        db.promise().query(query, [firstName, lastName, roleId, managerValue])
            .then(() => console.log(`Added ${firstName} ${lastName} to the database`))
            .catch(console.log)
            .then(() => init());
    });

}

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

      ]).then(answer => {
        const { newRoleId, employeeId } = answer;
        db.promise().query('UPDATE employees SET role_id = ? WHERE id = ?', [newRoleId, employeeId])
          .then(() => console.log(`Updated employee's role in the database`))
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