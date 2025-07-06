import React, { useState } from 'react';
import '../styles/TotemVotacion.css';

export default function TotemVotacion() {
  const [credencial, setCredencial] = useState('');
  const [votante, setVotante] = useState(null);
  const [opciones, setOpciones] = useState([]);
  const [selecciones, setSelecciones] = useState({});
  const [fase, setFase] = useState('inicio');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const verificarVotante = async () => {
    setCargando(true);
    setError('');
    try {
      const estadoRes = await fetch('http://localhost:3002/admin/estado');
      const estadoData = await estadoRes.json();

      if (!estadoRes.ok || estadoData.estado !== 'abierta') {
        setError('La votación aún no está habilitada.');
        setCargando(false);
        return;
      }

      const res = await fetch(`http://localhost:3002/totem/verificar/${credencial}`);
      const data = await res.json();

      if (res.ok) {
        if (data.yaVoto) {
          setError('Este votante ya ha emitido su voto.');
          return;
        }
        setVotante(data);

        const opcionesRes = await fetch('http://localhost:3002/totem/opciones');
        const opcionesData = await opcionesRes.json();

        if (Array.isArray(opcionesData)) {
          setOpciones(opcionesData);
          setFase('seleccion');
        } else {
          setError('Error al cargar las opciones.');
        }
      } else {
        setError(data.error || 'Error al verificar credencial.');
      }
    } catch (error) {
      console.error('Error al verificar credencial:', error);
      setError('Error de conexión. Verifique que el servidor esté funcionando.');
    } finally {
      setCargando(false);
    }
  };

  const opcionesPorContexto = opciones.reduce((acc, op) => {
    const ctx = op.contexto || 'n/a';
    if (!acc[ctx]) acc[ctx] = [];
    acc[ctx].push(op);
    return acc;
  }, {});

  const handleSeleccion = (contexto, opcion) => {
    setSelecciones((prev) => ({ ...prev, [contexto]: opcion }));
  };

  const confirmarVoto = async () => {
    setCargando(true);
    setError('');

    if (!votante || !votante.id_circuito || !votante.ci) {
      setError('Datos del votante incompletos');
      setCargando(false);
      return;
    }

    const circuito_emision = votante.id_circuito;
    const circuito_asignado = votante.id_circuito;
    const ci_votante = votante.ci;

    const opcionesSeleccionadas = Object.entries(selecciones).map(([contexto, op]) => ({
      id_opcion: op.id_opcion,
      tipo: op.tipo,
      contexto: contexto,
    }));

    if (opcionesSeleccionadas.length === 0) {
      setError('Debe seleccionar al menos una opción');
      setCargando(false);
      return;
    }

    const payload = {
      opciones: opcionesSeleccionadas,
      circuito_emision,
      circuito_asignado,
      ci_votante,
    };

    try {
      const res = await fetch('http://localhost:3002/totem/votar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setFase('final');
      } else {
        setError(data?.error || `Error del servidor (${res.status})`);
      }
    } catch (error) {
      console.error('Error de red:', error);
      setError('Error de conexión al registrar el voto.');
    } finally {
      setCargando(false);
    }
  };

  const reiniciar = () => {
    setCredencial('');
    setVotante(null);
    setOpciones([]);
    setSelecciones({});
    setFase('inicio');
    setError('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && credencial.trim() && !cargando) {
      verificarVotante();
    }
  };

  return (
    <div className="totem-container">
      <h1>Sistema de Votación Electoral</h1>
      <p>Gestión en tiempo real</p>

      {error && <p className="error-message">{error}</p>}

      {fase === 'inicio' && (
        <div className="card">
          <div className="form-group">
            <label>Número de Credencial:</label>
            <input
              type="text"
              value={credencial}
              onChange={e => setCredencial(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ingrese su número de credencial"
              disabled={cargando}
            />
          </div>
          <div className="button-container">
            <button
              onClick={verificarVotante}
              disabled={!credencial.trim() || cargando}
              className={cargando ? 'loading' : ''}
            >
              {cargando ? 'Verificando...' : 'Continuar'}
            </button>
          </div>
        </div>
      )}

      {fase === 'seleccion' && (
        <div className="card">
          <h2>Seleccione sus Opciones</h2>

          {['n/a', 'plebiscito', 'referendum'].map((contexto) => (
            <div key={contexto} className="form-group">
              <label>
                {contexto === 'n/a'
                  ? 'Lista Partidaria'
                  : contexto.charAt(0).toUpperCase() + contexto.slice(1)}
              </label>
              <select
                value={selecciones[contexto] ? JSON.stringify(selecciones[contexto]) : ''}
                onChange={(e) =>
                  handleSeleccion(contexto, e.target.value ? JSON.parse(e.target.value) : null)
                }
                disabled={
                  !(opcionesPorContexto[contexto] && opcionesPorContexto[contexto].length)
                }
              >
                {!(opcionesPorContexto[contexto] && opcionesPorContexto[contexto].length) ? (
                  <option value="">No hay opciones disponibles</option>
                ) : (
                  <>
                    <option value="">Seleccione una opción</option>
                    {opcionesPorContexto[contexto].map((op) => (
                      <option key={op.id_opcion} value={JSON.stringify(op)}>
                        {op.tipo === 'lista'
                          ? `Lista ${op.numero_lista} - ${op.nombre_lista}`
                          : `${op.tipo_papeleta} - ${op.color}`}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          ))}

          <div className="button-container">
            <button
              onClick={() => setFase('resumen')}
              disabled={Object.keys(selecciones).length === 0}
            >
              Revisar Selecciones
            </button>
            <button className="secondary" onClick={reiniciar}>
              Volver a empezar
            </button>
          </div>
        </div>
      )}

      {fase === 'resumen' && (
        <div className="card">
          <h2>Resumen del Voto</h2>
          <p><strong>Votante:</strong> {votante?.nombre} ({votante?.ci})</p>

          {Object.entries(selecciones).map(([ctx, op]) => (
            <div key={ctx}>
              <h4>{ctx === 'n/a' ? 'Lista Partidaria' : ctx.charAt(0).toUpperCase() + ctx.slice(1)}</h4>
              {op.tipo === 'lista' ? (
                <>
                  <p><strong>Lista:</strong> {op.numero_lista}</p>
                  <p><strong>Nombre:</strong> {op.nombre_lista}</p>
                  <p><strong>Órgano:</strong> {op.organo}</p>
                  <p><strong>Departamento:</strong> {op.departamento}</p>
                </>
              ) : (
                <>
                  <p><strong>Tipo de Papeleta:</strong> {op.tipo_papeleta}</p>
                  <p><strong>Color:</strong> {op.color}</p>
                </>
              )}
            </div>
          ))}

          <div className="button-container">
            <button onClick={confirmarVoto} disabled={cargando}>
              {cargando ? 'Registrando...' : 'Confirmar y Votar'}
            </button>
            <button className="secondary" onClick={() => setFase('seleccion')} disabled={cargando}>
              Modificar Selecciones
            </button>
            <button className="secondary" onClick={reiniciar}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      {fase === 'final' && (
        <div className="card success-message">
          <h2>¡Voto Registrado Exitosamente!</h2>
          <div className="button-container">
            <button onClick={reiniciar}>Nuevo Votante</button>
          </div>
        </div>
      )}
    </div>
  );
}
