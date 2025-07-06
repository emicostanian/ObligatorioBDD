import React, { useState } from 'react';
import '../styles/LoginMesa.css';

function LoginMesa({ onLogin }) {
  const [ci, setCi] = useState('');
  const [password, setPassword] = useState('');
  const [circuito, setCircuito] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:3002/mesa/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ci, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error desconocido');
        return;
      }

      // Guardamos el CI y el circuito ingresado manualmente
      onLogin({ ci: data.ci, circuito });
    } catch (err) {
      setError('Error al conectar con el servidor');
    }
  };

  return (
    <div className="login-mesa-container">
      <h2>Login Miembro de Mesa</h2>
      <form onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Cédula"
          value={ci}
          onChange={(e) => setCi(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Circuito de la mesa"
          value={circuito}
          onChange={(e) => setCircuito(e.target.value)}
          required
        />
        <button type="submit">Ingresar</button>
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}

export default LoginMesa;
