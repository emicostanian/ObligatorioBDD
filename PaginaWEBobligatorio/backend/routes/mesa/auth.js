const express = require('express');
const router = express.Router();
const db = require('../../db'); // conexión con mysql2/promise

// Login de miembro de mesa
router.post('/login', async (req, res) => {
  const { ci, password } = req.body;

  if (!ci || !password) {
    return res.status(400).json({ error: 'Faltan credenciales.' });
  }

  try {
    const [results] = await db.query(
      'SELECT ci, password, id_circuito FROM MIEMBRO_DE_MESA WHERE ci = ?',
      [ci]
    );

    if (results.length === 0) {
      return res.status(401).json({ error: 'CI no registrado.' });
    }

    const user = results[0];
    if (user.password !== password) {
      return res.status(401).json({ error: 'Contraseña incorrecta.' });
    }

    res.json({ ci: user.ci, circuito: user.id_circuito });

  } catch (err) {
    console.error('🔴 Error en la consulta:', err);
    res.status(500).json({ error: 'Error en el servidor.' });
  }
});

module.exports = router;
