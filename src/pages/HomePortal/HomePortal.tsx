import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { soundFx } from '../../services/soundFx';
import { Sparkles, ArrowRight, ShieldCheck, Cpu, Dna, Swords, Compass } from 'lucide-react';

export const HomePortal: React.FC = () => {
  const navigate = useNavigate();
  const [isEntering, setIsEntering] = useState(false);

  const handleEnterWorld = () => {
    soundFx.playDigivolve();
    setIsEntering(true);
    setTimeout(() => {
      navigate('/digidex');
    }, 1200);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 70px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Portal Digital Giratório ao Fundo */}
      <div style={{
        position: 'absolute',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        border: '3px dashed var(--color-cyan)',
        boxShadow: '0 0 60px rgba(0, 217, 255, 0.3), inset 0 0 60px rgba(20, 108, 255, 0.3)',
        animation: 'rotatePlate 25s linear infinite',
        pointerEvents: 'none',
        opacity: 0.6
      }} />

      {/* Hero Content */}
      <div style={{
        position: 'relative',
        zIndex: 5,
        textAlign: 'center',
        maxWidth: '850px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.25rem'
      }}>
        {/* Badge de Versão */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'rgba(20, 108, 255, 0.2)',
          border: '1px solid var(--color-cyan)',
          padding: '0.35rem 0.85rem',
          clipPath: 'var(--clip-chamfer)',
          fontSize: '0.8rem',
          fontFamily: 'var(--font-mono)',
          color: 'var(--color-cyan)',
          letterSpacing: '1px'
        }}>
          <Cpu size={14} /> SISTEMA OPERACIONAL DIGIVERSE • v1.0 ONLINE
        </div>

        {/* Título Principal */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
          fontWeight: 900,
          letterSpacing: '2px',
          lineHeight: 1.1,
          background: 'linear-gradient(180deg, #ffffff 20%, var(--color-cyan) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 40px rgba(0, 217, 255, 0.5)'
        }}>
          DIGIVERSE
        </h1>
        <div style={{
          fontSize: 'clamp(1rem, 2vw, 1.4rem)',
          fontWeight: 700,
          color: 'var(--color-orange)',
          letterSpacing: '3px',
          textTransform: 'uppercase'
        }}>
          Digital Monster Experience
        </div>

        <p style={{
          fontSize: '1.05rem',
          color: 'var(--color-text-muted)',
          lineHeight: 1.6,
          maxWidth: '680px'
        }}>
          Plataforma digital definitiva com mais de <strong>1.400 Digimon</strong> canônicos da DAPI, laboratório de
          Digievoluções multirrota, arena tática cinematográfica, RPG 2D do Mundo Digital, centro de treino e coleção TCG.
        </p>

        {/* Botão de Entrada Digital Gate */}
        <button
          onClick={handleEnterWorld}
          style={{
            marginTop: '1rem',
            background: 'linear-gradient(90deg, var(--color-primary), var(--color-cyan))',
            color: '#081426',
            padding: '1rem 2.5rem',
            clipPath: 'var(--clip-chamfer-lg)',
            fontWeight: 900,
            fontSize: '1.15rem',
            letterSpacing: '2px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            boxShadow: '0 0 30px rgba(0, 217, 255, 0.6)',
            transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
            transform: isEntering ? 'scale(0.95)' : 'scale(1)'
          }}
        >
          <Sparkles size={20} />
          <span>ENTRAR NO MUNDO DIGITAL</span>
          <ArrowRight size={20} />
        </button>

        {/* Créditos de Autoria */}
        <div style={{
          marginTop: '2rem',
          fontSize: '0.85rem',
          color: 'var(--color-text-muted)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem'
        }}>
          <span>Developed with passion by</span>
          <strong style={{ color: 'var(--color-cyan)' }}>luscaarmstrong</strong>
        </div>
      </div>
    </div>
  );
};
