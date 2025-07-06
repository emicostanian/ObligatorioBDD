const express = require('express');
const router = express.Router();
const db = require('../../db');

// Obtener todas las papeletas
router.get('/', (req, res) => {
  const sql = `SELECT * FROM PAPELETA`;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener papeletas' });
    res.json(results);
  });
});

// Agregar una nueva papeleta
router.post('/', (req, res) => {
  const { tipo, color, descripcion, contexto } = req.body;

  if (!['plebiscito', 'referendum'].includes(contexto)) {
    return res.status(400).json({ error: 'Contexto inválido. Debe ser plebiscito o referendum.' });
  }

  const sqlOpcion = `INSERT INTO OPCION (tipo, descripcion, contexto) VALUES (?, ?, ?)`;
  db.query(sqlOpcion, ['papeleta', descripcion || '', contexto], (err, result) => {
    if (err) {
      console.error('Error al crear opción:', err);
      return res.status(500).json({ error: 'Error al crear opción' });
    }

    const id_opcion = result.insertId;

    const sqlPapeleta = `INSERT INTO PAPELETA (id_opcion, tipo, color) VALUES (?, ?, ?)`;
    db.query(sqlPapeleta, [id_opcion, contexto, color], (err2) => {
      if (err2) {
        console.error('Error al agregar papeleta:', err2);
        return res.status(500).json({ error: 'Error al agregar papeleta' });
      }

      res.json({ mensaje: 'Papeleta agregada correctamente' });
    });
  });
});

// Eliminar una papeleta
router.delete('/:id', (req, res) => {
  const id_opcion = req.params.id;

  const sqlOpcion = `DELETE FROM OPCION WHERE id_opcion = ?`;
  db.query(sqlOpcion, [id_opcion], (err, result) => {
    if (err) {
      console.error('Error al eliminar opción:', err);
      return res.status(500).json({ error: 'Error al eliminar la papeleta' });
    }

    res.json({ mensaje: 'Papeleta eliminada correctamente' });
  });
});




module.exports = router;
