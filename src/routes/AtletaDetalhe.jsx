import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { atletaService } from '../services/atletaService';
import { esporteService } from '../services/esporteService';
import { treinadorService } from '../services/treinadorService';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import atletasMock from '../mock/atletas.json';

const AtletaDetalhe = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [atleta, setAtleta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [useMock, setUseMock] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [esportes, setEsportes] = useState([]);
  const [treinadores, setTreinadores] = useState([]);
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    categoria: '',
    esporte_id: '',
    treinadores: [],
    foto: null
  });

  useEffect(() => {
    loadAtleta();
    loadEsportes();
    loadTreinadores();
  }, [id]);
  
  // Carregar esportes para o formulário de edição
  const loadEsportes = async () => {
    try {
      const data = await esporteService.getAll();
      setEsportes(data);
    } catch (error) {
      console.error('Erro ao carregar esportes:', error);
    }
  };
  
  // Carregar treinadores para o formulário de edição
  const loadTreinadores = async () => {
    try {
      const data = await treinadorService.getAll();
      setTreinadores(data);
    } catch (error) {
      console.error('Erro ao carregar treinadores:', error);
    }
  };
  
  // Iniciar modo de edição
  const handleEdit = () => {
    setFormData({
      nome: safeGet(atleta, 'nome', ''),
      idade: safeGet(atleta, 'idade', ''),
      categoria: safeGet(atleta, 'categoria', ''),
      esporte_id: safeGet(atleta, 'esporte_id', ''),
      treinadores: Array.isArray(safeGet(atleta, 'treinadores')) 
        ? safeGet(atleta, 'treinadores').map(t => t.id.toString())
        : [],
      foto: null
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
      console.log('Enviando dados para atualização:', formData);
      
      // Verificar se há uma foto para upload
      if (formData.foto) {
        console.log('Enviando foto:', formData.foto.name, formData.foto.type, formData.foto.size);
      }
      
      const updatedAtleta = await atletaService.update(id, formData);
      console.log('Resposta da atualização:', updatedAtleta);
      
      setEditMode(false);
      await loadAtleta(); // Recarregar dados do atleta
    } catch (error) {
      console.error('Erro ao atualizar atleta:', error);
      setError('Erro ao atualizar atleta');
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
  
  // Manipular mudanças no campo de foto
  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      foto: e.target.files[0]
    }));
  };
  
  // Manipular mudanças nos treinadores selecionados
  const handleTreinadorChange = (treinadorId) => {
    const currentTreinadores = [...formData.treinadores];
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

  const loadAtleta = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Verificar se o ID é válido
      if (!id || isNaN(parseInt(id))) {
        setError('ID de atleta inválido');
        setLoading(false);
        return;
      }
      
      if (useMock) {
        // Carregar dados mockados
        const mockAtleta = atletasMock.find(a => a.id === parseInt(id));
        if (mockAtleta) {
          console.log('Usando dados mockados:', mockAtleta);
          setAtleta(mockAtleta);
        } else {
          setError('Atleta não encontrado nos dados mockados');
        }
      } else {
        // Carregar da API
        try {
          // Obter resposta direta da API
          const response = await api.get(`/atleta/${id}`);
          console.log('Resposta completa da API:', response);
          
          // Processar dados da API
          
          // Extrair dados do atleta da resposta
          let atletaData;
          
          if (response.data && response.data.data) {
            atletaData = response.data.data;
          } else if (response.data) {
            atletaData = response.data;
          } else {
            throw new Error('Formato de resposta inválido');
          }
          
          console.log('Dados do atleta extraídos:', atletaData);
          setAtleta(atletaData);
        } catch (apiError) {
          console.error('Erro ao carregar atleta da API:', apiError);
          throw apiError;
        }
      }
    } catch (error) {
      console.error('Erro ao carregar atleta:', error);
      
      // Tentar fallback para dados mockados se não estiver já usando
      if (!useMock) {
        const mockAtleta = atletasMock.find(a => a.id === parseInt(id));
        if (mockAtleta) {
          console.log('Fallback para dados mockados:', mockAtleta);
          setAtleta(mockAtleta);
          setUseMock(true);
        } else {
          setError('Atleta não encontrado');
        }
      } else {
        setError('Erro ao carregar dados do atleta');
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

  if (loading) return <div>Carregando...</div>;
  if (error) return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <Link 
          to="/atletas"
          style={{
            color: '#007bff',
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}
        >
          ← Voltar para Atletas
        </Link>
      </div>
      <div style={{ color: 'red', padding: '1rem', backgroundColor: '#ffeeee', borderRadius: '4px' }}>
        <strong>Erro:</strong> {error}
      </div>
    </div>
  );
  if (!atleta) return <div>Atleta não encontrado</div>;

  // Função para gerar URL da imagem com fallback
  const getImageUrl = () => {
    console.log('Dados do atleta para imagem:', atleta);
    
    // Verificar se a API já retornou a URL completa da imagem
    if (safeGet(atleta, 'image_url') && safeGet(atleta, 'image_url') !== null) {
      // Se a URL já for uma URL de dados (base64), use-a diretamente
      if (safeGet(atleta, 'image_url').startsWith('data:')) {
        console.log('Usando imagem base64 da API');
        return safeGet(atleta, 'image_url');
      }
      
      console.log('Usando image_url da API:', safeGet(atleta, 'image_url'));
      return safeGet(atleta, 'image_url');
    }
    
    const foto = safeGet(atleta, 'foto');
    console.log('Valor do campo foto:', foto);
    
    if (!foto) {
      console.log('Sem foto, usando imagem padrão');
      return "data:image/png;base64,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";
    }
    
    if (useMock) {
      // Se estiver usando dados mockados, use um placeholder
      console.log('Usando dados mockados');
      return 'https://via.placeholder.com/200x200?text=Atleta';
    }
    
    // Se for da API, use a URL completa
    console.log('Usando URL da API:', `http://localhost:8000/storage/${foto}`);
    return `http://localhost:8000/storage/${foto}`;
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link 
          to="/atletas"
          style={{
            color: '#007bff',
            textDecoration: 'none',
            fontSize: '0.9rem'
          }}
        >
          ← Voltar para Atletas
        </Link>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
            <input
              type="checkbox"
              checked={useMock}
              onChange={(e) => {
                setUseMock(e.target.checked);
                loadAtleta();
              }}
            />
            Usar dados mockados
          </label>
          
          {hasRole(['admin', 'manager']) && !editMode && (
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
              Editar Atleta
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
            <h2>Editar Atleta</h2>
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
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Idade:</label>
                <input
                  type="number"
                  name="idade"
                  value={formData.idade}
                  onChange={handleChange}
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
                  name="categoria"
                  value={formData.categoria}
                  onChange={handleChange}
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
                  name="esporte_id"
                  value={formData.esporte_id}
                  onChange={handleChange}
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
            
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Foto:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              />
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                Deixe em branco para manter a foto atual
              </p>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
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
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <h1>{safeGet(atleta, 'nome', 'Nome não disponível')}</h1>
              
              <div style={{ marginBottom: '2rem' }}>
                <p><strong>Idade:</strong> {safeGet(atleta, 'idade') ? `${safeGet(atleta, 'idade')} anos` : 'Não informada'}</p>
                <p><strong>Categoria:</strong> {safeGet(atleta, 'categoria', 'Não informada')}</p>
                
                {safeGet(atleta, 'esporte.id') && safeGet(atleta, 'esporte.nome') ? (
                  <p>
                    <strong>Esporte:</strong>{' '}
                    <Link 
                      to={`/esportes/${safeGet(atleta, 'esporte.id')}`}
                      style={{ color: '#007bff', textDecoration: 'none' }}
                    >
                      {safeGet(atleta, 'esporte.nome')}
                    </Link>
                  </p>
                ) : (
                  <p><strong>Esporte:</strong> Não informado</p>
                )}
            </div>

            <div>
              <h3>Treinadores ({Array.isArray(safeGet(atleta, 'treinadores')) ? safeGet(atleta, 'treinadores').length : 0})</h3>
              {Array.isArray(safeGet(atleta, 'treinadores')) && safeGet(atleta, 'treinadores').length > 0 ? (
                <div style={{ marginTop: '1rem' }}>
                  {safeGet(atleta, 'treinadores').map(treinador => (
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
                  Nenhum treinador associado.
                </p>
              )}
            </div>
          </div>

          <div style={{ flexShrink: 0 }}>
            <img 
              src={getImageUrl()}
              alt={`Foto de ${safeGet(atleta, 'nome', 'atleta')}`}
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
                border: '1px solid #ddd'
              }}
              onError={(e) => {
                e.target.src = "data:image/png;base64,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";
              }}
            />
            {useMock && (
              <p style={{ textAlign: 'center', fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                (Usando dados mockados)
              </p>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default AtletaDetalhe;