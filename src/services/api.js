import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Configuração do Axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response || error);
    
    // Tratamento específico para erros comuns
    if (error.response) {
      // O servidor respondeu com um status de erro
      switch (error.response.status) {
        case 401:
          console.log('Erro de autenticação: Token inválido ou expirado');
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          break;
        case 404:
          console.log('Recurso não encontrado');
          break;
        case 422:
          console.log('Erro de validação:', error.response.data);
          break;
        case 500:
          console.log('Erro interno do servidor');
          break;
        default:
          console.log(`Erro inesperado: ${error.response.status}`);
      }
    } else if (error.request) {
      // A requisição foi feita mas não houve resposta
      console.log('Sem resposta do servidor. Verifique se a API está rodando.');
    } else {
      // Erro na configuração da requisição
      console.log('Erro na configuração da requisição:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;