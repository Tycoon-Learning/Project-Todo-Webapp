const express = require("express");
const mysql = require("mysql2");
const path = require("path");
const app = express();
const PORT = 3000;

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Hassi@11",
  database: "simple_todo"
});

db.connect(err => {
  if (err) throw err;
  console.log(" Server Connected");
  db.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id INT AUTO_INCREMENT PRIMARY KEY,
      task VARCHAR(255) NOT NULL,
      status ENUM('pending','completed') DEFAULT 'pending'
    )
  `);
});

// Middleware 
app.use(express.json());                         
app.use(express.static(path.join(__dirname,"../frontend")));

// Get all todos
app.get("/todos", (_, res) =>
  db.query("SELECT * FROM todos ORDER BY id DESC", (_, rows) => res.json(rows))
);

// Add todo
app.post("/todos", (req, res) => {
  db.query("INSERT INTO todos (task) VALUES (?)", [req.body.task], (_, r) => {
    db.query("SELECT * FROM todos WHERE id=?", [r.insertId], (_, rows) => res.json(rows[0]));
  });
});

// Update todo
app.put("/todos/:id", (req, res) => {
  const { id } = req.params, { status, task } = req.body;
  const field = status ? ["status", status] : ["task", task];
  db.query(`UPDATE todos SET ${field[0]}=? WHERE id=?`, [field[1], id], () =>
    db.query("SELECT * FROM todos WHERE id=?", [id], (_, rows) => res.json(rows[0]))
  );
});

// Delete todo
app.delete("/todos/:id", (req, res) =>
  db.query("DELETE FROM todos WHERE id=?", [req.params.id], () => res.json({ message: "Deleted" }))
);

// frontend
app.get("/", (_, res) => res.sendFile(path.join(__dirname,"../frontend/index.html")));

// Start server 
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));