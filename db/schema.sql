DROP DATABASE IF EXISTS employee_tracker_db;
CREATE DATABASE employee_tracker_db;
USE employee_tracker_db;


create table department(
    id   int auto_increment primary key,
    name varchar(30)
);

create table role(
    id             int auto_increment primary key,
    title          varchar(30),
    salary         decimal(10,2),
    department_id  int,
    foreign key (department_id) REFERENCES department(id)
);

create table employee (
    id         int  auto_increment primary key,
    first_name varchar(30),
    last_name  varchar(30),
    role_id    int,
    manager_id int,
    foreign key (role_id) REFERENCES role(id),
    foreign key (manager_id) REFERENCES employee(id)
);
