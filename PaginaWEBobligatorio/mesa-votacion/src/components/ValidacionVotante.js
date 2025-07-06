import React, { useState } from 'react';
import '../styles/ValidacionVotante.css';

export default function ValidacionVotante({ user }) {
  const [cc, setCc] = useState('');
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState('');

  const handleValidar = async () => {
    setError('');
    setResultado(null);

    try {
      const res = await fetch('http://localhost:3002/mesa/validar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cc,
          circuito_mesa: user.circuito
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error desconocido.');
      } else {
        setResultado(data);
      }
    } catch (err) {
      setError('Error al validar votante.');
    }
  };

  return (
    <div className="validar-votante-container">
      <h2>Validar Votante</h2>
      <div className="form">
        <input
          type="text"
          placeholder="Número de credencial"
          value={cc}
          onChange={(e) => setCc(e.target.value)}
        />
        <button onClick={handleValidar}>Validar</button>
      </div>

      {error && <p className="error">{error}</p>}

      {resultado && (
        <div className="resultado">
          <p><strong>Nombre:</strong> {resultado.nombre}</p>
          <p><strong>Circuito asignado:</strong> {resultado.circuitoAsignado}</p>
          <p><strong>¿Ya votó?:</strong> {resultado.yaVoto ? 'Sí' : 'No'}</p>
          <p><strong>¿Puede votar?:</strong> {resultado.yaVoto ? 'No' : 'Sí'}</p>
          {!resultado.yaVoto && resultado.votoObservado && (
            <p className="observado">⚠️ El voto será observado (circuito distinto).</p>
          )}
        </div>
      )}
    </div>
  );
}
