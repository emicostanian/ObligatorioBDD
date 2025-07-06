// backend/routes/partidos.js
const express = require('express');
const router = express.Router();
const db = require('../../db');

// Obtener todos los partidos
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM PARTIDO');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener partidos' });
  }
});

// Crear partido
router.post('/', async (req, res) => {
  const { nombre, direccion_sede, presidente, vicepresidente } = req.body;

  try {
    const [existing] = await db.query('SELECT * FROM PARTIDO WHERE nombre = ?', [nombre]);
    if (existing.length > 0) {
      return res.status(400).json({ error: 'Ese partido ya existe' });
    }

    const [pres] = await db.query('SELECT * FROM CANDIDATO WHERE ci = ?', [presidente]);
    const [vice] = await db.query('SELECT * FROM CANDIDATO WHERE ci = ?', [vicepresidente]);

    if (pres.length === 0 || vice.length === 0) {
      return res.status(400).json({ error: 'Presidente o vicepresidente no válido (deben existir como candidatos)' });
    }

    // Insertar el nuevo partido
    await db.query(
      'INSERT INTO PARTIDO (nombre, direccion_sede, presidente, vicepresidente) VALUES (?, ?, ?, ?)',
      [nombre, direccion_sede, presidente, vicepresidente]
    );

    // Actualizar las tablas ES_PRESIDENTE y ES_VICEPRESIDENTE para asociar el nombre del partido
    await db.query(
      'UPDATE ES_PRESIDENTE SET nombre_partido = ? WHERE ci = ?',
      [nombre, presidente]
    );

    await db.query(
      'UPDATE ES_VICEPRESIDENTE SET nombre_partido = ? WHERE ci = ?',
      [nombre, vicepresidente]
    );

    res.status(201).json({ mensaje: 'Partido creado con éxito y vinculaciones actualizadas' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al crear el partido' });
  }
});


// Eliminar partido
router.delete('/:nombre', async (req, res) => {
  const { nombre } = req.params;
  try {
    await db.query('DELETE FROM PARTIDO WHERE nombre = ?', [nombre]);
    res.status(200).json({ mensaje: 'Partido eliminado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el partido' });
  }
});

module.exports = router;