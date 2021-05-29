const cTable = require('console.table');
const inquirer = require('inquirer');
const mysql = require('mysql2');
const db = require('./db/connection');

// Start SQL server after DB connection
// ==============================================
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    init();
});

// Start init prompts
// ==============================================
function init() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            name: "options",
            choices: ["View all Departments?", "View all Roles", "View all Employees", "Add a Department", "Add a Role", "Add an Employee", "Update Employee"]
        }
    ]).then((data) => {
        switch (data.options) {
            case "View all Departments?":
                viewDepartments();
                break;
            case "View all Roles?":
                viewRoles();
                break;
            case "Add a Department":
                addDepartments();
                break;
            //REPEAT THESE FOR EACH OPTION
            default:
                break;
        }
    })
}

// View Departments
// ==============================================
function viewDepartments() {
    const sql = `SELECT * FROM departments`
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows)
        init();
    })
}

// add Department
// ==============================================
function addDepartments() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the department name",
            name: "department",
        }]).then ((data)=> {
            const sql = `INSERT INTO departments (name) VALUES (?)`;
            const params = [data.department];

            db.query(sql, params, (err, rows) => {
                if (err) throw err;
                console.log(`Success! - added ${rows}`)
                init();
            })
        })

}
