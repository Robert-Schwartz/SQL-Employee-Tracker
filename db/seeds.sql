USE employee_db;

INSERT INTO department (name)
VALUES
("Suns"),
("Bulls"),
("Celtics");

INSERT INTO roles (title, salary, department_id)
VALUES
("Coach", 5000000, 1),
("Guard", 3000000, 1),
("Forward", 7000000, 1),
("Center", 15000000, 1);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
("Williams","Monty", 1, NULL),
("Chris","Paul", 2, 1),
("Devin","Booker", 2, 1),
("DeAndre","Ayton", 4, 1);

