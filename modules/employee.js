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

// Function to display an employees by manager
function viewEmployeesByManager(returnToMainMenu) {
    console.log('Viewing employees by manager...');

    // Fetch Managers
    db.promise().query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees WHERE manager_id IS NULL')
    .then(([managers]) => {
        // Prompt to Select a Manager
        return inquirer.prompt([
            {
                name: 'managerId',
                type: 'list',
                choices: managers.map(mgr => ({ name: mgr.name, value: mgr.id })),
                message: 'Select a manager to view their employees:',
            }
        ])
        .then(answer => {
            const managerId = answer.managerId;
            // Fetch and Display Employees for the Selected Manager
            return db.promise().query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees WHERE manager_id = ?', [managerId])
            .then(([employees]) => {
                console.table(employees);
            });
        });
    })
    .catch(console.log)
    .then(() => returnToMainMenu());
}

//Function to display employees by department
function viewEmployeesByDepartment(returnToMainMenu) {
    console.log('Viewing employees by department...');

    // Fetch Departments
    db.promise().query('SELECT id, name FROM departments')
    .then(([departments]) => {
        // Prompt to Select a Department
        return inquirer.prompt([
            {
                name: 'departmentId',
                type: 'list',
                choices: departments.map(dept => ({ name: dept.name, value: dept.id })),
                message: 'Select a department to view its employees:',
            }
        ])
        .then(answer => {
            const departmentId = answer.departmentId;
            // Fetch and Display Employees for the Selected Department
            const query = `
                SELECT employees.id, CONCAT(employees.first_name, ' ', employees.last_name) AS employee_name, roles.title
                FROM employees
                JOIN roles ON employees.role_id = roles.id
                JOIN departments ON roles.department_id = departments.id
                WHERE departments.id = ?;
            `;
            return db.promise().query(query, [departmentId])
            .then(([employees]) => {
                console.log(`Employees in the ${departments.find(dept => dept.id === departmentId).name} Department:`);
                console.table(employees);
            });
        });
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
        // Ensure the input is treated as a string
        const strInput = input.toString().trim();
        // Allow '0' as a special case or check if it's a positive integer
        if(strInput === '0' || (!isNaN(input) && input > 0)) {
            return true;
        } else {
            return 'Please enter a valid ID (a positive integer) or 0 for no manager.';
        }
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

// Function to update an existing employee's manager
function updateEmployeeManager(returnToMainMenu) {
    console.log('Updating an employee\'s manager...');

    // Fetch Employees
    db.promise().query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees')
    .then(([employees]) => {
        //Prompt to Select an Employee
        return inquirer.prompt([
            {
                name: 'employeeId',
                type: 'list',
                choices: employees.map(emp => ({ name: emp.name, value: emp.id })),
                message: 'Which employee\'s manager do you want to update?',
            }
        ])
        .then(answer => {
            const employeeId = answer.employeeId;
            //Fetch Potential Managers
            return db.promise().query('SELECT id, CONCAT(first_name, " ", last_name) AS name FROM employees WHERE id <> ?', [employeeId])
            .then(([managers]) => {
                //Prompt to Select a New Manager
                return inquirer.prompt([
                    {
                        name: 'managerId',
                        type: 'list',
                        choices: [{ name: 'No Manager', value: null }].concat(managers.map(mgr => ({ name: mgr.name, value: mgr.id }))),
                        message: 'Who is the new manager?',
                    }
                ])
                .then(answer => ({ employeeId, managerId: answer.managerId }));
            });
        });
    })
    .then(({ employeeId, managerId }) => {
        // Update the Employee's Manager in the Database
        return db.promise().query('UPDATE employees SET manager_id = ? WHERE id = ?', [managerId, employeeId]);
    })
    .then(() => {
        console.log('Employee\'s manager updated successfully.');
    })
    .catch(console.log)
    .then(() => returnToMainMenu());
}





//Exporting function to index.js
module.exports = {
    viewAllEmployees,
    viewEmployeesByManager, 
    viewEmployeesByDepartment,
    addEmployee,
    updateEmployeeRole,
    updateEmployeeManager,
    
};