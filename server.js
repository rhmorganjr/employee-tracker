const inquirer = require('inquirer');
const mysql = require('mysql2');
const express = require('express');
const cTable = require('console.table');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json);
app.use(express.urlencoded({ extended: true }));

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  // Your MySQL username
  user: 'root',
  // Your MySQL password
  password: 'sagamore13',
  database: 'employee_tracker_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log('connected as id ' + connection.threadId + '\n');
  dbAction();
});

// Default response for any other request(Not Found) Catch all
app.use((req, res) => {
    res.status(404).end();
});

function viewDepartments() {
    connection.query('SELECT * FROM department', function(err, res) {
      if (err) throw err;
      console.table(res);
      dbAction();
    });    
}

function viewRoles() {
  connection.query('SELECT * FROM role', function(err, res) {
    if (err) throw err;
    console.table(res);
    dbAction();
  });
}

function viewEmployees() {
  connection.query('SELECT * FROM employee', function(err, res) {
    if (err) throw err;
    console.table(res);
    dbAction();
  });  
}

function addDepartment() {
  inquirer
  .prompt({ name: 'name', message:"Department's name?"})
  .then(answers => {
    const query = connection.query(
      'INSERT INTO department SET ?',
      {
        name: answers.name
      },
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + ' department inserted!\n');
        dbAction();
      }
    );
  });
}

function addRole() {
  inquirer
  .prompt([{ name: 'title', message:"Role title?"},
          { name: 'salary', message:"Role salary?"},
          { name: 'department_id', message:"Associated Department?"}])
  .then(answers => {
    const query = connection.query(
      'INSERT INTO role SET ?',
      {
        title: answers.title,
        salary: answers.salary,
        department_id: answers.department_id
      },
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + ' role inserted!\n');
        dbAction();
      }
    );
  });
}

function addEmployee() {
  inquirer
  .prompt([{ name: 'first_name', message:"First Name?"},
          { name: 'last_name', message:"Last Name?"},
          { name: 'role_id', message:"Associated Role?"},
          { name: 'manager_id', message:"Manager?"}])
  .then(answers => {
    const query = connection.query(
      'INSERT INTO employee SET ?',
      {
        first_name: answers.first_name,
        last_name: answers.last_name,
        role_id: answers.role_id,
        manager_id: answers.manager_id
      },
      function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + ' employee inserted!\n');
        dbAction();
      }
    );
  });
}

function updateEmployeeRole() {
  inquirer
  .prompt({ name: 'role_id', message:"New Role Id?"})
  .then(answers => {
    const query = connection.query(
      'UPDATE employee SET ? WHERE ?',
      [
        {
          role_id: answers.role_id
        },
        {
          id: 6
        }
      ],
        function(err, res) {
        if (err) throw err;
        console.log(res.affectedRows + ' employee updated!\n');
        dbAction();
      }
    );
  });
}

function dbAction() {
    inquirer
    .prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: ['View all Departments', 'View all Roles', 'View all Employees', 
        'Add a Department', 'Add a Role', 'Add an Employee', 
        'Update an Employee Role', 'Quit'],
    }
    ])
    .then(choice => {
      if (choice.action === 'View all Departments') {
        viewDepartments();
      }
      else if (choice.action === 'View all Roles') {
        viewRoles();
      }
      else if (choice.action === 'View all Employees') {
        viewEmployees();
      }
      else if (choice.action === 'Add a Department') {
        addDepartment();
      }
      else if (choice.action === 'Add a Role') {
        addRole();
      }
      else if (choice.action === 'Add an Employee') {
        addEmployee();
      }
      else if (choice.action === 'Update an Employee Role') {
        updateEmployeeRole();
      }
      else if (choice.action === 'Quit') {
        connection.end();
      }
    });
}
