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

    // VALIDACIÓN NUEVA
    if (!tipo || (tipo !== 'BUENA' && tipo !== 'MALA')) {
        return res.status(400).send({ mensaje: "Tipo inválido. Usa BUENA o MALA" });
    }

    db.query(
        'INSERT INTO unidades (tipo) VALUES (?)',
        [tipo],
        (err) => {
            if (err) return res.status(500).send(err);

            res.send({ message: 'Unidad registrada correctamente' });
        }
    );
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

// Obtener historial
app.get('/historial', (req, res) => {
    db.query(
        "SELECT id, tipo, NOW() as fecha FROM unidades ORDER BY id DESC LIMIT 10",
        (err, results) => {
            if (err) return res.status(500).send(err);
            res.send(results);
        }
    );
});

// Historial por rango de fechas
app.get('/historial-fechas', (req, res) => {
    const { inicio, fin } = req.query;

    db.query(
        `SELECT id, tipo, NOW() as fecha 
         FROM unidades 
         WHERE DATE(NOW()) BETWEEN ? AND ?
         ORDER BY id DESC`,
        [inicio, fin],
        (err, results) => {
            if (err) return res.status(500).send(err);
            res.send(results);
        }
    );
});

app.listen(3000, () => {
    console.log("Servidor en puerto 3000");
});