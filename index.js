// Required packages and files for the application
const inquirer = require('inquirer');
const db = require('./db/connection.js'); 
const mainMenuQuestions = require('./prompts/mainPrompts.js');

// Imported functions from modules
const { viewAllDepartments, addDepartment,  deleteDepartment } = require('./modules/department.js');
const { viewAllRoles, addRole, deleteRole } = require('./modules/role.js');
const { viewAllEmployees, viewEmployeesByManager,viewEmployeesByDepartment, addEmployee, updateEmployeeRole, updateEmployeeManager, deleteEmployee  } = require('./modules/employee.js');

// Function to handle user's menu choice
 function handleUserChoice(choice) {

    // Determine the action based on the user's choice
    switch (choice) {  
    case 'View all departments':
        return viewAllDepartments(init);
    // Add more cases as per need
    case 'View all roles':
        return viewAllRoles(init);
    case 'View all employees':
        return viewAllEmployees(init);
    case 'View employees by manager':
        return viewEmployeesByManager(init);  
    case 'View employees by department':
        return viewEmployeesByDepartment(init); 
    case 'Add an employee':
        return addEmployee(init);
    case 'Update an employee role':
        return updateEmployeeRole(init);
    case 'Update employee manager':
        return updateEmployeeManager(init);  
    case 'Delete an employee':
        return deleteEmployee(init);    
    case 'Add a department':   
        return addDepartment(init);
    case 'Delete a department':
        return deleteDepartment(init);    
    case 'Add a role':
        return addRole(init);
    case 'Delete a role':
            return deleteRole(init);   
    case 'Exit':
        return exitApplication(init);
    default:
    console.log('Invalid choice!'); 
    init(); // Re-display the menu if the choice is invalid       
  }
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