// Import necessary modules
const express = require('express'); // Framework for building web applications
const mariadb = require('mariadb'); // Library for connecting to MariaDB database

require('dotenv').config(); // Load environment variables from a .env file

// Create a connection pool for MariaDB using credentials from environment variables
const pool = mariadb.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

// Function to establish a database connection
async function connect(){
    try {
        const conn = await pool.getConnection();
        console.log('Connected to the database');
        return conn;
    } catch (err) {
        console.log('Error connecting to the database: ' + err);
    }
}

// Initialize the Express app
const app = express();
const PORT = 3000; // Define the port for the application

// Parse URL-encoded data
app.use(express.urlencoded({ extended: false }));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Route: Home page
app.get('/', async (req, res) => {
    console.log("Hello, world - server!");
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Get current month
    console.log(currentMonth);

    const conn = await connect(); // Establish a database connection

    // Calculate total income
    const incomeRows = await conn.query('SELECT amount FROM income;');  
    let totalIncome = [];
    if (incomeRows) {
        totalIncome = calculateTotals(incomeRows);
    } else {
        totalIncome = 0;
    }
    
    // Calculate total expenses
    const expenseRows = await conn.query('SELECT amount FROM expenses');
    let totalExpenses = [];
    if (totalExpenses) {
        totalExpenses = calculateTotals(expenseRows);
    } else {
        totalExpenses = 0;
    }

    // Retrieve all expense data
    const expenses = await conn.query('SELECT * FROM expenses;');

    // Render the home page with calculated totals and expense data
    res.render('home', { errors: [], income: totalIncome, expenses: totalExpenses, expenseData: expenses });
});

// Function: Calculate the total of an array of amounts
function calculateTotals(array) {
    if (array.length == 1 && isNaN(array[0].amount)) {
        return 0; // Return 0 if the array contains a single invalid value
    }

    let total = 0;
    for (let i = 0; i < array.length; i++) {
        const amountStr = parseFloat(array[i].amount.trim()); // Parse and trim the amount

        if (!isNaN(amountStr)) {
            total += amountStr; // Add valid amounts to the total
        } else {
            console.warn(`Warning: Parsed amount is NaN for row ${i}`); // Log a warning for invalid values
        }
    }
    return total; // Return the total sum
}

// Route: Expense page
app.get('/expense', (req, res) => {
    console.log('Connected to expense page');
    res.render('expense'); // Render the expense page
});

// Route: Income page
app.get('/income', (req, res) => {
    res.render('income'); // Render the income page
});

// Route: All entries page
app.get('/allEntries', async (req, res) => {
    const conn = await connect(); // Establish a database connection

    const incomeEntries = await conn.query('SELECT * FROM income;'); // Fetch all income entries
    console.log('Loaded in income: ' + incomeEntries);
    const expenseEntries = await conn.query('SELECT * FROM expenses;'); // Fetch all expense entries
    console.log('Loaded in expenses: ' + expenseEntries);

    // Render the allEntries page with income and expense data
    res.render('allEntries', { income: incomeEntries, expenses: expenseEntries });
});

// Route: Submit expense data
app.post('/expenseSubmit', async (req, res) => {
    console.log(req.body); // Log the submitted form data

    const data = req.body;
    const conn = await connect(); // Establish a database connection

    // Insert the expense data into the database
    conn.query(`INSERT INTO expenses (date, category, amount, description, expense_type) VALUES(
        '${data.date}', '${data.category}', '${data.amount}', '${data.description}', '${data.expense_type}')`);

    res.render('success', {incomeData : [], expenseData: data}); // Render the success page
});

// Route: Submit income data
app.post('/incomeSubmit', async (req, res) => {
    console.log(req.body); // Log the submitted form data

    const data = req.body;
    const conn = await connect(); // Establish a database connection

    // Insert the income data into the database
    conn.query(`INSERT INTO income (date, category, amount, description, source) VALUES(
        '${data.date}', '${data.category}', '${data.amount}', '${data.description}', '${data.source}')`);
    
    res.render('success', {incomeData : data, expenseData: []}); // Render the success page
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
    console.log(`Server running on porta potty http://localhost:${PORT}`);
});
