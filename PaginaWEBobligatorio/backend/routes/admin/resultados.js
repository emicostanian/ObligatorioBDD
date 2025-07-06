const express = require('express');
const router = express.Router();
const db = require('../../db');

// Obtener resultados por opción (con filtro opcional por departamento)
router.get('/', (req, res) => {
  const { departamento } = req.query;

  const sql = `
    SELECT 
      O.id_opcion,
      O.tipo,
      COUNT(V.id_voto) AS cantidad_votos,
      L.numero AS numero_lista,
      L.nombre_lista,
      L.departamento AS departamento_lista,
      P.tipo AS tipo_papeleta,
      P.color
    FROM OPCION O
    LEFT JOIN VOTO V ON O.id_opcion = V.id_opcion
    LEFT JOIN LISTA L ON O.id_opcion = L.id_opcion
    LEFT JOIN PAPELETA P ON O.id_opcion = P.id_opcion
    ${departamento ? 'WHERE L.departamento = ?' : ''}
    GROUP BY O.id_opcion
    ORDER BY cantidad_votos DESC
  `;

  const params = departamento ? [departamento] : [];

  db.query(sql, params, (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener resultados' });
    res.json(results);
  });
});


module.exports = router;
