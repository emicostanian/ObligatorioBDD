import React, { useEffect, useState } from 'react';
import '../styles/Candidatos.css';

export default function Candidatos() {
  const [presidentes, setPresidentes] = useState([]);
  const [vicepresidentes, setVicepresidentes] = useState([]);
  const [nuevo, setNuevo] = useState({
    ci: '', cc: '', nombre: '', fecha_nacimiento: '', rol: 'presidente'
  });

  const obtenerCandidatos = async () => {
    const res = await fetch('http://localhost:3002/admin/candidatos');
    const data = await res.json();
    setPresidentes(data.presidentes || []);
    setVicepresidentes(data.vicepresidentes || []);
  };

  useEffect(() => { obtenerCandidatos(); }, []);

  const handleChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const crearCandidato = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3002/admin/candidatos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    });
    setNuevo({ ci: '', cc: '', nombre: '', fecha_nacimiento: '', rol: 'presidente' });
    obtenerCandidatos();
  };

  const eliminarCandidato = async (ci) => {
    await fetch(`http://localhost:3002/admin/candidatos/${ci}`, { method: 'DELETE' });
    obtenerCandidatos();
  };

  return (
    <div className="candidatos-container">
      <h2>Gestión de Candidatos</h2>

      <form onSubmit={crearCandidato} className="formulario">
        <input name="ci" value={nuevo.ci} onChange={handleChange} placeholder="CI" required />
        <input name="cc" value={nuevo.cc} onChange={handleChange} placeholder="Credencial Cívica" required />
        <input name="nombre" value={nuevo.nombre} onChange={handleChange} placeholder="Nombre completo" required />
        <input type="date" name="fecha_nacimiento" value={nuevo.fecha_nacimiento} onChange={handleChange} required />
        <select name="rol" value={nuevo.rol} onChange={handleChange}>
          <option value="presidente">Presidente</option>
          <option value="vicepresidente">Vicepresidente</option>
        </select>
        <button type="submit">Crear Candidato</button>
      </form>

      <h3>Candidatos a Presidente</h3>
      <ul className="lista">
        {presidentes.map((c) => (
          <li key={c.ci}>
            {c.nombre} – CI: {c.ci}
            <button onClick={() => eliminarCandidato(c.ci)}>Eliminar</button>
          </li>
        ))}
      </ul>

      <h3>Candidatos a Vicepresidente</h3>
      <ul className="lista">
        {vicepresidentes.map((c) => (
          <li key={c.ci}>
            {c.nombre} – CI: {c.ci}
            <button onClick={() => eliminarCandidato(c.ci)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
