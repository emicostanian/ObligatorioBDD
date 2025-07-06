const express = require('express');
const router = express.Router();
const db = require('../../db');

// Validar votante por número de credencial cívica
router.post('/', async (req, res) => {
  const { cc, circuito_mesa } = req.body;

  if (!cc || !circuito_mesa) {
    return res.status(400).json({ error: 'Faltan datos.' });
  }

  const query = `
    SELECT V.ci, V.nombre, V.id_circuito,
      CASE WHEN EXISTS (
        SELECT 1 FROM REGISTRO_DE_VOTACION R
        WHERE R.ci = V.ci
      ) THEN 1 ELSE 0 END AS ya_voto
    FROM VOTANTE V
    WHERE V.cc = ?
  `;

  try {
    const [results] = await db.query(query, [cc]);

    if (results.length === 0) {
      return res.status(404).json({ error: 'Votante no encontrado.' });
    }

    const votante = results[0];
    const puedeVotar = votante.id_circuito === circuito_mesa && votante.ya_voto === 0;

    res.json({
      nombre: votante.nombre,
      circuitoAsignado: votante.id_circuito,
      yaVoto: Boolean(votante.ya_voto),
      puedeVotar,
      votoObservado: votante.id_circuito !== circuito_mesa
    });

  } catch (err) {
    console.error('❌ Error al validar votante:', err);
    res.status(500).json({ error: 'Error al validar votante.' });
  }
});

module.exports = router;
