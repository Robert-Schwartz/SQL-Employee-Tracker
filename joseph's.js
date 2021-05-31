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
        db.query(`SELECT * FROM department`, (err, rows) => {
            // we want access to the information in this table so we will run inquirer in this call back function
            if (err) throw err;
            const activeDeps = rows.map(x => x.dep_name)
            inquirer
                .prompt([
                    {
                        type: "input",
                        message: "What is the title of the role you want to add?",
                        name: "title",
                        validate: nameInput => {
                            if (nameInput) {
                                return true;
                            } else {
                                console.log('You must Answer!!!');
                                return false;
                            }
                        }
                    },
                    {
                        type: "input",
                        message: "What is the salary of this role?",
                        name: "salary",
                        validate: nameInput => {
                            if (nameInput) {
                                return true;
                            } else {
                                console.log('You must Answer!!!');
                                return false;
                            }
                        }
                    },
                    {
                        type: "list",
                        message: "What depatment is your role in?",
                        name: "department",
                        choices: activeDeps
                    }
                ])
                .then(answers => {
                    // grab department and us that to return the id in the same row
                    const department = answers.department;
                    let depId;
                    // FOR/OF LOOP: loops through the values of an iterable array
                    for (const row of rows) {
                        if (row.dep_name === department) {
                            depId = row.id;
                        }
                    }

                    //answers.salary is a sting we need to turn it into a number
                    const salary = parseInt(answers.salary)

                    const sql = `INSERT INTO emp_role (title, salary, department_id) VALUES (?,?,?);`
                    const params = [answers.title, salary, depId]

                    db.query(sql, params, (err, rows) => {
                        if (err) throw err;
                        console.log('Success');
                        trackEmp();
                    })
                });
        });
    };