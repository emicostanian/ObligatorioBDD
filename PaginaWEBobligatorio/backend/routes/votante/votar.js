const express = require('express');
const router = express.Router();
const db = require('../../db');

// ✅ Obtener opciones desde LISTA y PAPELETA
router.get('/opciones', async (req, res) => {
  const sql = `
    SELECT 
      o.id_opcion, o.tipo, o.contexto,
      l.numero AS numero_lista, l.nombre_lista, l.organo, l.departamento,
      p.tipo AS tipo_papeleta, p.color
    FROM OPCION o
    LEFT JOIN LISTA l ON o.id_opcion = l.id_opcion
    LEFT JOIN PAPELETA p ON o.id_opcion = p.id_opcion
  `;

  try {
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    console.error('❌ Error al obtener opciones:', err);
    res.status(500).json({ error: 'Error en la base de datos al obtener opciones' });
  }
});

// ✅ Verificar votante por credencial (usando columna `cc`)
router.get('/verificar/:credencial', async (req, res) => {
  const { credencial } = req.params;
  console.log('🟡 Verificando credencial:', credencial);

  const sql = `
    SELECT v.*, r.ci AS yaVoto 
    FROM VOTANTE v
    LEFT JOIN REGISTRO_DE_VOTACION r ON v.ci = r.ci
    WHERE v.cc = ?
  `;

  try {
    const [rows] = await db.query(sql, [credencial]);

    if (!rows || rows.length === 0) {
      console.warn('❌ Credencial no encontrada:', credencial);
      return res.status(404).json({ error: 'Credencial no encontrada' });
    }

    const votante = rows[0];
    const respuesta = {
      nombre: votante.nombre,
      ci: votante.ci,
      id_circuito: votante.id_circuito,
      yaVoto: !!votante.yaVoto,
    };

    console.log('✅ Votante verificado:', respuesta);
    res.json(respuesta);

  } catch (err) {
    console.error('❌ Error al verificar votante:', err);
    res.status(500).json({ error: 'Error en la base de datos al verificar la credencial' });
  }
});

// ✅ Registrar voto
router.post('/votar', async (req, res) => {
  console.log('=== INICIO PROCESO DE VOTACIÓN ===');
  console.log('Datos recibidos:', JSON.stringify(req.body, null, 2));

  const { opciones, circuito_emision, circuito_asignado, ci_votante } = req.body;

  if (!Array.isArray(opciones) || opciones.length === 0) {
    return res.status(400).json({ error: 'No se proporcionaron votos válidos' });
  }

  if (!circuito_emision || !circuito_asignado || !ci_votante) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const [yaVoto] = await db.query(
      'SELECT * FROM REGISTRO_DE_VOTACION WHERE ci = ?',
      [ci_votante]
    );

    if (yaVoto.length > 0) {
      return res.status(400).json({ error: 'Este votante ya ha emitido su voto' });
    }

    const es_observado = circuito_emision !== circuito_asignado;

    const inserts = opciones.map((voto) => {
      const valores = [
        voto.id_opcion,
        voto.tipo,
        voto.contexto || 'n/a',
        es_observado,
        circuito_emision,
      ];

      const sql = `
        INSERT INTO VOTO 
        (id_opcion, tipo, contexto, es_observado, fecha, hora, circuito_emision) 
        VALUES (?, ?, ?, ?, CURDATE(), CURTIME(), ?)
      `;

      return db.query(sql, valores);
    });

    await Promise.all(inserts);

    await db.query(
      'INSERT INTO REGISTRO_DE_VOTACION (ci, fecha) VALUES (?, CURDATE())',
      [ci_votante]
    );

    res.json({ mensaje: 'Voto registrado correctamente' });

  } catch (err) {
    console.error('❌ Error durante el registro del voto:', err);
    res.status(500).json({ error: 'Error en el registro del voto', detalle: err.message });
  }
});

module.exports = router;
