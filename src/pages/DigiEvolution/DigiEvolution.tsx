import React, { useState } from 'react';
import rawDigimonList from '../../data/digimon_catalog.json';
import { DigimonDefinition } from '../../types/digimon';
import { HexBadge } from '../../components/HexBadge';
import { soundFx } from '../../services/soundFx';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, Dna, Play, RotateCcw } from 'lucide-react';

const catalog = rawDigimonList as DigimonDefinition[];

export const DigiEvolution: React.FC = () => {
  // Inicializa com Agumon
  const agumon = catalog.find(d => d.name.toLowerCase() === 'agumon') || catalog[0];
  const [currentDigimon, setCurrentDigimon] = useState<DigimonDefinition>(agumon);
  const [isEvolving, setIsEvolving] = useState(false);
  const [evolutionStageText, setEvolutionStageText] = useState('');
  const [targetEvo, setTargetEvo] = useState<DigimonDefinition | null>(null);

  // Árvore de evolução calculada baseada em dados reais
  // Formas anteriores disponíveis
  const priorForms = catalog.filter(d => 
    currentDigimon.priorEvolutions?.some(p => p.name.toLowerCase() === d.name.toLowerCase() || p.id === d.id) ||
    (d.rank === currentDigimon.rank - 1 && d.attribute === currentDigimon.attribute && Math.abs(d.id - currentDigimon.id) < 15)
  ).slice(0, 4);

  // Formas posteriores ramificadas (Múltiplas rotas)
  const nextForms = catalog.filter(d => 
    currentDigimon.nextEvolutions?.some(n => n.name.toLowerCase() === d.name.toLowerCase() || n.id === d.id) ||
    (d.rank === currentDigimon.rank + 1 && (d.attribute === currentDigimon.attribute || d.type === currentDigimon.type) && Math.abs(d.id - currentDigimon.id) < 50)
  ).slice(0, 6);

  // Executar sequência cinematográfica de Digievolução
  const triggerEvolution = (target: DigimonDefinition) => {
    soundFx.playDigivolve();
    setIsEvolving(true);
    setTargetEvo(target);
    setEvolutionStageText('DIGIVICE SINCRONIZADO... INICIANDO TRANSMISSÃO DE DADOS');

    setTimeout(() => {
      setEvolutionStageText(`DESCONSTRUÇÃO BINÁRIA DE ${currentDigimon.name.toUpperCase()}...`);
    }, 900);

    setTimeout(() => {
      setEvolutionStageText(`ASSIMILANDO DADOS DE CLASSE ${target.level.toUpperCase()}...`);
    }, 1800);

    setTimeout(() => {
      setEvolutionStageText(`DIGIVOLVE PARA... ${target.name.toUpperCase()}!`);
      confetti({
        particleCount: 80,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#00d9ff', '#146cff', '#ff8a24', '#7657ff']
      });
      setCurrentDigimon(target);
    }, 2800);

    setTimeout(() => {
      setIsEvolving(false);
      setTargetEvo(null);
      setEvolutionStageText('');
    }, 3800);
  };

  return (
    <div style={{
      maxWidth: '1500px',
      margin: '0 auto',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      position: 'relative'
    }}>
      {/* Modal Cinematográfico de Digievolução Fullscreen */}
      {isEvolving && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'radial-gradient(circle at center, #081b3a 0%, #030812 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          {/* Anéis de Energia Pulsante */}
          <div style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            border: '4px dashed var(--color-cyan)',
            boxShadow: '0 0 50px var(--color-cyan)',
            animation: 'rotatePlate 4s linear infinite'
          }} />

          {/* Silhueta / Revelação da nova forma */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            animation: 'pulseGlow 1s ease-in-out infinite'
          }}>
            <img
              src={targetEvo ? targetEvo.image : currentDigimon.image}
              alt="Evolução"
              style={{
                width: '260px',
                height: '260px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 0 30px #00d9ff)'
              }}
            />
          </div>

          <div style={{
            marginTop: '2rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '1.4rem',
            fontWeight: 800,
            color: 'var(--color-cyan)',
            letterSpacing: '2px',
            textAlign: 'center',
            zIndex: 10,
            textShadow: '0 0 15px rgba(0, 217, 255, 0.8)'
          }}>
            {evolutionStageText}
          </div>
        </div>
      )}

      {/* Header do Módulo */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-surface-border)',
        padding: '1.25rem 1.5rem',
        clipPath: 'var(--clip-chamfer)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-cyan)', fontWeight: 800 }}>
            <Dna size={20} />
            <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>DIGIEVOLUTION LAB</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '0.2rem' }}>
            Grafo Multirrota de Digievoluções Canônicas
          </h1>
        </div>

        {/* Botão de reset para Agumon */}
        <button
          onClick={() => {
            soundFx.playClick();
            setCurrentDigimon(agumon);
          }}
          style={{
            background: 'var(--color-bg)',
            border: '1px solid var(--color-surface-border)',
            color: 'var(--color-cyan)',
            padding: '0.6rem 1rem',
            clipPath: 'var(--clip-chamfer)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontWeight: 700
          }}
        >
          <RotateCcw size={16} /> Resetar para Agumon
        </button>
      </div>

      {/* Grafo de Relações Evolutivas 3 Colunas: Formas Prévias -> Forma Atual -> Formas Posteriores */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(260px, 320px) minmax(320px, 420px) 1fr',
        gap: '1.5rem',
        alignItems: 'center'
      }}>
        {/* Coluna 1: Formas Anteriores */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-border)',
          clipPath: 'var(--clip-chamfer)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: 'var(--color-text-muted)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '1px'
          }}>
            FORMAS ANTERIORES ({priorForms.length})
          </div>

          {priorForms.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              Estágio primordial. Nenhuma forma anterior registrada neste ramo.
            </div>
          ) : (
            priorForms.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  soundFx.playClick();
                  setCurrentDigimon(item);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.75rem',
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-surface-border)',
                  clipPath: 'var(--clip-chamfer)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <img src={item.image} alt={item.name} style={{ width: '45px', height: '45px', objectFit: 'contain' }} />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{item.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{item.level}</div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Coluna 2: Foco Central - Digimon Selecionado */}
        <div style={{
          background: 'linear-gradient(180deg, var(--color-surface), rgba(12, 28, 54, 0.95))',
          border: '2px solid var(--color-cyan)',
          clipPath: 'var(--clip-chamfer-lg)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1.2rem',
          boxShadow: '0 0 30px rgba(0, 217, 255, 0.2)'
        }}>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--color-cyan)',
            letterSpacing: '2px'
          }}>
            NÓ EVOLUTIVO ATUAL
          </div>

          <div style={{
            position: 'relative',
            width: '180px',
            height: '180px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              border: '2px dashed var(--color-cyan)',
              animation: 'rotatePlate 10s linear infinite'
            }} />
            <img
              src={currentDigimon.image}
              alt={currentDigimon.name}
              style={{ width: '150px', height: '150px', objectFit: 'contain', zIndex: 2 }}
            />
          </div>

          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fff' }}>{currentDigimon.name}</h2>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '0.4rem' }}>
              <HexBadge label={currentDigimon.level} type="level" />
              <HexBadge label={currentDigimon.attribute} type="attribute" attribute={currentDigimon.attribute} />
            </div>
          </div>

          <div style={{
            background: 'var(--color-bg)',
            padding: '0.85rem 1rem',
            clipPath: 'var(--clip-chamfer)',
            fontSize: '0.82rem',
            color: 'var(--color-text-muted)',
            lineHeight: 1.5,
            width: '100%'
          }}>
            {currentDigimon.description.slice(0, 180)}...
          </div>
        </div>

        {/* Coluna 3: Ramificações Posteriores (Digievoluções Disponíveis) */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-border)',
          clipPath: 'var(--clip-chamfer)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{
            fontSize: '0.85rem',
            fontWeight: 800,
            color: 'var(--color-cyan)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span>RAMIFICAÇÕES DISPONÍVEIS ({nextForms.length})</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-orange)' }}>SELECIONE PARA DIGIEVOLUIR</span>
          </div>

          {nextForms.length === 0 ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.85rem' }}>
              Forma suprema/final alcançada. Nenhuma evolução posterior direta.
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '0.75rem'
            }}>
              {nextForms.map(item => (
                <div
                  key={item.id}
                  style={{
                    background: 'var(--color-bg)',
                    border: '1px solid var(--color-surface-border)',
                    clipPath: 'var(--clip-chamfer)',
                    padding: '0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.6rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <img src={item.image} alt={item.name} style={{ width: '48px', height: '48px', objectFit: 'contain' }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--color-orange)', fontWeight: 700 }}>
                        {item.level}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => triggerEvolution(item)}
                    style={{
                      background: 'linear-gradient(90deg, var(--color-primary), var(--color-cyan))',
                      color: '#081426',
                      fontWeight: 800,
                      fontSize: '0.82rem',
                      letterSpacing: '0.5px',
                      padding: '0.45rem',
                      clipPath: 'var(--clip-chamfer)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.4rem',
                      boxShadow: '0 0 10px rgba(0, 217, 255, 0.4)'
                    }}
                  >
                    <Sparkles size={14} /> DIGIEVOLUIR
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
