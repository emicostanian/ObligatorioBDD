import React, { useEffect, useState } from 'react';
import '../styles/Resultados.css';

export default function Resultados() {
  const [resultados, setResultados] = useState([]);
  const [error, setError] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [departamentos, setDepartamentos] = useState([]);

  useEffect(() => {
    fetchResultados();
  }, []);

  const fetchResultados = async (dep = '') => {
    try {
      const url = dep ? `http://localhost:3002/admin/resultados?departamento=${dep}` : `http://localhost:3002/admin/resultados`;
      const res = await fetch(url);
      const data = await res.json();
      setResultados(data);

      // Extraer departamentos únicos de las listas si no estaban cargados
      const unicos = [...new Set(data.map(r => r.departamento_lista).filter(Boolean))];
      setDepartamentos(unicos);
    } catch (err) {
      setError('No se pudieron cargar los resultados');
    }
  };

  const handleFiltro = (e) => {
    const valor = e.target.value;
    setDepartamento(valor);
    fetchResultados(valor);
  };

  return (
    <div className="resultados-container">
      <button className="volver-btn" onClick={() => window.history.back()}>
  ⬅ Volver
</button>

      <h2>Resultados de la votación</h2>

      <div className="filtro-container">
        <label>Filtrar por departamento:</label>
        <select value={departamento} onChange={handleFiltro}>
          <option value="">Todos</option>
          {departamentos.map(dep => (
            <option key={dep} value={dep}>{dep}</option>
          ))}
        </select>
      </div>

      {error && <p className="error">{error}</p>}
      <ul className="resultados-lista">
        {resultados.map((r) => (
          <li key={r.id_opcion}>
            {r.tipo === 'lista' ? (
              <span>📋 Lista #{r.numero_lista} - {r.nombre_lista}</span>
            ) : (
              <span>🗳️ {r.tipo_papeleta} ({r.color})</span>
            )}
            <strong> → {r.cantidad_votos} voto(s)</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
