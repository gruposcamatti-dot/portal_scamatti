import React, { useState, useEffect } from 'react';
import { auth, loginComEmailSenha, fazerLogout } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  
  // Estados para o formulário
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  useEffect(() => {
    const cancelarInscricao = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      setCarregando(false);
    });
    return () => cancelarInscricao();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault(); // Impede a página de recarregar
    setErro(''); // Limpa erros antigos
    try {
      await loginComEmailSenha(email, senha);
      // Se der certo, o useEffect acima vai detetar e mudar a tela automaticamente
    } catch (error) {
      console.error(error);
      setErro("Email ou senha incorretos.");
    }
  };

  const sistemas = [
    { 
      id: 1,
      nome: 'Fechamento de Custos', 
      descricao: 'Gestão financeira e relatórios',
      url: 'https://seusistema-custos.vercel.app', 
      cor: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    { 
      id: 2,
      nome: 'Gestão de Máquinas', 
      descricao: 'Controle de frota e manutenção',
      url: 'https://seusistema-maquinas.web.app', 
      cor: 'linear-gradient(135deg, #f09819 0%, #edde5d 100%)'
    },
  ];

  if (carregando) return <div className="loading-screen">Carregando...</div>;

  // -- TELA DE LOGIN (Formulário) --
  if (!usuario) {
    return (
      <div className="app-container login-bg">
        <div className="login-card">
          <h1 className="logo-text">SCAMATTI <span className="logo-highlight">HUB</span></h1>
          <p className="login-subtitle">Acesso Restrito Corporativo</p>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <input 
                type="email" 
                placeholder="Email corporativo" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="input-field"
              />
            </div>
            <div className="input-group">
              <input 
                type="password" 
                placeholder="Senha" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required 
                className="input-field"
              />
            </div>

            {erro && <p className="error-msg">{erro}</p>}

            <button type="submit" className="btn-login">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  // -- TELA DA PLATAFORMA (Igual à anterior) --
  return (
    <div className="app-container dashboard-bg">
      <header className="navbar">
        <div className="brand">
          SCAMATTI <span className="brand-highlight">HUB</span>
        </div>
        <div className="user-profile">
          <div className="user-info">
            {/* Se o email tiver nome (ex: joao@...), mostramos a parte antes do @ */}
            <span className="user-name">{usuario.email.split('@')[0].toUpperCase()}</span>
            <span className="user-email">{usuario.email}</span>
          </div>
          <div className="avatar-placeholder">{usuario.email[0].toUpperCase()}</div>
          <button onClick={fazerLogout} className="btn-logout" title="Sair">Sair</button>
        </div>
      </header>

      <main className="main-content">
        <h2 className="welcome-title">Bem-vindo ao Hub! 🚀</h2>
        <p className="welcome-subtitle">Painel de acesso aos sistemas internos.</p>

        <div className="systems-grid">
          {sistemas.map((sis) => (
            <a key={sis.id} href={sis.url} target="_blank" rel="noreferrer" className="system-card">
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
        &copy; {new Date().getFullYear()} Grupo Scamatti. Acesso Restrito.
      </footer>
    </div>
  );
}

export default App;