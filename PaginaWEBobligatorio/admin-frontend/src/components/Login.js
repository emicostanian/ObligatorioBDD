import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';

export default function Login() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const manejarLogin = async (e) => {
    e.preventDefault(); // 👉 importante si usás <form>
    console.log("Intentando loguear con:", usuario, contrasena); // 👉 para verificar si se ejecuta

    setError('');

    try {
      const res = await fetch('http://localhost:3002/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, contrasena })
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Login exitoso");
        navigate('/admin/dashboard');
      } else {
        console.log("Login fallido:", data);
        setError(data.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      console.error("Error de conexión:", err);
      setError('No se pudo conectar con el servidor');
    }
  };

  return (
    <div className="login-container">
      <h1>Panel Administrativo</h1>

      {/* 🟡 Alternativa 1: usando <form> + onSubmit */}
      <form onSubmit={manejarLogin} className="login-form">
        <label>Usuario</label>
        <input
          type="text"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Ingresar</button>
      </form>

      
    </div>
  );
}
