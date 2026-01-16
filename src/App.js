// src/App.js
import React, { useState, useEffect } from 'react';
import { auth, loginComGoogle, fazerLogout } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

// --- ESTILOS (Podes mover para um ficheiro CSS depois) ---
const estilos = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f4f6f8',
    fontFamily: 'Segoe UI, sans-serif',
  },
  cardLogin: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  botaoLogin: {
    padding: '12px 24px',
    backgroundColor: '#4285F4', // Azul Google
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '20px',
  },
  gridSistemas: {
    display: 'flex',
    gap: '30px',
    marginTop: '40px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  sistemaCard: {
    width: '220px',
    height: '160px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    color: '#333',
    transition: 'transform 0.2s',
    border: '1px solid #e1e1e1',
    cursor: 'pointer'
  },
  logoutBtn: {
    marginTop: '50px',
    padding: '8px 16px',
    backgroundColor: '#ff5252',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Monitoriza se o utilizador está logado ou não
  useEffect(() => {
    const cancelarInscricao = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });
    return () => cancelarInscricao();
  }, []);

  // Lista dos teus sistemas
  const sistemas = [
    { nome: 'Fechamento Custos', url: 'https://link-do-seu-vercel.app', cor: '#4CAF50' },
    { nome: 'Gestão de Máquinas', url: 'https://link-do-seu-firebase.app', cor: '#FF9800' },
  ];

  if (carregando) return <p>A carregar...</p>;

  // -- TELA DE LOGIN (Se não estiver logado) --
  if (!usuario) {
    return (
      <div style={estilos.container}>
        <div style={estilos.cardLogin}>
          <h1>Plataforma Scamatti</h1>
          <p>Faça login para aceder aos sistemas internos.</p>
          <button onClick={loginComGoogle} style={estilos.botaoLogin}>
            Entrar com Google
          </button>
        </div>
      </div>
    );
  }

  // -- TELA DO DASHBOARD (Se estiver logado) --
  return (
    <div style={estilos.container}>
      <h2>Olá, {usuario.displayName}!</h2>
      <p>Selecione um sistema para começar:</p>

      <div style={estilos.gridSistemas}>
        {sistemas.map((sis, index) => (
          <a
            key={index}
            href={sis.url}
            target="_blank"
            rel="noreferrer"
            style={estilos.sistemaCard}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div style={{ width: '40px', height: '40px', backgroundColor: sis.cor, borderRadius: '50%', marginBottom: '15px' }}></div>
            <strong>{sis.nome}</strong>
          </a>
        ))}
      </div>

      <button onClick={fazerLogout} style={estilos.logoutBtn}>Sair da Plataforma</button>
    </div>
  );
}

export default App;