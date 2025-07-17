import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { esporteService } from '../services/esporteService';
import { useAuth } from '../contexts/AuthContext';
import esportesMock from '../mock/esportes.json';

const EsporteDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [esporte, setEsporte] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useMock, setUseMock] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    nome: '',
    federacao: '',
    descricao: ''
  });

  useEffect(() => {
    loadEsporte();
  }, [id]);

  const loadEsporte = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (useMock) {
        // Carregar dados mockados
        const mockEsporte = esportesMock.find(e => e.id === parseInt(id));
        if (mockEsporte) {
          console.log('Usando dados mockados:', mockEsporte);
          setEsporte(mockEsporte);
        } else {
          setError('Esporte não encontrado nos dados mockados');
        }
      } else {
        // Carregar da API
        try {
          const data = await esporteService.getById(id);
          console.log('Dados do esporte:', data);
          setEsporte(data);
        } catch (apiError) {
          console.error('Erro ao carregar esporte da API:', apiError);
          throw apiError;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar esporte:', error);
      
      // Tentar fallback para dados mockados se não estiver já usando
      if (!useMock) {
        const mockEsporte = esportesMock.find(e => e.id === parseInt(id));
        if (mockEsporte) {
          console.log('Fallback para dados mockados:', mockEsporte);
          setEsporte(mockEsporte);
          setUseMock(true);
        } else {
          setError('Esporte não encontrado');
        }
      } else {
        setError('Erro ao carregar dados do esporte');
      }
    } finally {
      setLoading(false);
    }
  };

  // Função para extrair valor seguro
  const safeGet = (obj, path, defaultValue = '') => {
    try {
      const parts = path.split('.');
      let result = obj;
      
      for (const part of parts) {
        if (result === null || result === undefined) return defaultValue;
        result = result[part];
      }
      
      return result !== null && result !== undefined ? result : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  // Iniciar modo de edição
  const handleEdit = () => {
    setFormData({
      nome: safeGet(esporte, 'nome', ''),
      federacao: safeGet(esporte, 'federacao', ''),
      descricao: safeGet(esporte, 'descricao', '')
    });
    setEditMode(true);
  };
  
  // Cancelar edição
  const handleCancel = () => {
    setEditMode(false);
  };
  
  // Salvar alterações
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await esporteService.update(id, formData);
      setEditMode(false);
      loadEsporte();
    } catch (error) {
      console.error('Erro ao atualizar esporte:', error);
      setError('Erro ao atualizar esporte');
    } finally {
      setLoading(false);
    }
  };
  
  // Manipular mudanças nos campos do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) return <div>Carregando...</div>;
  if (error) return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          to="/esportes"
          style={{
            color: '#007bff',
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}
        >
          ← Voltar para Esportes
        </Link>
      </div>
      <div style={{ color: 'red', padding: '1rem', backgroundColor: '#ffeeee', borderRadius: '4px' }}>
        <strong>Erro:</strong> {error}
      </div>
    </div>
  );
  if (!esporte) return <div>Esporte não encontrado</div>;

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link 
          to="/esportes"
          style={{
            color: '#007bff',
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}
        >
          ← Voltar para Esportes
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={useMock}
              onChange={(e) => {
                setUseMock(e.target.checked);
                loadEsporte();
              }}
            />
            Usar dados mockados
          </label>
          
          {hasRole(['admin']) && !editMode && (
            <button
              onClick={handleEdit}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              Editar Esporte
            </button>
          )}
        </div>
      </div>

      <div style={{
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        border: '1px solid #ddd'
      }}>
        {editMode ? (
          <form onSubmit={handleSubmit}>
            <h2>Editar Esporte</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Nome:</label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
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
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Federação:</label>
                <input
                  type="text"
                  name="federacao"
                  value={formData.federacao}
                  onChange={handleChange}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                />
              </div>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Descrição:</label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows="4"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
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
              <button
                type="button"
                onClick={handleCancel}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <>
            <h1>{safeGet(esporte, 'nome', 'Nome não disponível')}</h1>
            
            <div style={{ marginBottom: '2rem' }}>
              <p><strong>Federação:</strong> {safeGet(esporte, 'federacao', 'Não informada')}</p>
              {safeGet(esporte, 'descricao') && (
                <p><strong>Descrição:</strong> {safeGet(esporte, 'descricao')}</p>
              )}
            </div>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '2rem',
              marginTop: '2rem'
            }}>
              <div>
                <h3>Atletas ({Array.isArray(safeGet(esporte, 'atletas')) ? safeGet(esporte, 'atletas').length : 0})</h3>
                {Array.isArray(safeGet(esporte, 'atletas')) && safeGet(esporte, 'atletas').length > 0 ? (
                  <div style={{ marginTop: '1rem' }}>
                    {safeGet(esporte, 'atletas').map(atleta => (
                      <div key={safeGet(atleta, 'id')} style={{
                        padding: '1rem',
                        border: '1px solid #eee',
                        borderRadius: '4px',
                        marginBottom: '0.5rem'
                      }}>
                        <h4>{safeGet(atleta, 'nome', 'Nome não disponível')}</h4>
                        <p>Idade: {safeGet(atleta, 'idade') ? `${safeGet(atleta, 'idade')} anos` : 'Não informada'}</p>
                        <p>Categoria: {safeGet(atleta, 'categoria', 'Não informada')}</p>
                        <Link 
                          to={`/atletas/${safeGet(atleta, 'id')}`}
                          style={{
                            color: '#007bff',
                            textDecoration: 'none',
                            fontSize: '0.9rem'
                          }}
                        >
                          Ver detalhes →
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>
                    Nenhum atleta cadastrado neste esporte.
                  </p>
                )}
              </div>

              <div>
                <h3>Treinadores ({Array.isArray(safeGet(esporte, 'treinadores')) ? safeGet(esporte, 'treinadores').length : 0})</h3>
                {Array.isArray(safeGet(esporte, 'treinadores')) && safeGet(esporte, 'treinadores').length > 0 ? (
                  <div style={{ marginTop: '1rem' }}>
                    {safeGet(esporte, 'treinadores').map(treinador => (
                      <div key={safeGet(treinador, 'id')} style={{
                        padding: '1rem',
                        border: '1px solid #eee',
                        borderRadius: '4px',
                        marginBottom: '0.5rem'
                      }}>
                        <h4>{safeGet(treinador, 'nome', 'Nome não disponível')}</h4>
                        <p>CREF: {safeGet(treinador, 'cref', 'Não informado')}</p>
                        <p>Especialidade: {safeGet(treinador, 'especialidade', 'Não informada')}</p>
                        <Link 
                          to={`/treinadores/${safeGet(treinador, 'id')}`}
                          style={{
                            color: '#007bff',
                            textDecoration: 'none',
                            fontSize: '0.9rem'
                          }}
                        >
                          Ver detalhes →
                        </Link>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ color: '#666', fontStyle: 'italic' }}>
                    Nenhum treinador cadastrado neste esporte.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EsporteDetalhe;