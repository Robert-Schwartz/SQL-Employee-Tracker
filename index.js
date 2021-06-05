const cTable = require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql2");
const db = require("./db/connection");

// Connect Database
// ===================================================
db.connect((err) => {
    if (err) throw err;
    console.log(` "${db.config.database}" Database connected.`);
    init();
});

// Init prompts switch cases
// ==================================================
function init() {
    console.log(`
        ==========================

            Employee Tracker!

        ==========================
    `);
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
                    viewDepartment();
                    break;
                case "View All Roles":
                    viewRoles();
                    break;
                case "View All Employees":
                    viewEmployee();
                    break;
                case "Update Employee Role":
                    let dataType = 'emp_role';
                    let dataColum = 'role_id'
                    updateEmployeeRole(dataType, dataColum);
                    break;
                case "Update Employee Manager":
                    let dataType2 = 'employee'
                    let dataColum2 = 'manager_id'
                    updateEmployeeManager(dataType2, dataColum2);
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
                    quit();
                    break;
                default:
                    break;
            }
        });
};

// View Functions
// ===================================================
// view Employee Table
function viewEmployee() {
    console.log(`
        ==================
        View Employees!
        ==================
    `)
    const sql = `
    SELECT *
    FROM employee
    LEFT JOIN roles
    ON employee.role_id = roles.id
    LEFT JOIN department
    ON employee.id = department.id;`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        init();
    });
}

// view Roles Table
function viewRoles() {
    console.log(`
        ==================
            View Roles!
        ==================
    `)
    const sql = `
    SELECT *
    FROM roles
    LEFT JOIN employee
    ON employee.id = roles.id;`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        init();
    });
}

// view Department Table
function viewDepartment() {
    console.log(`
        ==================
        View Departments!
        ==================
    `)
    const sql = `
    SELECT *
    FROM department`;
    db.query(sql, (err, rows) => {
        if (err) throw err;
        console.table(rows);
        init();
    });
}



// Update Functions
// ====================================================
// update Employee Role
function updateEmployeeRole() {
    // activeEmployees will provide employee name options for prompt

    // activeDepartment array will be used as choices for Employee department prompts
    let activeRoles = [];
    db.query("SELECT * FROM roles", (err, data) => {
        if (err) throw err;
        for (let j = 0; j < data.length; j++) {
            activeRoles.push({
                name: data[j].title,
                value: data[j].id
            });
        }
        let currentEmployees = [];
        db.query("SELECT * FROM employee", (err, data) => {
            if (err) throw err;
            for (let k = 0; k < data.length; k++) {
                currentEmployees.push({
                    name: data[k].first_name + " " + data[k].last_name,
                    value: data[k].id
                });;
            }
            inquirer
                .prompt([
                    {
                        type: "list",
                        message: "Which employee would you like to update?",
                        name: "employee",
                        choices: currentEmployees,
                    },
                    {
                        type: "list",
                        message: "What is the employee's new Role?",
                        name: "roles",
                        choices: activeRoles,
                    },
                ])
                .then((data) => {
                    // create variables with prompt answers
                    const role_id = parseInt(data.roles);
                    const employee_id = parseInt(data.employee);
                    const sql = `UPDATE employee SET role_id = ? Where id = ? `;
                    const params = [role_id, employee_id];

                    // query to add params using variables above
                    db.query(sql, params, (err, rows) => {
                        if (err) throw err;
                        console.log(`
                        ============================================
                        Success! - added ${params} to Employee Table
                        ============================================
                        `);
                        init();
                    });
                });
        });
    });
};


// Add Functions
// ===================================================
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
                console.log(`
                        ==============================================
                        Success! - added ${params} to Department Table
                        ==============================================
                        `);
                init();
            });
        });
};
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
                console.log(`
                        ============================================
                        Success! - added ${params} to the Role Table
                        ============================================
                        `);
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
            activeRoles.push({
                name: data[j].title,
                value: data[j].id
            });;
        }
        //pull out employee names from employee table to assign as manager
        let activeEmployees = [];
        db.query("SELECT * FROM employee", (err, data) => {
            if (err) throw err;
            for (let j = 0; j < data.length; j++) {
                activeEmployees.push({
                    name: data[j].first_name + " " + data[j].last_name,
                    value: data[j].id
                });;
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
                {
                    type: "list",
                    message: "Who is the Employee's manager?",
                    name: "manager",
                    choices: activeEmployees,
                },
            ])
            .then((data) => {
                // create variables with prompt answers
                const role_id = parseInt(data.role);
                const manager_id = parseInt(data.manager);
                const sql = `INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES (?,?,?,?)`;
                const params = [data.first_name, data.last_name, role_id, manager_id];

                // query to add params using variables above
                db.query(sql, params, (err, rows) => {
                    if (err) throw err;
                    console.log(`
                        ============================================
                        Success! - added ${params} to Employee Table
                        ============================================
                        `);
                    init();
                });
            });
    });


};