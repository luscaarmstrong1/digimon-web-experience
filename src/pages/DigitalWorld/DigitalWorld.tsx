import React, { useRef, useEffect, useState } from 'react';
import rawDigimonList from '../../data/digimon_catalog.json';
import { DigimonDefinition } from '../../types/digimon';
import { soundFx } from '../../services/soundFx';
import { MapPin, Compass, CheckCircle2, User, Zap, Sparkles } from 'lucide-react';

const catalog = rawDigimonList as DigimonDefinition[];

// 7 Regiões Principais do Mundo Digital
export const REGIONS = [
  { id: 'village', name: 'DigiVillage', color: '#146cff', desc: 'Ponto inicial seguro com laboratório, teleporte e NPCs.' },
  { id: 'forest', name: 'Ancient Forest', color: '#2ecc71', desc: 'Árvores monumentais e Digimon selvagens de atributo Natureza.' },
  { id: 'city', name: 'Circuit City', color: '#9b59b6', desc: 'Metrópole tecnológica com linhas luminosas e dados binários.' },
  { id: 'caverns', name: 'Crystal Caverns', color: '#1abc9c', desc: 'Galerias subterrâneas ricas em minérios digitais e cristais.' },
  { id: 'ocean', name: 'Data Ocean', color: '#3498db', desc: 'Costa oceânica com ilhas flutuantes e correntes de bytes.' },
  { id: 'mountains', name: 'Firewall Mountains', color: '#e67e22', desc: 'Vulcões protetores que incineram vírus e intrusões.' },
  { id: 'dark_area', name: 'Dark Area', color: '#e74c3c', desc: 'Setor isolado e misterioso com fendas para o submundo.' }
];

export const DigitalWorld: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentRegionIndex, setCurrentRegionIndex] = useState(0);
  const currentRegion = REGIONS[currentRegionIndex];

  // Estado do Jogador no Mapa
  const [playerPos, setPlayerPos] = useState({ x: 400, y: 300 });
  const [partnerPos, setPartnerPos] = useState({ x: 370, y: 300 });
  const [scanProgress, setScanProgress] = useState(65);
  const [activeQuest, setActiveQuest] = useState('Restaurar o Terminal de Dados da DigiVillage');
  const [questCompleted, setQuestCompleted] = useState(false);
  const [dialogue, setDialogue] = useState('Bem-vindo ao Mundo Digital, Tamer! Use as teclas W, A, S, D ou setas para explorar o mapa.');

  // Parceiro e Imagem
  const agumon = catalog.find(d => d.name.toLowerCase() === 'agumon') || catalog[0];

  // Game Loop no Canvas 2D
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Renderizar Fundo da Região com Grade Hexagonal / Grid Digital
      ctx.fillStyle = '#081426';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Linhas de Grade de Terreno
      ctx.strokeStyle = `${currentRegion.color}15`;
      ctx.lineWidth = 1;
      const gridSize = 40;
      for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // 2. Elementos de Cenário / Obstáculos / Terminal Interativo
      ctx.fillStyle = `${currentRegion.color}44`;
      ctx.fillRect(200, 150, 80, 80);
      ctx.strokeStyle = currentRegion.color;
      ctx.strokeRect(200, 150, 80, 80);

      // Terminal de Missão
      const terminalX = 600;
      const terminalY = 220;
      ctx.fillStyle = questCompleted ? 'rgba(66, 230, 149, 0.4)' : 'rgba(0, 217, 255, 0.4)';
      ctx.beginPath();
      ctx.arc(terminalX, terminalY, 25 + Math.sin(tick * 0.05) * 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#00d9ff';
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = '12px "JetBrains Mono"';
      ctx.fillText('TERMINAL DE DADOS', terminalX - 55, terminalY - 35);

      // 3. Renderizar Parceiro Digimon (Seguindo o Jogador)
      ctx.fillStyle = 'rgba(255, 138, 36, 0.3)';
      ctx.beginPath();
      ctx.arc(partnerPos.x, partnerPos.y + 12, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ff8a24';
      ctx.beginPath();
      ctx.arc(partnerPos.x, partnerPos.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      ctx.fillStyle = 'var(--color-cyan)';
      ctx.font = '10px "Rajdhani"';
      ctx.fillText(agumon.name, partnerPos.x - 16, partnerPos.y - 14);

      // 4. Renderizar Protagonista Tamer
      ctx.fillStyle = 'rgba(0, 217, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(playerPos.x, playerPos.y + 14, 16, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#00d9ff';
      ctx.beginPath();
      ctx.arc(playerPos.x, playerPos.y, 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.stroke();

      ctx.fillStyle = '#fff';
      ctx.font = '11px "Rajdhani"';
      ctx.fillText('Tamer Lucas', playerPos.x - 26, playerPos.y - 18);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [playerPos, partnerPos, currentRegion, questCompleted]);

  // Controles de Teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 20;
      let newX = playerPos.x;
      let newY = playerPos.y;

      if (e.key === 'ArrowUp' || e.key.toLowerCase() === 'w') newY -= step;
      else if (e.key === 'ArrowDown' || e.key.toLowerCase() === 's') newY += step;
      else if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') newX -= step;
      else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') newX += step;
      else return;

      // Limites de Tela
      newX = Math.max(30, Math.min(770, newX));
      newY = Math.max(30, Math.min(470, newY));

      // Parceiro segue com atraso suave
      setPartnerPos({
        x: playerPos.x + (newX < playerPos.x ? 25 : -25),
        y: playerPos.y
      });
      setPlayerPos({ x: newX, y: newY });
      soundFx.playClick();

      // Checar Interação com o Terminal de Missão (X: 600, Y: 220)
      const dist = Math.hypot(newX - 600, newY - 220);
      if (dist < 45 && !questCompleted) {
        soundFx.playScan();
        setQuestCompleted(true);
        setScanProgress(100);
        setDialogue('TERMINAL SINCRONIZADO! Dados da região recuperados com sucesso. +500 Bits concedidos!');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerPos, questCompleted]);

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.25rem'
    }}>
      {/* Top Bar: Regiões e Mini-radar */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-surface-border)',
        padding: '1rem 1.25rem',
        clipPath: 'var(--clip-chamfer)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Compass size={22} color="var(--color-cyan)" />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>
              MUNDO DIGITAL 2D • {currentRegion.name}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)' }}>
              {currentRegion.desc}
            </div>
          </div>
        </div>

        {/* Seletor de Região */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {REGIONS.map((r, i) => (
            <button
              key={r.id}
              onClick={() => {
                soundFx.playClick();
                setCurrentRegionIndex(i);
                setDialogue(`Teleportado com sucesso para ${r.name}!`);
              }}
              style={{
                background: currentRegionIndex === i ? r.color : 'var(--color-bg)',
                color: currentRegionIndex === i ? '#fff' : 'var(--color-text-muted)',
                border: `1px solid ${r.color}`,
                padding: '0.35rem 0.65rem',
                clipPath: 'var(--clip-chamfer)',
                fontSize: '0.78rem',
                fontWeight: 700
              }}
            >
              {r.name}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas Principal do RPG */}
      <div style={{
        position: 'relative',
        background: '#081426',
        border: '1px solid var(--color-surface-border)',
        clipPath: 'var(--clip-chamfer-lg)',
        overflow: 'hidden',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.6)',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          style={{ width: '100%', maxWidth: '800px', height: '500px', display: 'block' }}
        />

        {/* HUD de Escaneamento de Dados (Scan %) sobreposto no Canvas */}
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'rgba(8, 20, 38, 0.85)',
          border: '1px solid var(--color-cyan)',
          clipPath: 'var(--clip-chamfer)',
          padding: '0.75rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.3rem',
          minWidth: '200px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 800 }}>
            <span style={{ color: 'var(--color-cyan)' }}>TAXA DE ESCANEAMENTO</span>
            <span style={{ color: 'var(--color-green)' }}>{scanProgress}%</span>
          </div>
          <div style={{ height: '5px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${scanProgress}%`,
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-green))'
            }} />
          </div>
          <span style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)' }}>
            {scanProgress >= 100 ? '✓ Pronto para materialização de dados' : 'Escaneando Digimon na região'}
          </span>
        </div>
      </div>

      {/* Painel Inferior: Diálogo / Missões / Teclado Touch Mobile */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: '1.25rem'
      }}>
        {/* Caixa de Diálogo & Eventos */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-border)',
          clipPath: 'var(--clip-chamfer)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-cyan)',
            letterSpacing: '1px'
          }}>
            TRANSMISSÃO DO DIGIVICE
          </div>
          <div style={{
            background: 'var(--color-bg)',
            padding: '1rem',
            clipPath: 'var(--clip-chamfer)',
            fontSize: '0.92rem',
            lineHeight: 1.6,
            color: 'var(--color-text-main)'
          }}>
            {dialogue}
          </div>
        </div>

        {/* Missão Ativa */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-border)',
          clipPath: 'var(--clip-chamfer)',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.6rem'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-orange)',
            letterSpacing: '1px'
          }}>
            MISSÃO ATIVA
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            fontSize: '0.88rem',
            fontWeight: 700,
            color: questCompleted ? 'var(--color-green)' : '#fff'
          }}>
            <CheckCircle2 size={18} color={questCompleted ? 'var(--color-green)' : 'var(--color-text-muted)'} />
            {activeQuest}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
            Recompensa: 500 Bits e +20% no vínculo com o parceiro.
          </div>
        </div>
      </div>
    </div>
  );
};
