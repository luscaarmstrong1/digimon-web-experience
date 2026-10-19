import { describe, it, expect } from 'vitest';
import { DigimonAttribute } from './types/digimon';

const getAttributeMultiplier = (attackerAttr: DigimonAttribute, defenderAttr: DigimonAttribute): number => {
  if (attackerAttr === 'Vaccine' && defenderAttr === 'Virus') return 1.5;
  if (attackerAttr === 'Virus' && defenderAttr === 'Data') return 1.5;
  if (attackerAttr === 'Data' && defenderAttr === 'Vaccine') return 1.5;

  if (attackerAttr === 'Virus' && defenderAttr === 'Vaccine') return 0.75;
  if (attackerAttr === 'Data' && defenderAttr === 'Virus') return 0.75;
  if (attackerAttr === 'Vaccine' && defenderAttr === 'Data') return 0.75;

  return 1.0;
};

describe('DIGIVERSE Battle Attribute Triangle Engine', () => {
  it('Vaccine deve vencer Virus com multiplicador 1.5x', () => {
    expect(getAttributeMultiplier('Vaccine', 'Virus')).toBe(1.5);
  });

  it('Virus deve vencer Data com multiplicador 1.5x', () => {
    expect(getAttributeMultiplier('Virus', 'Data')).toBe(1.5);
  });

  it('Data deve vencer Vaccine com multiplicador 1.5x', () => {
    expect(getAttributeMultiplier('Data', 'Vaccine')).toBe(1.5);
  });

  it('Atributo em desvantagem deve sofrer redução para 0.75x', () => {
    expect(getAttributeMultiplier('Virus', 'Vaccine')).toBe(0.75);
    expect(getAttributeMultiplier('Data', 'Virus')).toBe(0.75);
    expect(getAttributeMultiplier('Vaccine', 'Data')).toBe(0.75);
  });

  it('Atributo Free ou Neutro deve ter multiplicador 1.0x', () => {
    expect(getAttributeMultiplier('Free', 'Vaccine')).toBe(1.0);
    expect(getAttributeMultiplier('Vaccine', 'Free')).toBe(1.0);
  });
});
