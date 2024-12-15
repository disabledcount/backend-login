// server.js (Backend with fixed CORS issue)
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const db = new sqlite3.Database(path.join(__dirname, 'database', 'users.db'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS to allow all origins (temporary for debugging)
app.use(cors());

// Create table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)`);

// Route to save users
app.post('/login', (req, res) => {
    const { mail, pwd } = req.body;

    if (!mail || !pwd) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [mail, pwd], (err) => {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ error: 'Email already registered.' });
            }
            console.error(err.message);
            return res.status(500).json({ error: 'Internal server error.' });
        }
        res.json({ success: 'User registered successfully.' });
    });
});

// Health check route
app.get('/', (req, res) => {
    res.send('Backend is working correctly.');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
