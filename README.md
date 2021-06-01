# SQL-Employee-Tracker
a command-line application to manage a company's employee database, using Node.js, Inquirer, and MySQL.

GIVEN a command-line application that accepts user input

WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees,
add a department, add a role, add an employee, and update an employee role
-Complete


WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
-Complete

WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
-Complete

WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries,
and managers that the employees report to
-partially complete.  Missing title, department, salary
-TODO:  Add a JOIN

WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
-Complete

WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
-Complete

WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager and that employee is added to the database
-Complete

WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database
- TODO: can't figure out how to bring in full employee names and ID's to

# TODO:

## update employee role
- need to figure out how to bring in full employee names and ID's to

## View all Employees
- need to figure out how to join tables correctly to view all information.
    - missing title, department, salary

## Bonus: See if you can add some additional functionality to your application, such as the ability to do the following:

- Update employee managers.

- View employees by manager.

- View employees by department.

- Delete departments, roles, and employees.

- View the total utilized budget of a department—in other words, the combined salaries of all employees in that department.
