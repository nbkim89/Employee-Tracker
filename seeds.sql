USE employee_trackerDB;

INSERT INTO department (name)
VALUES
    ("management"),
    ("sales"),
    ("engineering"),
    ("legal")

INSERT INTO role (title, salary, department_id)
VALUES
    ("manager", 250000, 1),
    ("salesperson", 80000, 2),
    ("senior engineer", 10000, 3),
    ("junior engineer", 70000, 3),
    ("lawyer", 120000, 4)

INSERT INTO employees (first_name, last_name, role_id)
VALUES
    ("Nick", "Kim", 3)