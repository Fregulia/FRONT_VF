import api from './api';

export const esporteService = {
  async getAll() {
    try {
      const response = await api.get('/esporte');
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
      console.error('Error fetching all esportes:', error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await api.get(`/esporte/${id}`);
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
      console.error('Error fetching esporte:', error.response || error);
      throw error;
    }
  },

  async create(esporte) {
    try {
      const response = await api.post('/esporte', esporte);
      
      // Verificar diferentes formatos possíveis
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      } else {
        throw new Error('Formato de resposta inválido');
      }
    } catch (error) {
      console.error('Error creating esporte:', error.response || error);
      throw error;
    }
  },

  async update(id, esporte) {
    try {
      const response = await api.put(`/esporte/${id}`, esporte);
      
      // Verificar diferentes formatos possíveis
      if (response.data && response.data.data) {
        return response.data.data;
      } else if (response.data) {
        return response.data;
      } else {
        throw new Error('Formato de resposta inválido');
      }
    } catch (error) {
      console.error('Error updating esporte:', error.response || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await api.delete(`/esporte/${id}`);
    } catch (error) {
      console.error('Error deleting esporte:', error.response || error);
      throw error;
    }
  }
};