// backend/routes/agentes.js
const express = require('express');
const router = express.Router();
const db = require('../../db');

// Obtener todos los agentes
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM AGENTE_POLICIAL');
    res.status(200).json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al obtener agentes' });
  }
});

// Crear agente policial
router.post('/', async (req, res) => {
  const { ci, cc, nombre, fecha_nacimiento, comisaria, id_circuito } = req.body;
  try {
    await db.query(
      'INSERT INTO AGENTE_POLICIAL (ci, cc, nombre, fecha_nacimiento, comisaria, id_circuito) VALUES (?, ?, ?, ?, ?, ?)',
      [ci, cc, nombre, fecha_nacimiento, comisaria, id_circuito]
    );
    res.status(201).json({ mensaje: 'Agente policial creado y asignado al circuito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar el agente' });
  }
});

// Eliminar agente policial
router.delete('/:ci', async (req, res) => {
  const { ci } = req.params;
  try {
    await db.query('DELETE FROM AGENTE_POLICIAL WHERE ci = ?', [ci]);
    res.status(200).json({ mensaje: 'Agente policial eliminado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el agente' });
  }
});

module.exports = router;
