const cTable = require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const db = require("./db/connection");

// Start SQL server after DB connection
// ==============================================
db.connect((err) => {
    if (err) throw err;
    console.log(` "${db.config.database}" Database connected.`);
    init();
});

// init prompts switch case
// ==============================================
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
                    addDepartment();
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
                    let viewEmployee= "employee"
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
// ==============================================
// view tables using values sent from prompt switches
function viewTable(view) {
    const sql = `SELECT * FROM ${view}`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        init();
    });
};

// Add Department
// ==============================================
function addDepartments() {
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the department name",
                name: "department",
            },
        ])
        .then((data) => {
            const sql = `INSERT INTO department (name) VALUES (?)`;
            const params = [data.department];

            db.query(sql, params, (err, rows) => {
                if (err) throw err;
                console.log(`Success! - added ${rows}`);
                init();
            });
        });
}
