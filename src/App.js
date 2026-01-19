import React, { useState, useEffect } from 'react';
import { auth, loginComEmailSenha, fazerLogout, db } from './firebaseConfig'; // Importamos o db
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore'; // Ferramentas para ler o banco
import './App.css';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [permissoes, setPermissoes] = useState([]); // Estado para guardar o que ele pode ver
  
  // Login States
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  // LISTA DE TODOS OS SISTEMAS (Note os IDs novos: 'custos' e 'maquinas')
  const todosSistemas = [
    { 
      id: 'custos', // Este ID tem de ser igual ao que escreveste no banco de dados
      nome: 'Fechamento de Custos', 
      descricao: 'Gestão financeira e relatórios',
      url: 'https://fechamento-custos-scamatti.vercel.app/', 
      cor: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)'
    },
    { 
      id: 'maquinas', // Este ID tem de ser igual ao que escreveste no banco de dados
      nome: 'Gestão de Máquinas', 
      descricao: 'Controle de frota e manutenção',
      url: 'https://sistema-maquinas-1b76c.web.app/', 
      cor: 'linear-gradient(135deg, #f09819 0%, #edde5d 100%)'
    },
  ];

  useEffect(() => {
    const cancelarInscricao = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUsuario(user);
        // BUSCAR PERMISSÕES NO BANCO DE DADOS
        try {
          const docRef = doc(db, "usuarios", user.email);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            // Se o utilizador existe no banco, pega as permissões dele
            setPermissoes(docSnap.data().permissoes);
          } else {
            // Se ele logou mas não tem ficha no banco, não vê nada
            setPermissoes([]);
          }
        } catch (error) {
          console.error("Erro ao buscar permissões:", error);
        }
      } else {
        setUsuario(null);
        setPermissoes([]);
      }
      setCarregando(false);
    });
    return () => cancelarInscricao();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    try {
      await loginComEmailSenha(email, senha);
    } catch (error) {
      console.error(error);
      setErro("Email ou senha incorretos.");
    }
  };

  // Filtra os sistemas baseados na permissão
  const sistemasVisiveis = todosSistemas.filter(sistema => permissoes.includes(sistema.id));

  if (carregando) return <div className="loading-screen">Carregando...</div>;

  // -- TELA DE LOGIN --
  if (!usuario) {
    return (
      <div className="app-container login-bg">
        <div className="login-card">
          <h1 className="logo-text">SCAMATTI <span className="logo-highlight">PLATFORM</span></h1>
          <p className="login-subtitle">Acesso Restrito Corporativo</p>
          <form onSubmit={handleLogin} className="login-form">
            <input 
              type="email" placeholder="Email corporativo" className="input-field"
              value={email} onChange={(e) => setEmail(e.target.value)} required 
            />
            <input 
              type="password" placeholder="Senha" className="input-field"
              value={senha} onChange={(e) => setSenha(e.target.value)} required 
            />
            {erro && <p className="error-msg">{erro}</p>}
            <button type="submit" className="btn-login">Entrar</button>
          </form>
        </div>
      </div>
    );
  }

  // -- DASHBOARD --
  return (
    <div className="app-container dashboard-bg">
      <header className="navbar">
        <div className="brand">SCAMATTI <span className="brand-highlight">HUB</span></div>
        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{usuario.email.split('@')[0].toUpperCase()}</span>
            <span className="user-email">{usuario.email}</span>
          </div>
          <div className="avatar-placeholder">{usuario.email[0].toUpperCase()}</div>
          <button onClick={fazerLogout} className="btn-logout">Sair</button>
        </div>
      </header>

      <main className="main-content">
        <h2 className="welcome-title">Bem-vindo ao Hub! 🚀</h2>
        
        {/* Mostra mensagem se não tiver permissões */}
        {sistemasVisiveis.length === 0 ? (
          <div style={{textAlign: 'center', color: '#666', marginTop: '50px'}}>
            <p>Você não tem permissão para aceder a nenhum sistema.</p>
            <p>Solicite acesso ao administrador.</p>
          </div>
        ) : (
          <>
            <p className="welcome-subtitle">Sistemas disponíveis para o seu perfil:</p>
            <div className="systems-grid">
              {sistemasVisiveis.map((sis) => (
                <a key={sis.id} href={sis.url} target="_blank" rel="noreferrer" className="system-card">
                  <div className="card-header" style={{ background: sis.cor }}></div>
                  <div className="card-body">
                    <h3>{sis.nome}</h3>
                    <p>{sis.descricao}</p>
                    <span className="btn-access">Aceder Sistema &rarr;</span>
                  </div>
                </a>
              ))}
            </div>
          </>
        )}
      </main>
      
      <footer className="footer">&copy; 2026 Grupo Scamatti.</footer>
    </div>
  );
}

export default App;