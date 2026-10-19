import React from 'react';
import { DigimonAttribute } from '../types/digimon';

interface HexBadgeProps {
  label: string;
  type?: 'attribute' | 'level' | 'rank' | 'custom';
  attribute?: DigimonAttribute;
  color?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const HexBadge: React.FC<HexBadgeProps> = ({
  label,
  type = 'custom',
  attribute,
  color,
  size = 'md'
}) => {
  let badgeColor = color || 'var(--color-cyan)';

  if (type === 'attribute') {
    if (attribute === 'Vaccine') badgeColor = 'var(--attr-vaccine)';
    else if (attribute === 'Data') badgeColor = 'var(--attr-data)';
    else if (attribute === 'Virus') badgeColor = 'var(--attr-virus)';
    else badgeColor = 'var(--attr-free)';
  } else if (type === 'level') {
    badgeColor = 'var(--color-orange)';
  }

  const padding = size === 'sm' ? '0.15rem 0.5rem' : size === 'lg' ? '0.4rem 1rem' : '0.25rem 0.75rem';
  const fontSize = size === 'sm' ? '0.7rem' : size === 'lg' ? '0.95rem' : '0.8rem';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.35rem',
      padding,
      fontSize,
      fontWeight: 800,
      letterSpacing: '0.75px',
      textTransform: 'uppercase',
      color: '#fff',
      backgroundColor: `rgba(${badgeColor.includes('var') ? '20, 108, 255' : '12, 28, 54'}, 0.45)`,
      border: `1px solid ${badgeColor}`,
      clipPath: 'var(--clip-chamfer)',
      boxShadow: `0 0 8px ${badgeColor}33`
    }}>
      <span style={{
        width: '6px',
        height: '6px',
        borderRadius: '50%',
        backgroundColor: badgeColor,
        boxShadow: `0 0 6px ${badgeColor}`
      }} />
      {label}
    </span>
  );
};
