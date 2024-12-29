const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const db = new sqlite3.Database(path.join(__dirname, 'database', 'users.db'));

// Middleware
app.use(express.json());
app.use(cors()); // Permitir todas las solicitudes CORS

// Crear tabla si no existe
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
)`);

// Ruta para registrar usuarios
app.post('/login', (req, res) => {
    const { mail, pwd } = req.body;

    // Loggear correo y contraseña en consola
    console.log(`Correo: ${mail}, Contraseña: ${pwd}`);

    if (!mail || !pwd) {
        return res.status(400).json({ error: 'Correo y contraseña son requeridos.' });
    }

    // Insertar usuario en la base de datos
    db.run(
        `INSERT INTO users (email, password) VALUES (?, ?)`,
        [mail, pwd],
        (err) => {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'Correo ya registrado.' });
                }
                return res.status(500).json({ error: 'Error interno del servidor.' });
            }
            res.json({ success: 'Usuario registrado exitosamente.' });
        }
    );
});

// Ruta de prueba de salud
app.get('/', (req, res) => {
    res.send('El backend está funcionando correctamente.');
});

// Inicializar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
