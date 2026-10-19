import { describe, it, expect } from 'vitest';
import rawDigimonList from './data/digimon_catalog.json';
import { DigimonDefinition } from './types/digimon';

const catalog = rawDigimonList as DigimonDefinition[];

describe('DIGIVERSE Canonical Catalog Validation', () => {
  it('deve possuir mais de 1.400 Digimon importados da DAPI', () => {
    expect(catalog.length).toBeGreaterThanOrEqual(1400);
  });

  it('deve conter Agumon com dados canônicos consistentes', () => {
    const agumon = catalog.find(d => d.name.toLowerCase() === 'agumon');
    expect(agumon).toBeDefined();
    expect(agumon?.level).toBe('Child');
    expect(agumon?.attribute).toBe('Vaccine');
    expect(agumon?.stats.hp).toBeGreaterThan(0);
    expect(agumon?.stats.atk).toBeGreaterThan(0);
  });

  it('deve normalizar os atributos na tríade canônica ou Free', () => {
    const validAttributes = ['Vaccine', 'Data', 'Virus', 'Free'];
    catalog.slice(0, 100).forEach(d => {
      expect(validAttributes).toContain(d.attribute);
    });
  });
});
