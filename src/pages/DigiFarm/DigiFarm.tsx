import React, { useState } from 'react';
import rawDigimonList from '../../data/digimon_catalog.json';
import { DigimonDefinition, PartnerInstance } from '../../types/digimon';
import { initialStarterPartner } from '../../storage/profileStorage';
import { soundFx } from '../../services/soundFx';
import { HexBadge } from '../../components/HexBadge';
import confetti from 'canvas-confetti';
import { Dumbbell, Heart, Coffee, ShieldAlert, Sparkles, TrendingUp } from 'lucide-react';

const catalog = rawDigimonList as DigimonDefinition[];

export const DigiFarm: React.FC = () => {
  const [partner, setPartner] = useState<PartnerInstance>(initialStarterPartner);
  const digimonDef = catalog.find(d => d.id === partner.digimonId) || catalog[0];

  const [farmMessage, setFarmMessage] = useState('Seu parceiro está descansando e pronto para treinar na DigiFarm.');

  // Treinos de Atributos Específicos
  const handleTrain = (stat: 'atk' | 'def' | 'spd' | 'int') => {
    soundFx.playScan();
    setPartner(prev => {
      const updatedBonus = { ...prev.bonusStats, [stat]: prev.bonusStats[stat] + 3 };
      const updatedBond = Math.min(100, prev.bond + 2);
      const updatedExp = prev.exp + 25;
      return {
        ...prev,
        bonusStats: updatedBonus,
        bond: updatedBond,
        exp: updatedExp
      };
    });

    const statName = stat === 'atk' ? 'Ataque (+3)' : stat === 'def' ? 'Defesa (+3)' : stat === 'spd' ? 'Velocidade (+3)' : 'Inteligência (+3)';
    setFarmMessage(`Treinamento intensivo concluído! ${statName} aumentou e seu parceiro ganhou EXP.`);
  };

  // Alimentar
  const handleFeed = () => {
    soundFx.playClick();
    setPartner(prev => ({
      ...prev,
      bond: Math.min(100, prev.bond + 8),
      bonusStats: { ...prev.bonusStats, hp: prev.bonusStats.hp + 15 }
    }));
    setFarmMessage('Você alimentou seu parceiro com carne de dados digital! Vínculo +8% e HP Bônus +15.');
  };

  // Descansar
  const handleRest = () => {
    soundFx.playClick();
    setFarmMessage('Seu parceiro dormiu profundamente e recuperou todas as energias para as batalhas na DigiArena!');
  };

  return (
    <div style={{
      maxWidth: '1300px',
      margin: '0 auto',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* Header DigiFarm */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-surface-border)',
        padding: '1.25rem 1.5rem',
        clipPath: 'var(--clip-chamfer)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-green)', fontWeight: 800 }}>
            <TrendingUp size={20} />
            <span style={{ fontFamily: 'var(--font-mono)', letterSpacing: '1px' }}>DIGIFARM TRAINING CENTER</span>
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginTop: '0.2rem' }}>
            Centro de Treinamento e Criação de Parceiros
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <HexBadge label={`Vínculo: ${partner.bond}%`} color="var(--color-cyan)" />
          <HexBadge label={`Nível Farm: ${partner.level}`} color="var(--color-orange)" />
        </div>
      </div>

      {/* Grid Principal: Parceiro Atual & Treinamentos */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 420px) 1fr',
        gap: '1.5rem'
      }}>
        {/* Card do Parceiro */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-border)',
          clipPath: 'var(--clip-chamfer-lg)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '1rem'
        }}>
          <img
            src={digimonDef.image}
            alt={partner.nickname}
            style={{ width: '180px', height: '180px', objectFit: 'contain', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.5))' }}
          />

          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>{partner.nickname}</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-cyan)', marginTop: '0.2rem' }}>
              Espécie: {digimonDef.name} ({digimonDef.level})
            </div>
          </div>

          {/* Barras de Status com Bônus de Treinamento */}
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '0.5rem' }}>
            {[
              { label: 'ATK', val: digimonDef.stats.atk + partner.bonusStats.atk, bonus: partner.bonusStats.atk },
              { label: 'DEF', val: digimonDef.stats.def + partner.bonusStats.def, bonus: partner.bonusStats.def },
              { label: 'SPD', val: digimonDef.stats.spd + partner.bonusStats.spd, bonus: partner.bonusStats.spd },
              { label: 'INT', val: digimonDef.stats.int + partner.bonusStats.int, bonus: partner.bonusStats.int }
            ].map(s => (
              <div key={s.label} style={{
                background: 'var(--color-bg)',
                padding: '0.5rem 0.8rem',
                border: '1px solid var(--color-surface-border)',
                clipPath: 'var(--clip-chamfer)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--color-text-muted)' }}>{s.label}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                  {s.val} <span style={{ color: 'var(--color-green)', fontSize: '0.75rem' }}>(+{s.bonus})</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Minigames e Ações da Fazenda */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Mensagem da Farm */}
          <div style={{
            background: 'rgba(8, 20, 38, 0.7)',
            padding: '1rem 1.25rem',
            borderLeft: '4px solid var(--color-green)',
            clipPath: 'var(--clip-chamfer)',
            fontSize: '0.95rem',
            lineHeight: 1.5
          }}>
            {farmMessage}
          </div>

          {/* Treinos Ativos */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-border)',
            clipPath: 'var(--clip-chamfer)',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}>
            <div style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              color: 'var(--color-cyan)',
              fontFamily: 'var(--font-mono)',
              letterSpacing: '1px'
            }}>
              ESTAÇÕES DE TREINO DE ATRIBUTOS
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <button
                onClick={() => handleTrain('atk')}
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-red)',
                  padding: '1rem',
                  clipPath: 'var(--clip-chamfer)',
                  color: '#fff',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <Dumbbell size={22} color="var(--color-red)" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Treino de Força</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>+3 ATK & EXP</div>
                </div>
              </button>

              <button
                onClick={() => handleTrain('def')}
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-primary)',
                  padding: '1rem',
                  clipPath: 'var(--clip-chamfer)',
                  color: '#fff',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <ShieldAlert size={22} color="var(--color-primary)" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Treino de Resistência</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>+3 DEF & EXP</div>
                </div>
              </button>

              <button
                onClick={() => handleTrain('spd')}
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-gold)',
                  padding: '1rem',
                  clipPath: 'var(--clip-chamfer)',
                  color: '#fff',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <Sparkles size={22} color="var(--color-gold)" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Treino de Agilidade</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>+3 SPD & EXP</div>
                </div>
              </button>

              <button
                onClick={() => handleTrain('int')}
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-purple)',
                  padding: '1rem',
                  clipPath: 'var(--clip-chamfer)',
                  color: '#fff',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <Coffee size={22} color="var(--color-purple)" />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Treino Mental / Dados</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>+3 INT & EXP</div>
                </div>
              </button>
            </div>
          </div>

          {/* Cuidados e Alimentação */}
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-border)',
            clipPath: 'var(--clip-chamfer)',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem'
          }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1rem' }}>Cuidados com o Parceiro</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                Alimente seu Digimon e mantenha um descanso regular para evitar estresse de dados.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem' }}>
              <button
                onClick={handleFeed}
                style={{
                  background: 'linear-gradient(90deg, var(--color-primary), var(--color-cyan))',
                  color: '#081426',
                  padding: '0.55rem 1rem',
                  clipPath: 'var(--clip-chamfer)',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}
              >
                Alimentar (+Bond)
              </button>
              <button
                onClick={handleRest}
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-surface-border)',
                  color: '#fff',
                  padding: '0.55rem 1rem',
                  clipPath: 'var(--clip-chamfer)',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}
              >
                Descansar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
