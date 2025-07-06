import React, { useEffect, useState } from 'react';
import '../styles/Listas.css';

export default function Listas() {
  const [listas, setListas] = useState([]);
  const [partidos, setPartidos] = useState([]);
  const [nuevaLista, setNuevaLista] = useState({
    nombre_lista: '',
    numero: '',
    candidato_presidente: '',
    candidato_vicepresidente: '',
    organo: '',
    orden: '',
    departamento: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchListas();
    fetchPartidos();
  }, []);

  const fetchListas = async () => {
    try {
      const res = await fetch('http://localhost:3002/admin/listas');
      const data = await res.json();
      setListas(data);
    } catch (err) {
      setError('No se pudieron obtener las listas');
    }
  };

  const fetchPartidos = async () => {
    try {
      const res = await fetch('http://localhost:3002/admin/listas/partidos');
      const data = await res.json();
      setPartidos(data);
    } catch (err) {
      setError('No se pudieron obtener los partidos');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevaLista({ ...nuevaLista, [name]: value });
  };

  const agregarLista = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch('http://localhost:3002/admin/listas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevaLista)
      });
      const data = await res.json();
      if (res.ok) {
        fetchListas();
        setNuevaLista({
          nombre_lista: '',
          numero: '',
          candidato_presidente: '',
          candidato_vicepresidente: '',
          organo: '',
          orden: '',
          departamento: ''
        });
      } else {
        setError(data.error || 'Error al agregar lista');
      }
    } catch (err) {
      setError('Error al agregar lista');
    }
  };

  const eliminarLista = async (id_opcion) => {
    try {
      const res = await fetch(`http://localhost:3002/admin/listas/${id_opcion}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok) {
        fetchListas();
      } else {
        setError(data.error || 'No se pudo eliminar la lista');
      }
    } catch (err) {
      setError('Error al eliminar lista');
    }
  };

  return (
    <div className="listas-container">
      <button className="volver-btn" onClick={() => window.history.back()}>
        ⬅ Volver
      </button>

      <h2>Administrar Listas</h2>

      <form onSubmit={agregarLista} className="lista-form">
        <select
          name="nombre_lista"
          value={nuevaLista.nombre_lista}
          onChange={(e) => {
            const partidoSeleccionado = partidos.find(p => p.nombre === e.target.value);
            setNuevaLista({
              ...nuevaLista,
              nombre_lista: partidoSeleccionado?.nombre || '',
              candidato_presidente: partidoSeleccionado?.presidente || '',
              candidato_vicepresidente: partidoSeleccionado?.vicepresidente || ''
            });
          }}
          required
        >
          <option value="">Seleccionar partido</option>
          {partidos.map((p, idx) => (
            <option key={idx} value={p.nombre}>
              {p.nombre}
            </option>
          ))}
        </select>


        <input
          name="numero"
          placeholder="Número"
          value={nuevaLista.numero}
          onChange={handleInputChange}
          required
        />
        <input
          name="candidato_presidente"
          placeholder="Presidente"
          value={nuevaLista.candidato_presidente}
          readOnly
        />
        <input
          name="candidato_vicepresidente"
          placeholder="Vicepresidente"
          value={nuevaLista.candidato_vicepresidente}
          readOnly
        />
        <input
          name="organo"
          placeholder="Órgano"
          value={nuevaLista.organo}
          onChange={handleInputChange}
          required
        />
        <input
          name="orden"
          placeholder="Orden"
          value={nuevaLista.orden}
          onChange={handleInputChange}
          required
        />
        <input
          name="departamento"
          placeholder="Departamento"
          value={nuevaLista.departamento}
          onChange={handleInputChange}
          required
        />
        <button type="submit">Agregar</button>
      </form>

      {error && <p className="error">{error}</p>}

      <ul className="listas-list">
        {listas.map((l) => (
          <li key={l.id_opcion}>
            #{l.numero} - {l.nombre_lista} ({l.departamento})
            <button onClick={() => eliminarLista(l.id_opcion)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
