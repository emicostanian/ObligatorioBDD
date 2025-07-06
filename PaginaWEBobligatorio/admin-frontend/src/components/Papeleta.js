import React, { useEffect, useState } from 'react';
import '../styles/Papeleta.css';

export default function Papeletas() {
  const [papeletas, setPapeletas] = useState([]);
  const [nuevaPapeleta, setNuevaPapeleta] = useState({
    color: '',
    descripcion: '',
    contexto: 'plebiscito',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPapeletas();
  }, []);

  const fetchPapeletas = async () => {
    try {
      const res = await fetch('http://localhost:3002/admin/papeletas');
      const data = await res.json();
      setPapeletas(data);
    } catch (err) {
      setError('No se pudieron obtener las papeletas');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaPapeleta({ ...nuevaPapeleta, [name]: value });
  };

  const agregarPapeleta = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3002/admin/papeletas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nuevaPapeleta, tipo: 'papeleta' }) // fijo
      });
      const data = await res.json();
      if (res.ok) {
        fetchPapeletas();
        setNuevaPapeleta({ color: '', descripcion: '', contexto: 'plebiscito' });
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Error al agregar papeleta');
    }
  };

  const eliminarPapeleta = async (id) => {
    try {
      const res = await fetch(`http://localhost:3002/admin/papeletas/${id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        fetchPapeletas();
      } else {
        setError(data.error || 'No se pudo eliminar la papeleta');
      }
    } catch (err) {
      setError('Error al eliminar papeleta');
    }
  };

  return (
    <div className="papeletas-container">
      <button className="volver-btn" onClick={() => window.history.back()}>
  ⬅ Volver
</button>

      <h2>Administrar Papeletas</h2>

      <form onSubmit={agregarPapeleta} className="papeleta-form">
        <input
          type="text"
          name="color"
          placeholder="Color"
          value={nuevaPapeleta.color}
          onChange={handleInputChange}
          required
        />
        <input
          type="text"
          name="descripcion"
          placeholder="Descripción"
          value={nuevaPapeleta.descripcion}
          onChange={handleInputChange}
          required
        />
        <label>Contexto:</label>
        <select
          name="contexto"
          value={nuevaPapeleta.contexto}
          onChange={handleInputChange}
          className="select-dropdown"
          required
        >
          <option value="plebiscito">Plebiscito</option>
          <option value="referendum">Referéndum</option>
        </select>
        <button type="submit">Agregar</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="papeletas-list">
        {papeletas.map((p) => (
          <li key={p.id_opcion}>
            #{p.id_opcion} - {p.tipo} ({p.color}) - <strong>{p.contexto}</strong>
            <button onClick={() => eliminarPapeleta(p.id_opcion)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
