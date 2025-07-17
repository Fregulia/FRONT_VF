import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const Layout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <nav style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '1rem',
        borderBottom: '1px solid #dee2e6'
      }}>
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#007bff' }}>
              Home
            </Link>
            <Link to="/esportes" style={{ textDecoration: 'none', color: '#007bff' }}>
              Esportes
            </Link>
            <Link to="/atletas" style={{ textDecoration: 'none', color: '#007bff' }}>
              Atletas
            </Link>
            <Link to="/treinadores" style={{ textDecoration: 'none', color: '#007bff' }}>
              Treinadores
            </Link>
            <Link to="/sobre" style={{ textDecoration: 'none', color: '#007bff' }}>
              Sobre
            </Link>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {isAuthenticated() ? (
              <>
                <span>Olá, {user?.name}</span>
                <button 
                  onClick={handleLogout}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" style={{ textDecoration: 'none', color: '#007bff' }}>
                  Login
                </Link>
                <Link to="/registro" style={{ textDecoration: 'none', color: '#007bff' }}>
                  Registro
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Layout;