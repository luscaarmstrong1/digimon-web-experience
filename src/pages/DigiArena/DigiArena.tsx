import React, { useState, useEffect } from 'react';
import rawDigimonList from '../../data/digimon_catalog.json';
import { DigimonDefinition, SkillDefinition, DigimonAttribute } from '../../types/digimon';
import { HexBadge } from '../../components/HexBadge';
import { soundFx } from '../../services/soundFx';
import confetti from 'canvas-confetti';
import { Swords, Shield, Zap, RefreshCw, Trophy, Skull } from 'lucide-react';

const catalog = rawDigimonList as DigimonDefinition[];

export interface BattleFighter {
  definition: DigimonDefinition;
  currentHp: number;
  maxHp: number;
  currentSp: number;
  maxSp: number;
  isDefending: boolean;
}

// 10 Arenas Temáticas Distintas com Backgrounds Gradientes e Partículas Específicas
export const BATTLE_ARENAS = [
  { id: 'coliseum', name: 'Coliseu Digital', bg: 'radial-gradient(circle at 50% 80%, #1e3c72 0%, #081426 80%)', floor: '#102244' },
  { id: 'forest', name: 'Floresta Primordial', bg: 'radial-gradient(circle at 50% 80%, #0d4b2e 0%, #051a11 80%)', floor: '#0c3822' },
  { id: 'cyberpunk', name: 'Cidade Cyberpunk', bg: 'radial-gradient(circle at 50% 80%, #4a154b 0%, #0d051c 80%)', floor: '#2a0c3b' },
  { id: 'volcano', name: 'Vulcão de Dados', bg: 'radial-gradient(circle at 50% 80%, #7c1a1a 0%, #1a0404 80%)', floor: '#4a0f0f' },
  { id: 'ocean', name: 'Oceano Digital', bg: 'radial-gradient(circle at 50% 80%, #0f52ba 0%, #04162e 80%)', floor: '#08336a' },
  { id: 'crystals', name: 'Caverna de Cristais', bg: 'radial-gradient(circle at 50% 80%, #5e258d 0%, #150624 80%)', floor: '#3d165c' },
  { id: 'desert', name: 'Deserto de Circuitos', bg: 'radial-gradient(circle at 50% 80%, #b8860b 0%, #241a02 80%)', floor: '#634805' },
  { id: 'temple', name: 'Templo Sagrado', bg: 'radial-gradient(circle at 50% 80%, #d4af37 0%, #292208 80%)', floor: '#705c1d' },
  { id: 'dark_area', name: 'Zona Corrompida', bg: 'radial-gradient(circle at 50% 80%, #300038 0%, #08000a 80%)', floor: '#1f0024' },
  { id: 'core', name: 'Arena do Núcleo Digital', bg: 'radial-gradient(circle at 50% 80%, #00d9ff 0%, #081426 80%)', floor: '#062d4c' }
];

export const DigiArena: React.FC = () => {
  const [arenaIndex, setArenaIndex] = useState(0);
  const currentArena = BATTLE_ARENAS[arenaIndex];

  // Lutadores
  const playerBase = catalog.find(d => d.name.toLowerCase() === 'agumon') || catalog[0];
  const enemyBase = catalog.find(d => d.name.toLowerCase() === 'betamon') || catalog[3];

  const [player, setPlayer] = useState<BattleFighter>({
    definition: playerBase,
    currentHp: playerBase.stats.hp,
    maxHp: playerBase.stats.hp,
    currentSp: playerBase.stats.sp,
    maxSp: playerBase.stats.sp,
    isDefending: false
  });

  const [enemy, setEnemy] = useState<BattleFighter>({
    definition: enemyBase,
    currentHp: enemyBase.stats.hp,
    maxHp: enemyBase.stats.hp,
    currentSp: enemyBase.stats.sp,
    maxSp: enemyBase.stats.sp,
    isDefending: false
  });

  const [battleLog, setBattleLog] = useState<string[]>([
    'A batalha no Mundo Digital começou! Selecione seu comando.'
  ]);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [battleState, setBattleState] = useState<'ACTIVE' | 'VICTORY' | 'DEFEAT'>('ACTIVE');

  // Multiplicador canônico do triângulo de atributos
  // Vaccine > Virus > Data > Vaccine
  const getAttributeMultiplier = (attackerAttr: DigimonAttribute, defenderAttr: DigimonAttribute): number => {
    if (attackerAttr === 'Vaccine' && defenderAttr === 'Virus') return 1.5;
    if (attackerAttr === 'Virus' && defenderAttr === 'Data') return 1.5;
    if (attackerAttr === 'Data' && defenderAttr === 'Vaccine') return 1.5;

    if (attackerAttr === 'Virus' && defenderAttr === 'Vaccine') return 0.75;
    if (attackerAttr === 'Data' && defenderAttr === 'Virus') return 0.75;
    if (attackerAttr === 'Vaccine' && defenderAttr === 'Data') return 0.75;

    return 1.0;
  };

  // Turno do Jogador
  const handlePlayerAttack = (skill?: SkillDefinition) => {
    if (!isPlayerTurn || isAnimating || battleState !== 'ACTIVE') return;

    setIsAnimating(true);
    soundFx.playHit();

    const mult = getAttributeMultiplier(player.definition.attribute, enemy.definition.attribute);
    const skillPower = skill?.power || 35;
    const spCost = skill?.spCost || 0;

    if (spCost > player.currentSp) {
      setBattleLog(prev => ['SP insuficiente para esta técnica especial!', ...prev.slice(0, 5)]);
      setIsAnimating(false);
      return;
    }

    // Cálculo de Dano
    const baseDamage = Math.floor(((player.definition.stats.atk * 1.5 * skillPower) / (enemy.isDefending ? enemy.definition.stats.def * 2 : enemy.definition.stats.def)) * mult);
    const finalDamage = Math.max(10, baseDamage + Math.floor(Math.random() * 10 - 5));

    const newEnemyHp = Math.max(0, enemy.currentHp - finalDamage);
    const newPlayerSp = Math.max(0, player.currentSp - spCost);

    setEnemy(prev => ({ ...prev, currentHp: newEnemyHp, isDefending: false }));
    setPlayer(prev => ({ ...prev, currentSp: newPlayerSp, isDefending: false }));

    const attackName = skill ? skill.name : 'Ataque Físico';
    const effText = mult > 1 ? ' (SUPER EFETIVO! Vantagem de Atributo)' : mult < 1 ? ' (Pouco efetivo)' : '';
    setBattleLog(prev => [
      `${player.definition.name} usou ${attackName}! Causou ${finalDamage} de dano${effText}.`,
      ...prev.slice(0, 5)
    ]);

    // Verificar se venceu
    if (newEnemyHp <= 0) {
      setBattleState('VICTORY');
      setIsAnimating(false);
      soundFx.playVictory();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      setBattleLog(prev => [`VITÓRIA! ${enemy.definition.name} foi derrotado! Dados assimilados!`, ...prev.slice(0, 5)]);
      return;
    }

    // Passar para o turno da IA
    setIsPlayerTurn(false);
    setTimeout(() => {
      handleEnemyTurn(newEnemyHp);
    }, 1200);
  };

  const handlePlayerDefend = () => {
    if (!isPlayerTurn || isAnimating || battleState !== 'ACTIVE') return;
    soundFx.playClick();
    setPlayer(prev => ({ ...prev, isDefending: true, currentSp: Math.min(prev.maxSp, prev.currentSp + 15) }));
    setBattleLog(prev => [`${player.definition.name} assumiu postura defensiva e recuperou 15 SP!`, ...prev.slice(0, 5)]);
    setIsPlayerTurn(false);
    setTimeout(() => {
      handleEnemyTurn(enemy.currentHp);
    }, 1000);
  };

  // Turno da IA
  const handleEnemyTurn = (currentEnemyHp: number) => {
    if (currentEnemyHp <= 0) return;
    soundFx.playHit();

    const mult = getAttributeMultiplier(enemy.definition.attribute, player.definition.attribute);
    const enemyAtk = enemy.definition.stats.atk;
    const playerDef = player.isDefending ? player.definition.stats.def * 2 : player.definition.stats.def;

    const baseDamage = Math.floor(((enemyAtk * 1.4 * 35) / playerDef) * mult);
    const finalDamage = Math.max(10, baseDamage + Math.floor(Math.random() * 8 - 4));

    setPlayer(prev => {
      const newPlayerHp = Math.max(0, prev.currentHp - finalDamage);
      if (newPlayerHp <= 0) {
        setBattleState('DEFEAT');
        setBattleLog(log => [`DERROTA! Seu parceiro caiu em combate!`, ...log.slice(0, 5)]);
      }
      return { ...prev, currentHp: newPlayerHp, isDefending: false };
    });

    const effText = mult > 1 ? ' (SUPER EFETIVO!)' : mult < 1 ? ' (Pouco efetivo)' : '';
    setBattleLog(prev => [
      `${enemy.definition.name} atacou! Causou ${finalDamage} de dano${effText}.`,
      ...prev.slice(0, 5)
    ]);

    setIsAnimating(false);
    setIsPlayerTurn(true);
  };

  // Reiniciar / Próxima Batalha
  const handleResetBattle = (nextEnemy?: DigimonDefinition) => {
    soundFx.playClick();
    const opponent = nextEnemy || catalog[Math.floor(Math.random() * 80) + 2];
    setEnemy({
      definition: opponent,
      currentHp: opponent.stats.hp,
      maxHp: opponent.stats.hp,
      currentSp: opponent.stats.sp,
      maxSp: opponent.stats.sp,
      isDefending: false
    });
    setPlayer(prev => ({
      ...prev,
      currentHp: prev.maxHp,
      currentSp: prev.maxSp,
      isDefending: false
    }));
    setBattleState('ACTIVE');
    setIsPlayerTurn(true);
    setIsAnimating(false);
    setBattleLog([`Um ${opponent.name} selvagem apareceu! Prepare-se!`]);
  };

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    }}>
      {/* Seletor de Arena & Controles Superiores */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-surface-border)',
        padding: '0.8rem 1.25rem',
        clipPath: 'var(--clip-chamfer)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Swords size={20} color="var(--color-cyan)" />
          <span style={{ fontWeight: 800, fontSize: '1.1rem' }}>DIGIARENA CINEMATOGRÁFICA</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>• {currentArena.name}</span>
        </div>

        {/* Escolha entre as 10 Arenas */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <select
            value={arenaIndex}
            onChange={(e) => {
              soundFx.playClick();
              setArenaIndex(Number(e.target.value));
            }}
            style={{
              background: 'var(--color-bg)',
              border: '1px solid var(--color-cyan)',
              color: '#fff',
              padding: '0.4rem 0.8rem',
              clipPath: 'var(--clip-chamfer)',
              fontSize: '0.85rem'
            }}
          >
            {BATTLE_ARENAS.map((a, i) => (
              <option key={a.id} value={i}>{a.name}</option>
            ))}
          </select>

          <button
            onClick={() => handleResetBattle()}
            style={{
              background: 'var(--color-bg)',
              border: '1px solid var(--color-surface-border)',
              color: 'var(--color-cyan)',
              padding: '0.4rem 0.8rem',
              clipPath: 'var(--clip-chamfer)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.85rem',
              fontWeight: 700
            }}
          >
            <RefreshCw size={14} /> Novo Inimigo
          </button>
        </div>
      </div>

      {/* Cenário de Batalha com Perspectiva e Luzes */}
      <div style={{
        position: 'relative',
        height: '460px',
        background: currentArena.bg,
        border: '1px solid var(--color-surface-border)',
        clipPath: 'var(--clip-chamfer-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2rem',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Chão Isométrico da Arena */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '140px',
          background: `linear-gradient(to top, ${currentArena.floor}, transparent)`,
          borderTop: '1px solid rgba(0, 217, 255, 0.2)'
        }} />

        {/* HUD Inimigo (Topo Esquerda / Direita) */}
        <div style={{
          alignSelf: 'flex-end',
          background: 'rgba(8, 20, 38, 0.85)',
          border: '1px solid var(--color-surface-border)',
          clipPath: 'var(--clip-chamfer)',
          padding: '1rem',
          width: '320px',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{enemy.definition.name}</span>
            <HexBadge label={enemy.definition.attribute} type="attribute" attribute={enemy.definition.attribute} size="sm" />
          </div>
          {/* Barra de HP Inimigo */}
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
              <span style={{ color: 'var(--color-green)' }}>HP</span>
              <span>{enemy.currentHp} / {enemy.maxHp}</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.round((enemy.currentHp / enemy.maxHp) * 100)}%`,
                background: 'var(--color-green)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </div>

        {/* Sprites dos Lutadores em Batalha */}
        <div style={{
          position: 'relative',
          height: '180px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 4rem',
          zIndex: 5
        }}>
          {/* Jogador Sprite (Canto Inferior Esquerdo) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: 'scaleX(1)',
            filter: player.isDefending ? 'drop-shadow(0 0 15px #146cff)' : 'none',
            transition: 'all 0.3s ease'
          }}>
            <img
              src={player.definition.image}
              alt={player.definition.name}
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.6))'
              }}
            />
          </div>

          {/* VS Holográfico no Centro */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '1.8rem',
            fontWeight: 900,
            color: 'var(--color-cyan)',
            opacity: 0.6,
            letterSpacing: '2px'
          }}>
            VS
          </div>

          {/* Inimigo Sprite (Canto Superior Direito) */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: 'scaleX(-1)',
            transition: 'all 0.3s ease'
          }}>
            <img
              src={enemy.definition.image}
              alt={enemy.definition.name}
              style={{
                width: '150px',
                height: '150px',
                objectFit: 'contain',
                filter: 'drop-shadow(0 15px 15px rgba(0,0,0,0.6))'
              }}
            />
          </div>
        </div>

        {/* HUD Jogador (Inferior Esquerdo) */}
        <div style={{
          alignSelf: 'flex-start',
          background: 'rgba(8, 20, 38, 0.85)',
          border: '1px solid var(--color-cyan)',
          clipPath: 'var(--clip-chamfer)',
          padding: '1rem',
          width: '320px',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--color-cyan)' }}>{player.definition.name}</span>
            <HexBadge label={player.definition.attribute} type="attribute" attribute={player.definition.attribute} size="sm" />
          </div>
          {/* Barra de HP Jogador */}
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
              <span style={{ color: 'var(--color-green)' }}>HP</span>
              <span>{player.currentHp} / {player.maxHp}</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '3px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.round((player.currentHp / player.maxHp) * 100)}%`,
                background: 'var(--color-green)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
          {/* Barra de SP Jogador */}
          <div style={{ marginTop: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.2rem' }}>
              <span style={{ color: 'var(--color-cyan)' }}>SP</span>
              <span>{player.currentSp} / {player.maxSp}</span>
            </div>
            <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${Math.round((player.currentSp / player.maxSp) * 100)}%`,
                background: 'var(--color-cyan)',
                transition: 'width 0.3s ease'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Painel Inferior: Ações de Combate & Log de Batalha */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 1fr) 360px',
        gap: '1.25rem'
      }}>
        {/* Comandos de Combate */}
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
            letterSpacing: '1px',
            fontFamily: 'var(--font-mono)'
          }}>
            COMANDOS DE COMBATE DIGIVICE • {isPlayerTurn ? 'SEU TURNO' : 'TURNO DO OPONENTE...'}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
            <button
              onClick={() => handlePlayerAttack()}
              disabled={!isPlayerTurn || isAnimating || battleState !== 'ACTIVE'}
              style={{
                background: 'linear-gradient(90deg, var(--color-primary), rgba(20, 108, 255, 0.6))',
                color: '#fff',
                padding: '0.75rem',
                clipPath: 'var(--clip-chamfer)',
                fontWeight: 800,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                opacity: (!isPlayerTurn || isAnimating || battleState !== 'ACTIVE') ? 0.5 : 1
              }}
            >
              <Swords size={16} /> Ataque Físico
            </button>

            <button
              onClick={handlePlayerDefend}
              disabled={!isPlayerTurn || isAnimating || battleState !== 'ACTIVE'}
              style={{
                background: 'var(--color-bg)',
                border: '1px solid var(--color-surface-border)',
                color: 'var(--color-cyan)',
                padding: '0.75rem',
                clipPath: 'var(--clip-chamfer)',
                fontWeight: 800,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem',
                opacity: (!isPlayerTurn || isAnimating || battleState !== 'ACTIVE') ? 0.5 : 1
              }}
            >
              <Shield size={16} /> Defender (+15 SP)
            </button>
          </div>

          {/* Técnicas Especiais com Gasto de SP */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginTop: '0.2rem' }}>
            {player.definition.skills?.slice(0, 2).map((sk, idx) => (
              <button
                key={idx}
                onClick={() => handlePlayerAttack({ ...sk, power: 55 + idx * 20, spCost: 15 + idx * 10 })}
                disabled={!isPlayerTurn || isAnimating || battleState !== 'ACTIVE' || player.currentSp < (15 + idx * 10)}
                style={{
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-orange)',
                  color: '#fff',
                  padding: '0.65rem 0.85rem',
                  clipPath: 'var(--clip-chamfer)',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.2rem',
                  opacity: (!isPlayerTurn || isAnimating || battleState !== 'ACTIVE' || player.currentSp < (15 + idx * 10)) ? 0.45 : 1
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.88rem' }}>{sk.name}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {15 + idx * 10} SP
                  </span>
                </div>
                <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)' }}>
                  Poder {55 + idx * 20}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Terminal de Logs de Batalha */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-border)',
          clipPath: 'var(--clip-chamfer)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-cyan)',
            letterSpacing: '1px'
          }}>
            TERMINAL DE LOGS DE COMBATE
          </div>
          <div style={{
            background: 'var(--color-bg)',
            padding: '0.75rem',
            clipPath: 'var(--clip-chamfer)',
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            fontSize: '0.8rem',
            fontFamily: 'var(--font-mono)'
          }}>
            {battleLog.map((log, index) => (
              <div key={index} style={{
                color: index === 0 ? 'var(--color-cyan)' : 'var(--color-text-muted)',
                lineHeight: 1.4
              }}>
                &gt; {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
