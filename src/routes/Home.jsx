import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <div>
      <h1>Sistema de Gerenciamento Esportivo</h1>
      
      {isAuthenticated() && (
        <div className="pulse-effect" style={{
          backgroundColor: '#d4edda',
          color: '#155724',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '2rem'
        }}>
          Bem-vindo, {user?.name}! Você está logado como {user?.role}.
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <p>
          Este sistema permite gerenciar esportes, atletas e treinadores. 
          Explore as diferentes seções usando o menu de navegação acima.
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '2rem',
        marginTop: '2rem'
      }}>
        <div className="fade-in" style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1.5rem',
          backgroundColor: '#f8f9fa'
        }}>
          <h3>🏆 Esportes</h3>
          <p>Gerencie os diferentes esportes disponíveis no sistema.</p>
          <Link 
            to="/esportes" 
            className="btn-hover-scale"
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              marginTop: '1rem'
            }}
          >
            Ver Esportes
          </Link>
        </div>

        <div className="fade-in" style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1.5rem',
          backgroundColor: '#f8f9fa',
          animationDelay: '0.2s'
        }}>
          <h3>🏃♂️ Atletas</h3>
          <p>Cadastre e gerencie atletas, suas categorias e relacionamentos.</p>
          <Link 
            to="/atletas" 
            className="btn-hover-scale success"
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              backgroundColor: '#28a745',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '4px',
              marginTop: '1rem'
            }}
          >
            Ver Atletas
          </Link>
        </div>

        <div className="fade-in" style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          padding: '1.5rem',
          backgroundColor: '#f8f9fa',
          animationDelay: '0.4s'
        }}>
          <h3>👨🏫 Treinadores</h3>
          <p>Gerencie treinadores, suas especialidades e certificações.</p>
          <Link 
            to="/treinadores" 
            className="btn-hover-scale warning"
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              backgroundColor: '#ffc107',
              color: 'black',
              textDecoration: 'none',
              borderRadius: '4px',
              marginTop: '1rem'
            }}
          >
            Ver Treinadores
          </Link>
        </div>
      </div>

      {!isAuthenticated() && (
        <div style={{
          backgroundColor: '#fff3cd',
          color: '#856404',
          padding: '1rem',
          borderRadius: '4px',
          marginTop: '2rem'
        }}>
          <p>
            Para acessar todas as funcionalidades do sistema, faça{' '}
            <Link to="/login" className="btn-hover-scale" style={{ color: '#007bff' }}>login</Link> ou{' '}
            <Link to="/registro" className="btn-hover-scale" style={{ color: '#007bff' }}>registre-se</Link>.
          </p>
        </div>
      )}
    </div>
  );
};

export default Home;