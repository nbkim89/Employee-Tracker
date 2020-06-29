const mysql = require("mysql");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "hwaiting",
  database: "employee_trackerDB"
});

connection.connect(function(err) {
    if (err) throw err;
    runTracker();
});

function runTracker() {
    inquirer
    .prompt({
        name: "start",
        type: "list",
        message: "Welcome to our employee database! What would you like to do?",
        choices: [
                "View all employees",
                "View all departments",
                "View all roles",
                "Add an employee",
                "Add department",
                "Add a role",
                "Update a role",
                "EXIT"
        ]
    }).then(function (answer) {
        switch (answer.start) {
            case "View all employees":
                viewEmployees();
                break;
            case "View all departments":
                viewDepartments();
                break;
            case "View all roles":
                viewRoles();
                break;
            case "Add an employee":
                addEmployee();
                break;
            case "Add department":
                addDepartment();
                break;
            case "Add a role":
                addRole();
                break;
            case "EXIT": 
                endApp();
                break;
            default:
                break;
        };
    });
};

function viewEmployees() {
    var query = "SELECT * FROM employee";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.log(res.length + " employees found!");
        console.table('All Employees:', res); 
        runTracker();
    });
};

function viewDepartments() {
    var query = "SELECT * FROM department";
    connection.query(query, function(err, res) {
        if (err) throw err;
        console.table('All Departments:', res);
        runTracker();
    });
};

function viewRoles() {
    var query = "SELECT * FROM role";
    connection.query(query, function(err, res){
        if (err) throw err;
        console.table('All roles:', res);
        runTracker();
    });
};

function addEmployee() {
    connection.query("SELECT * FROM role", function (err, res) {
        if (err) throw err;    
        inquirer
            .prompt([
                {
                    name: "first_name",
                    type: "input", 
                    message: "Employee's first name: "
                },
                {
                    name: "last_name",
                    type: "input", 
                    message: "Employee's last name: "
                },
                {
                    name: "role", 
                    type: "list",
                    choices: function() {
                        var roleArray = [];
                        for (let i = 0; i < res.length; i++) {
                            roleArray.push(res[i].title);
                        }
                        return roleArray;
                    },
                    message: "What is this employee's role? "
                }
                ]).then(function (answer) {
                        let roleID;
                        for (let j = 0; j < res.length; j++) {
                            if (res[j].title == answer.role) {
                                roleID = res[j].id;
                                console.log(roleID)
                            }                  
                        }  
                        connection.query(
                        "INSERT INTO employees SET ?",
                        {
                            first_name: answer.first_name,
                            last_name: answer.last_name,
                            role_id: roleID,
                        },
                        function (err) {
                            if (err) throw err;
                            console.log("Your employee has been added!");
                            runTracker();
                        }
                    );
            });
    });
};

function addDepartment() {
    inquirer
    .prompt([
        {
            name: "new_dept", 
            type: "input", 
            message: "What is the new department you would like to add?"
        }
    ]).then(function (answer) {
        connection.query(
            "INSERT INTO department SET ?",
            {
                name: answer.new_dept
            }
        );
          var query = "SELECT * FROM department";
        connection.query(query, function(err, res) {
            if (err) throw err;
            console.table('All Departments:', res);
            runTracker();
        })
    })
}

function addRole() {
    connection.query("SELECT * FROM department", function(err, res) {
        if (err) throw err;
        inquirer 
        .prompt([
            {
                name: "new_role",
                type: "input", 
                message: "What is the Title of the new role?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the salary of this position? (Enter a number?)"
            },
            {
                name: "deptChoice",
                type: "rawlist",
                choices: function() {
                    var deptArray = [];
                    for (let i = 0; i < res.length; i++) {
                    deptArray.push(res[i].name);
                    }
                    return deptArray;
                },
            }
        ]).then(function (answer) {
            let deptID;
            for (let j = 0; j < res.length; j++) {
                if (res[j].name == answer.deptChoice) {
                    deptID = res[j].id;
                }
            }

        connection.query(
            "INSERT INTO role SET ?",
            {
                title: answer.new_role,
                salary: answer.salary,
                department_id: deptID
            },
            function (err, res) {
                if(err)throw err;
                console.log("Your new role has been added!");
                startApp();
            }
        );
    });
    });
};

function endApp() {
    connection.end();
};