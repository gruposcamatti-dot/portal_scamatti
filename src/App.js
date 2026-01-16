import React, { useState, useEffect } from 'react';
import { auth, loginComGoogle, fazerLogout } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import './App.css'; // Importamos o novo CSS

function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    const cancelarInscricao = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });
    return () => cancelarInscricao();
  }, []);

  const sistemas = [
    { 
      id: 1,
      nome: 'Fechamento de Custos', 
      descricao: 'Gestão financeira e relatórios',
      url: 'https://fechamento-custos-scamatti.vercel.app/', 
      cor: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)' // Gradiente Verde
    },
    { 
      id: 2,
      nome: 'Gestão de Máquinas', 
      descricao: 'Controle de frota e manutenção',
      url: 'https://sistema-maquinas-1b76c.web.app/', 
      cor: 'linear-gradient(135deg, #f09819 0%, #edde5d 100%)' // Gradiente Laranja
    },
  ];

  if (carregando) return <div className="loading-screen">Carregando...</div>;

  // -- TELA DE LOGIN --
  if (!usuario) {
    return (
      <div className="app-container login-bg">
        <div className="login-card">
          <h1 className="logo-text">SCAMATTI <span className="logo-highlight">PLATFORM</span></h1>
          <p className="login-subtitle">Acesso centralizado aos sistemas internos</p>
          <button onClick={loginComGoogle} className="btn-login">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" width="20" />
            Entrar com Google
          </button>
        </div>
      </div>
    );
  }

  // -- TELA DA PLATAFORMA --
  return (
    <div className="app-container dashboard-bg">
      <header className="navbar">
        <div className="brand">
          SCAMATTI <span className="brand-highlight">HUB</span>
        </div>
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{usuario.displayName}</span>
            <span className="user-email">{usuario.email}</span>
          </div>
          {usuario.photoURL && <img src={usuario.photoURL} alt="Perfil" className="avatar" />}
          <button onClick={fazerLogout} className="btn-logout" title="Sair">
            Sair
          </button>
        </div>
      </header>

      <main className="main-content">
        <h2 className="welcome-title">Bem-vindo de volta! 👋</h2>
        <p className="welcome-subtitle">Selecione o sistema que deseja acessar hoje.</p>

        <div className="systems-grid">
          {sistemas.map((sis) => (
            <a
              key={sis.id}
              href={sis.url}
              target="_blank"
              rel="noreferrer"
              className="system-card"
            >
              <div className="card-header" style={{ background: sis.cor }}></div>
              <div className="card-body">
                <h3>{sis.nome}</h3>
                <p>{sis.descricao}</p>
                <span className="btn-access">Acessar Sistema &rarr;</span>
              </div>
            </a>
          ))}
        </div>
      </main>
      
      <footer className="footer">
        &copy; {new Date().getFullYear()} Grupo Scamatti. Todos os direitos reservados.
      </footer>
    </div>
  );
}

export default App;