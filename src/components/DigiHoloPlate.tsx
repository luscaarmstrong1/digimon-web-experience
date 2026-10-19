import React from 'react';
import { DigimonDefinition } from '../types/digimon';

interface DigiHoloPlateProps {
  digimon: DigimonDefinition;
  size?: number;
}

export const DigiHoloPlate: React.FC<DigiHoloPlateProps> = ({ digimon, size = 320 }) => {
  const attrColor = digimon.attribute === 'Vaccine' ? 'var(--attr-vaccine)' :
                    digimon.attribute === 'Virus' ? 'var(--attr-virus)' :
                    digimon.attribute === 'Data' ? 'var(--attr-data)' : 'var(--attr-free)';

  return (
    <div style={{
      position: 'relative',
      width: `${size}px`,
      height: `${size * 1.15}px`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-end',
      perspective: '800px',
      margin: '0 auto'
    }}>
      {/* Luz Vertical de Escaneamento Holográfico */}
      <div style={{
        position: 'absolute',
        top: '10%',
        bottom: '25%',
        width: '85%',
        background: `radial-gradient(ellipse at bottom, ${attrColor}22 0%, transparent 70%)`,
        pointerEvents: 'none',
        zIndex: 1
      }} />

      {/* Digimon Sprite / Imagem Oficial */}
      <div style={{
        position: 'relative',
        zIndex: 3,
        animation: 'floatAnim 3.5s ease-in-out infinite',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '20px'
      }}>
        <img
          src={digimon.image}
          alt={digimon.name}
          style={{
            maxWidth: `${size * 0.85}px`,
            maxHeight: `${size * 0.85}px`,
            objectFit: 'contain',
            filter: `drop-shadow(0 10px 20px rgba(0, 0, 0, 0.6)) drop-shadow(0 0 16px ${attrColor}44)`,
            transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
          }}
          onError={(e) => {
            // Fallback caso a imagem remota sofra lentidão
            (e.target as HTMLImageElement).src = 'https://digi-api.com/images/digimon/w/Agumon.png';
          }}
        />
      </div>

      {/* Plataforma Holográfica Isométrica Base */}
      <div style={{
        position: 'relative',
        width: `${size * 0.9}px`,
        height: `${size * 0.4}px`,
        transform: 'rotateX(65deg)',
        transformStyle: 'preserve-3d',
        zIndex: 2,
        marginBottom: '-20px'
      }}>
        {/* Anel Exterior Holográfico */}
        <div style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          border: `2px dashed ${attrColor}`,
          boxShadow: `0 0 25px ${attrColor}88, inset 0 0 25px ${attrColor}44`,
          animation: 'rotatePlate 14s linear infinite'
        }} />

        {/* Anel Interior */}
        <div style={{
          position: 'absolute',
          inset: '18%',
          borderRadius: '50%',
          border: '2px solid rgba(255, 255, 255, 0.5)',
          background: 'radial-gradient(circle, rgba(0, 217, 255, 0.25) 0%, transparent 80%)'
        }} />

        {/* Padrão de Grade Digital Hexagonal */}
        <div style={{
          position: 'absolute',
          inset: '30%',
          clipPath: 'var(--clip-hex)',
          background: attrColor,
          opacity: 0.35,
          filter: 'blur(2px)'
        }} />
      </div>

      {/* Telemetria do Digimon na base */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        fontSize: '0.75rem',
        fontFamily: 'var(--font-mono)',
        color: 'var(--color-cyan)',
        letterSpacing: '1px',
        zIndex: 4,
        background: 'rgba(8, 20, 38, 0.85)',
        padding: '0.2rem 0.6rem',
        borderRadius: '4px',
        border: '1px solid rgba(0, 217, 255, 0.3)'
      }}>
        <span>ID #{String(digimon.id).padStart(4, '0')}</span>
        <span>•</span>
        <span>{digimon.type.toUpperCase()}</span>
      </div>
    </div>
  );
};
