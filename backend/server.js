const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Osli0629',
    database: 'horaxhora'
});

db.connect(err => {
    if (err) {
        console.log("Error conexión DB", err);
    } else {
        console.log("Conectado a MySQL");
    }
});

// Registrar unidad
app.post('/unidades', (req, res) => {
    const { tipo } = req.body;
    db.query('INSERT INTO unidades (tipo) VALUES (?)', [tipo], (err) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Unidad registrada' });
    });
});

app.get('/', (req, res) => {
    res.send("API HoraxHora funcionando correctamente");
});

// Obtener conteo
app.get('/conteo', (req, res) => {
    db.query(`
        SELECT 
        SUM(tipo='BUENA') AS buenas,
        SUM(tipo='MALA') AS malas
        FROM unidades
    `, (err, results) => {
        if (err) return res.status(500).send(err);
        res.send(results[0]);
    });
});

app.listen(3000, () => {
    console.log("Servidor en puerto 3000");
});