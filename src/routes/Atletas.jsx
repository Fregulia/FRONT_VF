import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { atletaService } from '../services/atletaService';
import { esporteService } from '../services/esporteService';
import { treinadorService } from '../services/treinadorService';
import { useAuth } from '../contexts/AuthContext';
import atletasMock from '../mock/atletas.json';
import esportesMock from '../mock/esportes.json';
import treinadoresMock from '../mock/treinadores.json';

const Atletas = () => {
  const [atletas, setAtletas] = useState([]);
  const [esportes, setEsportes] = useState([]);
  const [treinadores, setTreinadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [useMock, setUseMock] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    categoria: '',
    esporte_id: '',
    treinadores: [],
    foto: null
  });
  
  const { hasRole } = useAuth();

  useEffect(() => {
    loadData();
  }, [useMock]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      if (useMock) {
        setAtletas(atletasMock);
        setEsportes(esportesMock);
        setTreinadores(treinadoresMock);
      } else {
        const [atletasData, esportesData, treinadoresData] = await Promise.all([
          atletaService.getAll(),
          esporteService.getAll(),
          treinadorService.getAll()
        ]);
        setAtletas(atletasData);
        setEsportes(esportesData);
        setTreinadores(treinadoresData);
      }
    } catch (err) {
      try {
        setAtletas(atletasMock);
        setEsportes(esportesMock);
        setTreinadores(treinadoresMock);
        setUseMock(true);
      } catch (mockErr) {
        setError('Erro ao carregar dados.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (useMock) {
        const newAtleta = {
          id: Date.now(),
          ...formData,
          idade: parseInt(formData.idade),
          esporte: esportes.find(e => e.id === parseInt(formData.esporte_id)),
          treinadores: treinadores.filter(t => formData.treinadores.includes(t.id.toString()))
        };
        setAtletas([...atletas, newAtleta]);
      } else {
        await atletaService.create(formData);
        await loadData();
      }
      setFormData({
        nome: '',
        idade: '',
        categoria: '',
        esporte_id: '',
        treinadores: [],
        foto: null
      });
      setShowForm(false);
    } catch (err) {
      setError('Erro ao criar atleta');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este atleta?')) return;
    
    try {
      if (useMock) {
        setAtletas(atletas.filter(a => a.id !== id));
      } else {
        await atletaService.delete(id);
        await loadData();
      }
    } catch (err) {
      setError('Erro ao excluir atleta');
    }
  };

  const handleTreinadorChange = (treinadorId) => {
    const currentTreinadores = formData.treinadores;
    if (currentTreinadores.includes(treinadorId)) {
      setFormData({
        ...formData,
        treinadores: currentTreinadores.filter(id => id !== treinadorId)
      });
    } else {
      setFormData({
        ...formData,
        treinadores: [...currentTreinadores, treinadorId]
      });
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Atletas</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={useMock}
              onChange={(e) => setUseMock(e.target.checked)}
            />
            Usar dados mockados
          </label>
          {hasRole(['admin', 'manager']) && (
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-hover-scale success"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {showForm ? 'Cancelar' : 'Novo Atleta'}
            </button>
          )}
        </div>
      </div>

      {error && (
        <div style={{
          backgroundColor: '#f8d7da',
          color: '#721c24',
          padding: '0.75rem',
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}

      {showForm && (
        <div className="slide-in" style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h3>Novo Atleta</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome:</label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({...formData, nome: e.target.value})}
                  required
                  className="input-transition"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Idade:</label>
                <input
                  type="number"
                  value={formData.idade}
                  onChange={(e) => setFormData({...formData, idade: e.target.value})}
                  min="16"
                  max="50"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Categoria:</label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Selecione...</option>
                  <option value="Juvenil">Juvenil</option>
                  <option value="Adulto">Adulto</option>
                  <option value="Master">Master</option>
                  <option value="Profissional">Profissional</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Esporte:</label>
                <select
                  value={formData.esporte_id}
                  onChange={(e) => setFormData({...formData, esporte_id: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Selecione...</option>
                  {esportes.map(esporte => (
                    <option key={esporte.id} value={esporte.id}>
                      {esporte.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Foto:</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({...formData, foto: e.target.files[0]})}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Treinadores:</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                {treinadores.map(treinador => (
                  <label key={treinador.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={formData.treinadores.includes(treinador.id.toString())}
                      onChange={() => handleTreinadorChange(treinador.id.toString())}
                    />
                    {treinador.nome}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              style={{
                marginTop: '1rem',
                padding: '0.5rem 1rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Salvar
            </button>
          </form>
        </div>
      )}

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        {atletas.map(atleta => (
          <div key={atleta.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1.5rem',
            backgroundColor: 'white'
          }}>
            <h3>{atleta.nome}</h3>
            <p><strong>Idade:</strong> {atleta.idade} anos</p>
            <p><strong>Categoria:</strong> {atleta.categoria}</p>
            <p><strong>Esporte:</strong> {atleta.esporte?.nome || 'Não definido'}</p>
            
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Treinadores:</strong> {atleta.treinadores?.length || 0}</p>
              {atleta.treinadores && atleta.treinadores.length > 0 && (
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                  {atleta.treinadores.map(treinador => (
                    <li key={treinador.id}>{treinador.nome}</li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <Link
                to={`/atletas/${atleta.id}`}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#007bff',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '4px',
                  fontSize: '0.9rem'
                }}
              >
                Ver Detalhes
              </Link>
              {hasRole(['admin', 'manager']) && (
                <button
                  onClick={() => handleDelete(atleta.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  Excluir
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {atletas.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Nenhum atleta encontrado.
        </div>
      )}
    </div>
  );
};

export default Atletas;