const express = require('express');
const router = express.Router();
const db = require('../../db');

// Obtener todas las listas
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM LISTA');
    res.json(results);
  } catch (err) {
    console.error('Error al obtener listas:', err);
    res.status(500).json({ error: 'Error al obtener listas' });
  }
});

// Obtener todos los partidos existentes
router.get('/partidos', async (req, res) => {
  try {
    const [results] = await db.query('SELECT nombre, presidente, vicepresidente FROM PARTIDO');
    res.json(results);
  } catch (err) {
    console.error('Error al obtener partidos:', err);
    res.status(500).json({ error: 'Error al obtener partidos' });
  }
});

// Agregar una nueva lista
router.post('/', async (req, res) => {
  const {
    nombre_lista,
    numero,
    candidato_presidente,
    candidato_vicepresidente,
    organo,
    orden,
    departamento
  } = req.body;

  if (!nombre_lista || !numero || !candidato_presidente || !candidato_vicepresidente || !organo || !orden || !departamento) {
    return res.status(400).json({ error: 'Faltan datos para crear la lista' });
  }

  try {
    const [opcionResult] = await db.query(
      'INSERT INTO OPCION (tipo, descripcion) VALUES (?, ?)',
      ['lista', 'Generada automáticamente']
    );

    const id_opcion = opcionResult.insertId;

    await db.query(
      `INSERT INTO LISTA (
        id_opcion, nombre_lista, numero, candidato_presidente,
        candidato_vicepresidente, organo, orden, departamento
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_opcion,
        nombre_lista,
        numero,
        candidato_presidente,
        candidato_vicepresidente,
        organo,
        orden,
        departamento
      ]
    );

    res.json({ mensaje: 'Lista agregada correctamente' });
  } catch (err) {
    console.error('Error al agregar lista:', err);
    res.status(500).json({ error: 'Error al agregar lista' });
  }
});

// Eliminar una lista
router.delete('/:id', async (req, res) => {
  const id_opcion = req.params.id;

  try {
    await db.query('DELETE FROM OPCION WHERE id_opcion = ?', [id_opcion]);
    res.json({ mensaje: 'Lista eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar opción:', err);
    res.status(500).json({ error: 'Error al eliminar la lista' });
  }
});

module.exports = router;
