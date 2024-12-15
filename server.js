const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const db = new sqlite3.Database(path.join(__dirname, 'database', 'users.db'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)`);

// Ruta para guardar usuarios
app.post('/login', (req, res) => {
    const { mail, pwd } = req.body;

    if (!mail || !pwd) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    db.run(`INSERT INTO users (email, password) VALUES (?, ?)`, [mail, pwd], (err) => {
        if (err) {
            console.error(err.message);
            return res.status(500).json({ error: 'Error al guardar los datos' });
        }
        res.json({ success: 'Usuario registrado' });
    });
});

// Ruta para verificar si el servidor funciona
app.get('/', (req, res) => {
    res.send('Backend funcionando correctamente.');
});

// Inicia el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
 

