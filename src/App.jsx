import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './routes/Layout';
import Login from './routes/Login';
import Register from './routes/Register';
import Home from './routes/Home';
import Esportes from './routes/Esportes';
import EsporteDetalhe from './routes/EsporteDetalhe';
import Atletas from './routes/Atletas';
import AtletaDetalhe from './routes/AtletaDetalhe';
import Treinadores from './routes/Treinadores';
import TreinadorDetalhe from './routes/TreinadorDetalhe';
import Sobre from './routes/Sobre';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="esportes" element={<Esportes />} />
          <Route path="esportes/:id" element={<EsporteDetalhe />} />
          <Route path="atletas" element={<Atletas />} />
          <Route path="atletas/:id" element={<AtletaDetalhe />} />
          <Route path="treinadores" element={<Treinadores />} />
          <Route path="treinadores/:id" element={<TreinadorDetalhe />} />
          <Route path="sobre" element={<Sobre />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;