import api from './api';

export const atletaService = {
  async getAll() {
    try {
      const response = await api.get('/atleta');
      console.log('API getAll response:', response.data);
      
      // Verificar diferentes formatos possíveis
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      } else {
        throw new Error('Formato de resposta inválido');
      }
    } catch (error) {
      console.error('Error fetching all atletas:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      // Usar a nova rota de teste
      const response = await api.get(`/atleta-teste/${id}`);
      console.log('API getById response:', response.data);
      
      // Verificar diferentes formatos possíveis
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      } else {
        throw new Error('Formato de resposta inválido');
      }
    } catch (error) {
      console.error('Error fetching atleta:', error.response || error);
      throw error;
    }
  },

  async create(atleta) {
    const formData = new FormData();
    Object.keys(atleta).forEach(key => {
      if (key === 'treinadores' && Array.isArray(atleta[key])) {
        atleta[key].forEach((treinadorId, index) => {
          formData.append(`treinadores[${index}]`, treinadorId);
        });
      } else if (key === 'foto' && atleta[key] instanceof File) {
        formData.append(key, atleta[key]);
      } else if (atleta[key] !== null && atleta[key] !== undefined) {
        formData.append(key, atleta[key]);
      }
    });

    try {
      const response = await api.post('/atleta', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Verificar diferentes formatos possíveis
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      } else {
        throw new Error('Formato de resposta inválido');
      }
    } catch (error) {
      console.error('Error creating atleta:', error.response || error);
      throw error;
    }
  },

  async update(id, atleta) {
    const formData = new FormData();
    
    // Log para debug
    console.log('Dados recebidos para atualização:', atleta);
    
    Object.keys(atleta).forEach(key => {
      if (key === 'treinadores' && Array.isArray(atleta[key])) {
        atleta[key].forEach((treinadorId, index) => {
          formData.append(`treinadores[${index}]`, treinadorId);
        });
      } else if (key === 'foto' && atleta[key] instanceof File) {
        console.log('Anexando arquivo:', atleta[key].name, atleta[key].type, atleta[key].size);
        formData.append(key, atleta[key]);
      } else if (atleta[key] !== null && atleta[key] !== undefined) {
        formData.append(key, atleta[key]);
      }
    });

    try {
      // Verificar o conteúdo do FormData
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }
      
      // Usar a rota correta para atualização com upload de arquivos
      const response = await api.post(`/atleta/${id}?_method=PUT`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Resposta da API:', response.data);
      
      // Verificar diferentes formatos possíveis
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      } else {
        throw new Error('Formato de resposta inválido');
      }
    } catch (error) {
      console.error('Error updating atleta:', error.response || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await api.delete(`/atleta/${id}`);
    } catch (error) {
      console.error('Error deleting atleta:', error.response || error);
      throw error;
    }
  }
};