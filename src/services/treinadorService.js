import api from './api';

export const treinadorService = {
  async getAll() {
    try {
      const response = await api.get('/treinador');
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
      console.error('Error fetching all treinadores:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/treinador/${id}`);
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
      console.error('Error fetching treinador:', error.response || error);
      throw error;
    }
  },

  async create(treinador) {
    const formData = new FormData();
    Object.keys(treinador).forEach(key => {
      if (key === 'atletas' && Array.isArray(treinador[key])) {
        treinador[key].forEach((atletaId, index) => {
          formData.append(`atletas[${index}]`, atletaId);
        });
      } else if (key === 'foto' && treinador[key] instanceof File) {
        formData.append(key, treinador[key]);
      } else if (treinador[key] !== null && treinador[key] !== undefined) {
        formData.append(key, treinador[key]);
      }
    });

    try {
      const response = await api.post('/treinador', formData, {
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
      console.error('Error creating treinador:', error.response || error);
      throw error;
    }
  },

  async update(id, treinador) {
    const formData = new FormData();
    
    // Log para debug
    console.log('Dados recebidos para atualização:', treinador);
    
    Object.keys(treinador).forEach(key => {
      if (key === 'atletas' && Array.isArray(treinador[key])) {
        treinador[key].forEach((atletaId, index) => {
          formData.append(`atletas[${index}]`, atletaId);
        });
      } else if (key === 'foto' && treinador[key] instanceof File) {
        console.log('Anexando arquivo:', treinador[key].name, treinador[key].type, treinador[key].size);
        formData.append(key, treinador[key]);
      } else if (treinador[key] !== null && treinador[key] !== undefined) {
        formData.append(key, treinador[key]);
      }
    });

    try {
      // Verificar o conteúdo do FormData
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
      }
      
      // Usar a rota correta para atualização com upload de arquivos
      const response = await api.post(`/treinador/${id}?_method=PUT`, formData, {
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
      console.error('Error updating treinador:', error.response || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await api.delete(`/treinador/${id}`);
    } catch (error) {
      console.error('Error deleting treinador:', error.response || error);
      throw error;
    }
  }
};