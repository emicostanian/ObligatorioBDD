// backend/routes/candidatos.js
const express = require('express');
const router = express.Router();
const db = require('../../db');

// Obtener todos los candidatos
router.get('/', async (req, res) => {
  try {
    const [presRows] = await db.query(`
      SELECT c.ci, c.nombre
      FROM CANDIDATO c
      JOIN ES_PRESIDENTE ep ON c.ci = ep.ci
    `);

    const [viceRows] = await db.query(`
      SELECT c.ci, c.nombre
      FROM CANDIDATO c
      JOIN ES_VICEPRESIDENTE ev ON c.ci = ev.ci
    `);

    res.json({ presidentes: presRows, vicepresidentes: viceRows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener candidatos' });
  }
});

// Crear candidato
router.post('/', async (req, res) => {
  const { ci, cc, nombre, fecha_nacimiento, rol, nombre_lista } = req.body;

  try {
    // 1. Insertar en CANDIDATO (si no existe)
    await db.query(
      'INSERT IGNORE INTO CANDIDATO (ci, cc, nombre, fecha_nacimiento) VALUES (?, ?, ?, ?)',
      [ci, cc, nombre, fecha_nacimiento]
    );

    // 2. Insertar en ES_PRESIDENTE o ES_VICEPRESIDENTE
    if (rol === 'presidente') {
      await db.query('INSERT INTO ES_PRESIDENTE (ci, nombre_partido) VALUES (?, NULL)', [ci]);
    } else if (rol === 'vicepresidente') {
      await db.query('INSERT INTO ES_VICEPRESIDENTE (ci, nombre_partido) VALUES (?, NULL)', [ci]);
    } else {
      return res.status(400).json({ error: 'Rol inválido: debe ser presidente o vicepresidente' });
    }

    // 3. Buscar o crear la lista por nombre
    let [rows] = await db.query('SELECT id_opcion FROM LISTA WHERE nombre = ?', [nombre_lista]);

    let id_opcion;
    if (rows.length > 0) {
      id_opcion = rows[0].id_opcion;
    } else {
      // Crear primero en OPCION
      const [opcionResult] = await db.query(
        'INSERT INTO OPCION (contexto) VALUES (?)',
        ['lista']
      );
      id_opcion = opcionResult.insertId;

      // Crear en LISTA
      await db.query(
        'INSERT INTO LISTA (id_opcion, nombre) VALUES (?, ?)',
        [id_opcion, nombre_lista]
      );
    }

    // 4. Insertar en CANDIDATO_LISTA
    await db.query(
      'INSERT INTO CANDIDATO_LISTA (id_candidato, id_opcion) VALUES (?, ?)',
      [ci, id_opcion]
    );

    res.status(201).json({ mensaje: 'Candidato registrado correctamente' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar el candidato' });
  }
});



// Eliminar candidato
router.delete('/:ci', async (req, res) => {
  const { ci } = req.params;
  try {
    await db.query('DELETE FROM ES_PRESIDENTE WHERE ci = ?', [ci]);
    await db.query('DELETE FROM ES_VICEPRESIDENTE WHERE ci = ?', [ci]);
    await db.query('DELETE FROM CANDIDATO WHERE ci = ?', [ci]);
    res.status(200).json({ mensaje: 'Candidato eliminado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el candidato' });
  }
});

module.exports = router;
