CREATE DATABASE finance;

USE finance;

CREATE TABLE expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,          
    category VARCHAR(255) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    description VARCHAR(255),
    expense_type ENUM('Need', 'Want'),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE income (
    id INT AUTO_INCREMENT PRIMARY KEY,       -- Unique identifier for each income entry
    date DATE NOT NULL,                      -- Date of the income
    category VARCHAR(255) NOT NULL,          -- Category of income (e.g., Salary, Bonus)
    amount DECIMAL(10, 2) NOT NULL,          -- Amount received, with 2 decimal places for precision
    description VARCHAR(255),                -- Optional description of the income
    source VARCHAR(255),       -- Recurring flag, true if it's recurring income (e.g., monthly salary)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when the income was recorded
);