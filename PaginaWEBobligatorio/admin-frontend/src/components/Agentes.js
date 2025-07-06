import React, { useEffect, useState } from 'react';
import '../styles/Agentes.css';

export default function Agentes() {
  const [agentes, setAgentes] = useState([]);
  const [nuevo, setNuevo] = useState({
    ci: '', cc: '', nombre: '', fecha_nacimiento: '', comisaria: '', id_circuito: ''
  });

  const obtenerAgentes = async () => {
    const res = await fetch('http://localhost:3002/admin/agentes');
    const data = await res.json();
    setAgentes(data);
  };

  useEffect(() => { obtenerAgentes(); }, []);

  const handleChange = (e) => {
    setNuevo({ ...nuevo, [e.target.name]: e.target.value });
  };

  const crearAgente = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3002/admin/agentes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevo)
    });
    setNuevo({ ci: '', cc: '', nombre: '', fecha_nacimiento: '', comisaria: '', id_circuito: '' });
    obtenerAgentes();
  };

  const eliminarAgente = async (ci) => {
    await fetch(`http://localhost:3002/admin/agentes/${ci}`, { method: 'DELETE' });
    obtenerAgentes();
  };

  return (
    <div className="agentes-container">
      <h2>Gestión de Agentes Policiales</h2>
      <form onSubmit={crearAgente} className="formulario">
        <input name="ci" value={nuevo.ci} onChange={handleChange} placeholder="CI" required />
        <input name="cc" value={nuevo.cc} onChange={handleChange} placeholder="Credencial Cívica" required />
        <input name="nombre" value={nuevo.nombre} onChange={handleChange} placeholder="Nombre completo" required />
        <input type="date" name="fecha_nacimiento" value={nuevo.fecha_nacimiento} onChange={handleChange} required />
        <input name="comisaria" value={nuevo.comisaria} onChange={handleChange} placeholder="Comisaría" required />
        <input name="id_circuito" value={nuevo.id_circuito} onChange={handleChange} placeholder="ID del circuito" required />
        <button type="submit">Crear Agente</button>
      </form>

      <ul className="lista">
        {agentes.map((a) => (
          <li key={a.ci}>
            {a.nombre} – CI: {a.ci}, Circuito: {a.id_circuito}
            <button onClick={() => eliminarAgente(a.ci)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}