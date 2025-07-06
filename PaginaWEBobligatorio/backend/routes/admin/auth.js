const express = require('express');
const router = express.Router();
const db = require('../../db'); // conexión a la base de datos

console.log('📦 auth.js cargado');

// Ruta POST /admin/auth/login
router.post('/login', async (req, res) => {
  console.log('📦 arranca el login');
  const { usuario, contrasena } = req.body;

  console.log('🟢 POST /login recibido');
  console.log('Usuario:', usuario);
  console.log('Contraseña:', contrasena);

  try {
    const sql = 'SELECT * FROM ADMIN WHERE usuario = ? AND contrasena = ?';
    const [results] = await db.query(sql, [usuario, contrasena]); // ✅ usar async/await

    if (results.length === 0) {
      console.log('🔒 Credenciales inválidas');
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    console.log('✅ Login exitoso');
    res.json({ mensaje: 'Login exitoso' });
  } catch (err) {
    console.error('🔴 Error en query:', err);
    res.status(500).json({ error: 'Error al verificar usuario' });
  }
});

module.exports = router;
