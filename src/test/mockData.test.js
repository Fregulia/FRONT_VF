import { describe, it, expect } from 'vitest';
import esportesMock from '../mock/esportes.json';
import atletasMock from '../mock/atletas.json';
import treinadoresMock from '../mock/treinadores.json';

describe('Dados Mockados', () => {
  describe('Esportes Mock', () => {
    it('deve ter estrutura correta', () => {
      expect(esportesMock).toBeInstanceOf(Array);
      expect(esportesMock.length).toBeGreaterThan(0);
      
      const esporte = esportesMock[0];
      expect(esporte).toHaveProperty('id');
      expect(esporte).toHaveProperty('nome');
      expect(esporte).toHaveProperty('federacao');
      expect(esporte).toHaveProperty('descricao');
      expect(esporte).toHaveProperty('atletas');
      expect(esporte).toHaveProperty('treinadores');
    });

    it('deve ter dados válidos', () => {
      esportesMock.forEach(esporte => {
        expect(typeof esporte.id).toBe('number');
        expect(typeof esporte.nome).toBe('string');
        expect(typeof esporte.federacao).toBe('string');
        expect(esporte.nome.length).toBeGreaterThan(0);
        expect(esporte.federacao.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Atletas Mock', () => {
    it('deve ter estrutura correta', () => {
      expect(atletasMock).toBeInstanceOf(Array);
      expect(atletasMock.length).toBeGreaterThan(0);
      
      const atleta = atletasMock[0];
      expect(atleta).toHaveProperty('id');
      expect(atleta).toHaveProperty('nome');
      expect(atleta).toHaveProperty('idade');
      expect(atleta).toHaveProperty('categoria');
      expect(atleta).toHaveProperty('esporte');
      expect(atleta).toHaveProperty('treinadores');
    });

    it('deve ter idades válidas', () => {
      atletasMock.forEach(atleta => {
        expect(typeof atleta.idade).toBe('number');
        expect(atleta.idade).toBeGreaterThanOrEqual(16);
        expect(atleta.idade).toBeLessThanOrEqual(50);
      });
    });

    it('deve ter categorias válidas', () => {
      const categoriasValidas = ['Juvenil', 'Adulto', 'Master', 'Profissional'];
      atletasMock.forEach(atleta => {
        expect(categoriasValidas).toContain(atleta.categoria);
      });
    });

    it('deve ter relacionamento com esporte', () => {
      atletasMock.forEach(atleta => {
        expect(atleta.esporte).toHaveProperty('id');
        expect(atleta.esporte).toHaveProperty('nome');
        expect(atleta.esporte).toHaveProperty('federacao');
      });
    });
  });

  describe('Treinadores Mock', () => {
    it('deve ter estrutura correta', () => {
      expect(treinadoresMock).toBeInstanceOf(Array);
      expect(treinadoresMock.length).toBeGreaterThan(0);
      
      const treinador = treinadoresMock[0];
      expect(treinador).toHaveProperty('id');
      expect(treinador).toHaveProperty('nome');
      expect(treinador).toHaveProperty('cref');
      expect(treinador).toHaveProperty('especialidade');
      expect(treinador).toHaveProperty('esporte');
      expect(treinador).toHaveProperty('atletas');
    });

    it('deve ter CREF válidos', () => {
      treinadoresMock.forEach(treinador => {
        expect(typeof treinador.cref).toBe('string');
        expect(treinador.cref).toMatch(/CREF-\d+-\d+/);
      });
    });

    it('deve ter especialidades válidas', () => {
      const especialidadesValidas = ['Preparação Física', 'Técnico', 'Fisioterapia', 'Nutrição'];
      treinadoresMock.forEach(treinador => {
        expect(especialidadesValidas).toContain(treinador.especialidade);
      });
    });

    it('deve ter relacionamento com esporte', () => {
      treinadoresMock.forEach(treinador => {
        expect(treinador.esporte).toHaveProperty('id');
        expect(treinador.esporte).toHaveProperty('nome');
        expect(treinador.esporte).toHaveProperty('federacao');
      });
    });
  });

  describe('Integridade dos Relacionamentos', () => {
    it('deve ter consistência entre esportes e atletas', () => {
      const esporteIds = esportesMock.map(e => e.id);
      atletasMock.forEach(atleta => {
        expect(esporteIds).toContain(atleta.esporte.id);
      });
    });

    it('deve ter consistência entre esportes e treinadores', () => {
      const esporteIds = esportesMock.map(e => e.id);
      treinadoresMock.forEach(treinador => {
        expect(esporteIds).toContain(treinador.esporte.id);
      });
    });

    it('deve ter relacionamentos bidirecionais corretos', () => {
      // Verificar se atletas listados em esportes existem
      esportesMock.forEach(esporte => {
        esporte.atletas.forEach(atleta => {
          const atletaCompleto = atletasMock.find(a => a.id === atleta.id);
          expect(atletaCompleto).toBeDefined();
          expect(atletaCompleto.esporte.id).toBe(esporte.id);
        });
      });

      // Verificar se treinadores listados em esportes existem
      esportesMock.forEach(esporte => {
        esporte.treinadores.forEach(treinador => {
          const treinadorCompleto = treinadoresMock.find(t => t.id === treinador.id);
          expect(treinadorCompleto).toBeDefined();
          expect(treinadorCompleto.esporte.id).toBe(esporte.id);
        });
      });
    });
  });
});