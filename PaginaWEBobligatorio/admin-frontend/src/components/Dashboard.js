import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <h1>Panel de Administración</h1>
      <p>Seleccione una opción:</p>

      <div className="dashboard-buttons">
        <button onClick={() => navigate('/admin/listas')}>Administrar Listas</button>
        <button onClick={() => navigate('/admin/papeletas')}>Administrar Papeletas</button>
        <button onClick={() => navigate('/admin/estado')}>Estado de la Votación</button>
        <button onClick={() => navigate('/admin/resultados')}>Ver Resultados</button>
        <button onClick={() => navigate('/admin/partidos')}>Administrar Partidos</button>
        <button onClick={() => navigate('/admin/candidatos')}>Administrar Candidatos</button>
        <button onClick={() => navigate('/admin/agentes')}>Administrar Agentes Policiales</button>
      </div>
    </div>
  );
}
