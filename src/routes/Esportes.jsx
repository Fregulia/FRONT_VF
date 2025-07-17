import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { esporteService } from '../services/esporteService';
import { useAuth } from '../contexts/AuthContext';
import esportesMock from '../mock/esportes.json';

const Esportes = () => {
  const [esportes, setEsportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [useMock, setUseMock] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    federacao: '',
    descricao: ''
  });
  
  const { hasRole } = useAuth();

  useEffect(() => {
    loadEsportes();
  }, [useMock]);

  const loadEsportes = async () => {
    try {
      setLoading(true);
      setError('');
      if (useMock) {
        setEsportes(esportesMock);
      } else {
        const data = await esporteService.getAll();
        setEsportes(data);
      }
    } catch (err) {
      try {
        setEsportes(esportesMock);
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
        const newEsporte = {
          id: Date.now(),
          ...formData,
          atletas: [],
          treinadores: []
        };
        setEsportes([...esportes, newEsporte]);
      } else {
        await esporteService.create(formData);
        await loadEsportes();
      }
      setFormData({ nome: '', federacao: '', descricao: '' });
      setShowForm(false);
    } catch (err) {
      setError('Erro ao criar esporte');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este esporte?')) return;
    
    try {
      if (useMock) {
        setEsportes(esportes.filter(e => e.id !== id));
      } else {
        await esporteService.delete(id);
        await loadEsportes();
      }
    } catch (err) {
      setError('Erro ao excluir esporte');
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Esportes</h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              checked={useMock}
              onChange={(e) => setUseMock(e.target.checked)}
            />
            Usar dados mockados
          </label>
          {hasRole(['admin']) && (
            <button
              onClick={() => setShowForm(!showForm)}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {showForm ? 'Cancelar' : 'Novo Esporte'}
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
        <div style={{
          backgroundColor: '#f8f9fa',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <h3>Novo Esporte</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome:</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Federação:</label>
              <input
                type="text"
                value={formData.federacao}
                onChange={(e) => setFormData({...formData, federacao: e.target.value})}
                required
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Descrição:</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({...formData, descricao: e.target.value})}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  minHeight: '80px'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
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
        {esportes.map(esporte => (
          <div key={esporte.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1.5rem',
            backgroundColor: 'white'
          }}>
            <h3>{esporte.nome}</h3>
            <p><strong>Federação:</strong> {esporte.federacao}</p>
            {esporte.descricao && <p>{esporte.descricao}</p>}
            
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Atletas:</strong> {esporte.atletas?.length || 0}</p>
              <p><strong>Treinadores:</strong> {esporte.treinadores?.length || 0}</p>
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <Link
                to={`/esportes/${esporte.id}`}
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
              {hasRole(['admin']) && (
                <button
                  onClick={() => handleDelete(esporte.id)}
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

      {esportes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Nenhum esporte encontrado.
        </div>
      )}
    </div>
  );
};

export default Esportes;