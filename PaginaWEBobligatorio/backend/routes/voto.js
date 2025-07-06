const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  const sql = `
    SELECT 
      V.id_voto,
      V.tipo,
      V.es_observado,
      V.fecha,
      V.hora,
      O.tipo AS tipo_opcion,
      O.descripcion,
      L.numero AS numero_lista,
      L.nombre_lista,
      L.organo,
      L.orden,
      L.departamento,
      L.candidato_presidente,
      L.candidato_vicepresidente,
      P.tipo AS tipo_papeleta,
      P.color
    FROM VOTO V
    JOIN OPCION O ON V.id_opcion = O.id_opcion
    LEFT JOIN LISTA L ON O.id_opcion = L.id_opcion
    LEFT JOIN PAPELETA P ON O.id_opcion = P.id_papeleta
    ORDER BY V.id_voto DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error al obtener votos:', err);
      return res.status(500).json({ error: 'Error al obtener votos' });
    }
    res.json(results);
  });
});

module.exports = router;
