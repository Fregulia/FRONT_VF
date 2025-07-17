import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { treinadorService } from '../services/treinadorService';
import { esporteService } from '../services/esporteService';
import { useAuth } from '../contexts/AuthContext';
import treinadoresMock from '../mock/treinadores.json';
import esportesMock from '../mock/esportes.json';

const Treinadores = () => {
  const [treinadores, setTreinadores] = useState([]);
  const [esportes, setEsportes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [useMock, setUseMock] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    cref: '',
    especialidade: '',
    esporte_id: ''
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
        setTreinadores(treinadoresMock);
        setEsportes(esportesMock);
      } else {
        const [treinadoresData, esportesData] = await Promise.all([
          treinadorService.getAll(),
          esporteService.getAll()
        ]);
        setTreinadores(treinadoresData);
        setEsportes(esportesData);
      }
    } catch (err) {
      try {
        setTreinadores(treinadoresMock);
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
        const newTreinador = {
          id: Date.now(),
          ...formData,
          esporte: esportes.find(e => e.id === parseInt(formData.esporte_id)),
          atletas: []
        };
        setTreinadores([...treinadores, newTreinador]);
      } else {
        await treinadorService.create(formData);
        await loadData();
      }
      setFormData({
        nome: '',
        cref: '',
        especialidade: '',
        esporte_id: ''
      });
      setShowForm(false);
    } catch (err) {
      setError('Erro ao criar treinador');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este treinador?')) return;
    
    try {
      if (useMock) {
        setTreinadores(treinadores.filter(t => t.id !== id));
      } else {
        await treinadorService.delete(id);
        await loadData();
      }
    } catch (err) {
      setError('Erro ao excluir treinador');
    }
  };

  if (loading) return <div>Carregando...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>Treinadores</h1>
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
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#ffc107',
                color: 'black',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              {showForm ? 'Cancelar' : 'Novo Treinador'}
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
          <h3>Novo Treinador</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
              <div>
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
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>CREF:</label>
                <input
                  type="text"
                  value={formData.cref}
                  onChange={(e) => setFormData({...formData, cref: e.target.value})}
                  required
                  placeholder="Ex: CREF-123-456"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Especialidade:</label>
                <select
                  value={formData.especialidade}
                  onChange={(e) => setFormData({...formData, especialidade: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  <option value="">Selecione...</option>
                  <option value="Preparação Física">Preparação Física</option>
                  <option value="Técnico">Técnico</option>
                  <option value="Fisioterapia">Fisioterapia</option>
                  <option value="Nutrição">Nutrição</option>
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
        {treinadores.map(treinador => (
          <div key={treinador.id} style={{
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '1.5rem',
            backgroundColor: 'white'
          }}>
            <h3>{treinador.nome}</h3>
            <p><strong>CREF:</strong> {treinador.cref}</p>
            <p><strong>Especialidade:</strong> {treinador.especialidade}</p>
            <p><strong>Esporte:</strong> {treinador.esporte?.nome || 'Não definido'}</p>
            
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Atletas:</strong> {treinador.atletas?.length || 0}</p>
              {treinador.atletas && treinador.atletas.length > 0 && (
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem' }}>
                  {treinador.atletas.map(atleta => (
                    <li key={atleta.id}>{atleta.nome}</li>
                  ))}
                </ul>
              )}
            </div>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
              <Link
                to={`/treinadores/${treinador.id}`}
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
                  onClick={() => handleDelete(treinador.id)}
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

      {treinadores.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
          Nenhum treinador encontrado.
        </div>
      )}
    </div>
  );
};

export default Treinadores;