const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas existentes
const votoRoutes = require('./routes/voto');
const registrarVotoRoutes = require('./routes/registrarVoto');
const votarRoutes = require('./routes/votante/votar');

// Rutas del admin
const listasRoutes = require('./routes/admin/listas');
const papeletasRoutes = require('./routes/admin/papeletas');
const estadoRoutes = require('./routes/admin/estado');
const authAdminRoutes = require('./routes/admin/auth');
const resultadosRoutes = require('./routes/admin/resultados');
const partidosRoutes = require('./routes/admin/partidos');
const candidatosRoutes = require('./routes/admin/candidatos');
const agentesRoutes = require('./routes/admin/agentes');

// Rutas del miembro de mesa
const mesaAuthRoutes = require('./routes/mesa/auth');
const mesaValidarRoutes = require('./routes/mesa/validar');

// Montar rutas principales
app.use('/votos', votoRoutes);
app.use('/registro', registrarVotoRoutes);
app.use('/totem', votarRoutes);

// Admin
app.use('/admin/listas', listasRoutes);
app.use('/admin/papeletas', papeletasRoutes);
app.use('/admin/auth', authAdminRoutes);
app.use('/admin/estado', estadoRoutes);
app.use('/admin/resultados', resultadosRoutes);
app.use('/admin/partidos', partidosRoutes);
app.use('/admin/candidatos', candidatosRoutes);
app.use('/admin/agentes', agentesRoutes);

// Miembro de mesa
app.use('/mesa/auth', mesaAuthRoutes);
app.use('/mesa/validar', mesaValidarRoutes);

// Puerto
const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
