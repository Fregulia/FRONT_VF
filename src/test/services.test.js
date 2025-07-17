import { describe, it, expect, vi, beforeEach } from 'vitest';
import { esporteService } from '../services/esporteService';
import { atletaService } from '../services/atletaService';
import { treinadorService } from '../services/treinadorService';
import { authService } from '../services/authService';

// Mock dos dados
const mockEsporte = {
  id: 1,
  nome: 'Futebol',
  federacao: 'CBF',
  descricao: 'Esporte popular'
};

const mockAtleta = {
  id: 1,
  nome: 'João Silva',
  idade: 25,
  categoria: 'Profissional',
  esporte_id: 1
};

const mockTreinador = {
  id: 1,
  nome: 'Carlos Pereira',
  cref: 'CREF-123-456',
  especialidade: 'Preparação Física',
  esporte_id: 1
};

// Mock do axios
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }
}));

describe('Serviços da API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('EsporteService', () => {
    it('deve buscar todos os esportes', async () => {
      const mockResponse = { data: { data: [mockEsporte] } };
      const api = await import('../services/api');
      api.default.get.mockResolvedValue(mockResponse);

      const result = await esporteService.getAll();
      
      expect(api.default.get).toHaveBeenCalledWith('/esporte');
      expect(result).toEqual([mockEsporte]);
    });

    it('deve buscar esporte por ID', async () => {
      const mockResponse = { data: { data: mockEsporte } };
      const api = await import('../services/api');
      api.default.get.mockResolvedValue(mockResponse);

      const result = await esporteService.getById(1);
      
      expect(api.default.get).toHaveBeenCalledWith('/esporte/1');
      expect(result).toEqual(mockEsporte);
    });

    it('deve criar novo esporte', async () => {
      const mockResponse = { data: { data: mockEsporte } };
      const api = await import('../services/api');
      api.default.post.mockResolvedValue(mockResponse);

      const result = await esporteService.create(mockEsporte);
      
      expect(api.default.post).toHaveBeenCalledWith('/esporte', mockEsporte);
      expect(result).toEqual(mockEsporte);
    });
  });

  describe('AtletaService', () => {
    it('deve buscar todos os atletas', async () => {
      const mockResponse = { data: { data: [mockAtleta] } };
      const api = await import('../services/api');
      api.default.get.mockResolvedValue(mockResponse);

      const result = await atletaService.getAll();
      
      expect(api.default.get).toHaveBeenCalledWith('/atleta');
      expect(result).toEqual([mockAtleta]);
    });

    it('deve criar atleta com FormData', async () => {
      const mockResponse = { data: { data: mockAtleta } };
      const api = await import('../services/api');
      api.default.post.mockResolvedValue(mockResponse);

      const result = await atletaService.create(mockAtleta);
      
      expect(api.default.post).toHaveBeenCalled();
      expect(result).toEqual(mockAtleta);
    });
  });

  describe('TreinadorService', () => {
    it('deve buscar todos os treinadores', async () => {
      const mockResponse = { data: { data: [mockTreinador] } };
      const api = await import('../services/api');
      api.default.get.mockResolvedValue(mockResponse);

      const result = await treinadorService.getAll();
      
      expect(api.default.get).toHaveBeenCalledWith('/treinador');
      expect(result).toEqual([mockTreinador]);
    });

    it('deve criar novo treinador', async () => {
      const mockResponse = { data: { data: mockTreinador } };
      const api = await import('../services/api');
      api.default.post.mockResolvedValue(mockResponse);

      const result = await treinadorService.create(mockTreinador);
      
      expect(api.default.post).toHaveBeenCalledWith('/treinador', mockTreinador);
      expect(result).toEqual(mockTreinador);
    });
  });

  describe('AuthService', () => {
    it('deve fazer login e armazenar token', async () => {
      const mockResponse = {
        data: {
          access_token: 'fake-token',
          user: { id: 1, name: 'Test User', role: 'user' }
        }
      };
      const api = await import('../services/api');
      api.default.post.mockResolvedValue(mockResponse);

      const result = await authService.login('test@test.com', 'password');
      
      expect(api.default.post).toHaveBeenCalledWith('/login', {
        email: 'test@test.com',
        password: 'password'
      });
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
      expect(result.token).toBe('fake-token');
    });

    it('deve fazer logout e limpar storage', async () => {
      const api = await import('../services/api');
      api.default.post.mockResolvedValue({});

      await authService.logout();
      
      expect(api.default.post).toHaveBeenCalledWith('/logout');
      expect(localStorage.removeItem).toHaveBeenCalledWith('token');
      expect(localStorage.removeItem).toHaveBeenCalledWith('user');
    });

    it('deve verificar se está autenticado', () => {
      localStorage.getItem.mockReturnValue('fake-token');
      
      const result = authService.isAuthenticated();
      
      expect(result).toBe(true);
    });
  });
});