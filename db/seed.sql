-- Insert initial departments
INSERT INTO departments (name) VALUES ('Sales'), ('Engineering'), ('Finance'), ('Marketing');

-- Insert initial roles
INSERT INTO roles (title, salary, department_id) VALUES 
('Sales Lead', 100000, 1),
('Software Engineer', 120000, 2),
('Account Manager', 90000, 3),
('Marketing Director', 95000, 4);

-- Insert initial employees
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES 
('Jamie', 'Guminy', 1, NULL),
('Stas', 'Morozan', 2, NULL),
('Harry', 'MacMillan', 3, 1),
('Ali', 'Maqsood', 4, 2);




 