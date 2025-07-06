const express = require('express');
const router = express.Router();

let estadoVotacion = 'cerrada';

router.get('/', (req, res) => {
  res.json({ estado: estadoVotacion });
});

router.post('/set-estado', (req, res) => {
  const { estado } = req.body;
  if (!estado || (estado !== 'abierta' && estado !== 'cerrada')) {
    return res.status(400).json({ error: 'Estado inválido' });
  }

  estadoVotacion = estado;
  res.json({ mensaje: `Estado cambiado a "${estadoVotacion}"` });
});

module.exports = router;
