import React, { useEffect, useState } from 'react';
import '../styles/Partidos.css';

export default function Partidos() {
  const [partidos, setPartidos] = useState([]);
  const [nuevoPartido, setNuevoPartido] = useState({
    nombre: '',
    direccion_sede: '',
    presidente: '',
    vicepresidente: '',
  });
  const [candidatos, setCandidatos] = useState({ presidentes: [], vicepresidentes: [] });
  const [error, setError] = useState('');

  useEffect(() => {
    obtenerPartidos();
    obtenerCandidatos();
  }, []);

  const obtenerPartidos = async () => {
    try {
      const res = await fetch('http://localhost:3002/admin/partidos');
      const data = await res.json();
      setPartidos(data);
    } catch (err) {
      setError('No se pudieron obtener los partidos');
    }
  };

  const obtenerCandidatos = async () => {
    try {
      const res = await fetch('http://localhost:3002/admin/candidatos');
      const data = await res.json();
      setCandidatos(data);
    } catch (err) {
      setError('No se pudieron obtener los candidatos');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoPartido({ ...nuevoPartido, [name]: value });
  };

  const crearPartido = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3002/admin/partidos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoPartido),
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error desconocido');

      obtenerPartidos();
      setNuevoPartido({ nombre: '', direccion_sede: '', presidente: '', vicepresidente: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminarPartido = async (nombre) => {
    try {
      await fetch(`http://localhost:3002/admin/partidos/${nombre}`, { method: 'DELETE' });
      obtenerPartidos();
    } catch (err) {
      setError('No se pudo eliminar el partido');
    }
  };

  return (
    <div className="partidos-container">
      <h2>Administrar Partidos</h2>

      <form onSubmit={crearPartido} className="formulario-partido">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del partido"
          value={nuevoPartido.nombre}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="direccion_sede"
          placeholder="Dirección de la sede"
          value={nuevoPartido.direccion_sede}
          onChange={handleInputChange}
          required
        />

        <select
          name="presidente"
          value={nuevoPartido.presidente}
          onChange={handleInputChange}
          required
        >
          <option value="">Seleccione presidente</option>
          {(candidatos.presidentes || []).map((c) => (
            <option key={c.ci} value={c.ci}>
              {c.nombre} ({c.ci})
            </option>
          ))}
        </select>

        <select
          name="vicepresidente"
          value={nuevoPartido.vicepresidente}
          onChange={handleInputChange}
          required
        >
          <option value="">Seleccione vicepresidente</option>
          {(candidatos.vicepresidentes || []).map((c) => (
            <option key={c.ci} value={c.ci}>
              {c.nombre} ({c.ci})
            </option>
          ))}
        </select>

        <button type="submit">Agregar Partido</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="lista-partidos">
        {Array.isArray(partidos) &&
          partidos.map((p) => (
            <li key={p.nombre}>
              <strong>{p.nombre}</strong> – {p.direccion_sede}
              <br />
              Presidente: {p.presidente} | Vicepresidente: {p.vicepresidente}
              <button onClick={() => eliminarPartido(p.nombre)}>Eliminar</button>
            </li>
          ))}
      </ul>
    </div>
  );
}
