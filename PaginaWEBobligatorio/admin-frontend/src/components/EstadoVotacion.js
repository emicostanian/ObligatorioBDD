import React, { useEffect, useState } from 'react';
import '../styles/EstadoVotacion.css'; // Si querés agregar estilos

export default function EstadoVotacion() {
  const [estado, setEstado] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEstado();
  }, []);

  const fetchEstado = async () => {
    try {
      const res = await fetch('http://localhost:3002/admin/estado');
      const data = await res.json();
      setEstado(data.estado);
    } catch (err) {
      setError('No se pudo obtener el estado de la votación');
    }
  };

  const cambiarEstado = async (nuevoEstado) => {
    setError('');
    setMensaje('');
    try {
      const res = await fetch('http://localhost:3002/admin/estado/set-estado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });

      const data = await res.json();
      if (res.ok) {
        setEstado(nuevoEstado);
        setMensaje(data.mensaje);
      } else {
        setError(data.error || 'Error al cambiar estado');
      }
    } catch (err) {
      setError('Error al cambiar estado');
    }
  };

  return (
    <div className="estado-container">
      <button className="volver-btn" onClick={() => window.history.back()}>
  ⬅ Volver
</button>

      <h2>Estado de la votación</h2>
      <p><strong>Estado actual:</strong> {estado}</p>

      <div className="botones-estado">
        <button onClick={() => cambiarEstado('abierta')} disabled={estado === 'abierta'}>
          Abrir votación
        </button>
        <button onClick={() => cambiarEstado('cerrada')} disabled={estado === 'cerrada'}>
          Cerrar votación
        </button>
      </div>
      

      {mensaje && <p className="mensaje">{mensaje}</p>}
      {error && <p className="error">{error}</p>}
    </div>
    
  );



}
