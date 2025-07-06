import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Papeletas from './components/Papeleta'; // Este archivo debe ser Papeleta.js
import Listas from './components/Listas';
import EstadoVotacion from './components/EstadoVotacion'; // 👉 Importación agregada
import Resultados from './components/Resultados';
import Partidos from './components/Partidos';
import Candidatos from './components/Candidatos';
import Agentes from './components/Agentes';


import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/login" />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/papeletas" element={<Papeletas />} />
        <Route path="/admin/listas" element={<Listas />} />
        <Route path="/admin/estado" element={<EstadoVotacion />} /> {/* 👉 Ruta nueva */}
        <Route path="/admin/resultados" element={<Resultados />} />
        <Route path="/admin/partidos" element={<Partidos />} />
        <Route path="/admin/candidatos" element={<Candidatos />} />
        <Route path="/admin/agentes" element={<Agentes />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
