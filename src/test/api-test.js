// Arquivo temporário para testar a API
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

// Função para testar a API
async function testApi() {
  try {
    // Teste de listagem de atletas
    console.log('Testando listagem de atletas...');
    const atletasResponse = await axios.get(`${API_BASE_URL}/atleta`);
    console.log('Resposta completa:', atletasResponse);
    console.log('Dados:', atletasResponse.data);
    
    // Se houver atletas, teste o detalhe do primeiro
    if (atletasResponse.data && (atletasResponse.data.data || atletasResponse.data).length > 0) {
      const atletas = atletasResponse.data.data || atletasResponse.data;
      const primeiroAtleta = atletas[0];
      console.log('Primeiro atleta:', primeiroAtleta);
      
      console.log(`Testando detalhe do atleta ID ${primeiroAtleta.id}...`);
      const detalheResponse = await axios.get(`${API_BASE_URL}/atleta/${primeiroAtleta.id}`);
      console.log('Resposta de detalhe completa:', detalheResponse);
      console.log('Dados de detalhe:', detalheResponse.data);
    }
  } catch (error) {
    console.error('Erro ao testar API:', error.response || error);
  }
}

// Executar o teste
testApi();

export default testApi;