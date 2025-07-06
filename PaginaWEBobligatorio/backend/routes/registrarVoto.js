const express = require('express');
const router = express.Router();
const db = require('../db');

// Registrar un nuevo voto
router.post('/', (req, res) => {
  const { tipo, es_observado, id_opcion } = req.body;

  if (!id_opcion || !tipo) {
    return res.status(400).json({ error: 'Faltan datos obligatorios: tipo o id_opcion' });
  }

  const sql = `
    INSERT INTO VOTO (tipo, es_observado, id_opcion, fecha, hora)
    VALUES (?, ?, ?, CURDATE(), CURTIME())
  `;

  const values = [
    tipo,
    es_observado ? 1 : 0,
    id_opcion
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al registrar voto:', err);
      return res.status(500).json({ error: 'Error al registrar el voto' });
    }
    res.status(201).json({ mensaje: 'Voto registrado correctamente' });
  });
});

module.exports = router;
