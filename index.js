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
    // This is where you'll add the code to interact with your database
    console.log('Viewing all departments...');
    // After completing the action, show the main menu again
    init();
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