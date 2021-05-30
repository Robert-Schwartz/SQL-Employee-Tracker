USE employee_db;

INSERT INTO department (name)
VALUES
("Shoes"),
("Electronics"),
("Toys");

INSERT INTO roles (title, salary, department_id)
VALUES
("Sales Rep", 50000, 1),
("Stock", 30000, 2),
("Cashier", 30000, 3);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Robert","Schwartz", 1, NULL),
("Steve","Johnson", 2, 1),
("Mike","Smith", 3, 1);

