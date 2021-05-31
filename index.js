const cTable = require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const db = require("./db/connection");

// Start SQL server after DB connection
//* ===================================================
db.connect((err) => {
    if (err) throw err;
    console.log(` "${db.config.database}" Database connected.`);
    init();
});

// Init prompts switch cases
//* ==================================================
function init() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "options",
                message: "What would you like to do?",
                choices: [
                    "Add A Department",
                    "Add A Role",
                    "Add An Employee",
                    "View All Departments",
                    "View All Roles",
                    "View All Employees",
                    "Update Employee Role",
                    "Update Employee Manager",
                    "Exit",
                ],
            },
        ])
        .then((answers) => {
            switch (answers.options) {
                case "Add A Department":
                    addDepartments();
                    break;
                case "Add A Role":
                    addRole();
                    break;
                case "Add An Employee":
                    addEmployee();
                    break;
                case "View All Departments":
                    let viewDepartment = "department";
                    viewTable(viewDepartment);
                    break;
                case "View All Roles":
                    let viewRoles = "roles";
                    viewTable(viewRoles);
                    break;
                case "View All Employees":
                    let viewEmployee = "employee";
                    viewTable(viewEmployee);
                    break;
                case "Update Employee Role":
                    updateEmployeeRole();
                    break;
                case "Update Employee Manager":
                    updateEmployeeManager();
                    break;
                case "Delete Departments":
                    deleteDepartments();
                    break;
                case "Delete Roles":
                    deleteRoles();
                    break;
                case "Delete Employees":
                    deleteEmployees();
                    break;
                case "Quit":
                    break;
                default:
                    break;
            }
        });
}

// View Options
//* ===================================================
// view tables using values sent from prompt switches
function viewTable(view) {
    const sql = `SELECT * FROM ${view}`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        init();
    });
}

// Add Functions
//* ===================================================
// Add Department name to Department Table
function addDepartments() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the department name",
                name: "department",
                validate: (nameInput) => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("Please Provide an Answer");
                        return false;
                    }
                },
            },
        ])
        .then((data) => {
            const sql = `INSERT INTO department (name) VALUES (?)`;
            const params = [data.department];
            // run query to add department into department table
            db.query(sql, params, (err, rows) => {
                if (err) throw err;
                console.log(`Success! - added ${params} to Department Table`);
                init();
            });
        });
}
// Add Role name to Roles Table
function addRole() {
    // pull active department name array and store in empty array
    // activeDepartment array will be used as choices for ROLE department prompts
    let activeDepartment = [];
    db.query("SELECT * FROM department", (err, data) => {
        if (err) throw err;
        for (let j = 0; j < data.length; j++) {
            activeDepartment.push({ name: data[j].name, value: data[j].id });;
        }
    });

    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the Title for the Role?",
                name: "title",
                validate: (nameInput) => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("Please Provide an Answer");
                        return false;
                    }
                },
            },
            {
                type: "input",
                message: "What is the Salary of for that Role?",
                name: "salary",
                validate: (nameInput) => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("Please Provide an Answer");
                        return false;
                    }
                },
            },
            {
                type: "list",
                message: "What Department does the Role belong to?",
                name: "department",
                choices: activeDepartment,
            },
        ])
        .then((data) => {

            // create variables with prompt answers
            const ID = parseInt(data.department);
            const salary = parseInt(data.salary);
            const sql = `INSERT INTO roles (title, salary,department_id) VALUES (?,?,?)`;
            const params = [data.title, salary, ID];

            // query to add params using variables above
            db.query(sql, params, (err, rows) => {
                if (err) throw err;
                console.log(`Success! - added ${params} to Role Table`);
                init();
            });
        });
};

// Add Employee name to Employee Table
function addEmployee() {
    // pull active department name and ID and store in empty array
    // activeDepartment array will be used as choices for Employee department prompts
    let activeRoles = [];
    db.query("SELECT * FROM roles", (err, data) => {
        if (err) throw err;
        for (let j = 0; j < data.length; j++) {
            activeRoles.push({ name: data[j].title, value: data[j].id });;
        }
    });

    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the employee's First Name?",
                name: "first_name",
                validate: (nameInput) => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("Please Provide an Answer");
                        return false;
                    }
                },
            },
            {
                type: "input",
                message: "What is the employee's Last Name??",
                name: "last_name",
                validate: (nameInput) => {
                    if (nameInput) {
                        return true;
                    } else {
                        console.log("Please Provide an Answer");
                        return false;
                    }
                },
            },
            {
                type: "list",
                message: "What is the Employee's role?",
                name: "role",
                choices: activeRoles,
            },
        ])
        .then((data) => {

            // create variables with prompt answers
            const ID = parseInt(data.role);
            const sql = `INSERT INTO employee (first_name,last_name,role_id) VALUES (?,?,?)`;
            const params = [data.first_name,data.last_name, ID];

            // query to add params using variables above
            db.query(sql, params, (err, rows) => {
                if (err) throw err;
                console.log(`Success! - added ${params} to Employee Table`);
                init();
            });
        });
}
