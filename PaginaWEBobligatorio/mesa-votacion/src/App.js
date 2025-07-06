import React, { useState } from 'react';
import LoginMesa from './components/LoginMesa';
import ValidacionVotante from './components/ValidacionVotante';

function App() {
  const [user, setUser] = useState(null);

  return (
    <div>
      {user ? (
        <>
          <h3>Bienvenido, miembro del circuito {user.circuito}</h3>
          <ValidacionVotante user={user} />
        </>
      ) : (
        <LoginMesa onLogin={setUser} />
      )}
    </div>
  );
}

export default App;
