// Load required libraries
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Create the app
const app = express();
const port = 3000;

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Hassi@11',
  database: 'simple_todo'
});

// Check connection
db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to database.');
});

// Middleware
app.use(cors());
app.use(express.json());

// Routes would go here (we'll add these later)

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});