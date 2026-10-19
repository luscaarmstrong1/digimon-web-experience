import React, { useState, useRef } from 'react';
import rawTcgCards from '../../data/tcg_cards.json';
import { DigimonCard } from '../../types/digimon';
import { soundFx } from '../../services/soundFx';
import { Layers, Search, Sparkles, Filter, Download, Maximize2, X, ExternalLink, ShieldCheck } from 'lucide-react';

const tcgList = rawTcgCards as DigimonCard[];

export const DigiCards: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedColor, setSelectedColor] = useState('ALL');
  const [selectedCard, setSelectedCard] = useState<DigimonCard | null>(tcgList[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const filteredCards = tcgList.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.cardnumber.toLowerCase().includes(search.toLowerCase());
    const matchColor = selectedColor === 'ALL' || c.color === selectedColor;
    return matchSearch && matchColor;
  });

  // Geração e Download da Carta em Alta Resolução (Canvas 2D renderizado a 1200x1680px)
  const downloadHighResCard = async (card: DigimonCard) => {
    soundFx.playScan();
    setIsGenerating(true);

    try {
      const width = 1200;
      const height = 1680;
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // 1. Fundo Gradiente de Luxo correspondente à cor
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      if (card.color === 'Red') {
        gradient.addColorStop(0, '#c0392b');
        gradient.addColorStop(1, '#5c140c');
      } else if (card.color === 'Blue') {
        gradient.addColorStop(0, '#1f618d');
        gradient.addColorStop(1, '#0e2b3d');
      } else if (card.color === 'Yellow') {
        gradient.addColorStop(0, '#d4ac0d');
        gradient.addColorStop(1, '#664d00');
      } else if (card.color === 'Green') {
        gradient.addColorStop(0, '#229954');
        gradient.addColorStop(1, '#0e4523');
      } else if (card.color === 'Purple') {
        gradient.addColorStop(0, '#884ea0');
        gradient.addColorStop(1, '#3e174e');
      } else {
        gradient.addColorStop(0, '#2c3e50');
        gradient.addColorStop(1, '#0e171f');
      }

      // Moldura externa com cantos arredondados
      const radius = 64;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.lineTo(width - radius, 0);
      ctx.quadraticCurveTo(width, 0, width, radius);
      ctx.lineTo(width, height - radius);
      ctx.quadraticCurveTo(width, height, width - radius, height);
      ctx.lineTo(radius, height);
      ctx.quadraticCurveTo(0, height, 0, height - radius);
      ctx.lineTo(0, radius);
      ctx.quadraticCurveTo(0, 0, radius, 0);
      ctx.closePath();

      ctx.fillStyle = gradient;
      ctx.fill();

      // Borda Dourada Metálica
      ctx.lineWidth = 24;
      ctx.strokeStyle = '#ffd15c';
      ctx.stroke();

      // Borda Interna Fina de Holograma
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.strokeRect(36, 36, width - 72, height - 72);

      // 2. Play Cost Circulo Superior Esquerdo
      ctx.beginPath();
      ctx.arc(140, 140, 70, 0, Math.PI * 2);
      ctx.fillStyle = '#081426';
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#00d9ff';
      ctx.stroke();

      ctx.fillStyle = '#00d9ff';
      ctx.font = 'bold 76px "Rajdhani", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(card.play_cost || '3'), 140, 144);

      // 3. Nome do Digimon / Carta
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 74px "Rajdhani", sans-serif';
      ctx.textAlign = 'left';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
      ctx.shadowBlur = 12;
      ctx.fillText(card.name, 250, 150);
      ctx.shadowBlur = 0;

      // 4. Arte Central (Moldura)
      const frameX = 80;
      const frameY = 240;
      const frameW = width - 160;
      const frameH = 820;

      ctx.fillStyle = '#060e1c';
      ctx.fillRect(frameX, frameY, frameW, frameH);
      ctx.lineWidth = 6;
      ctx.strokeStyle = 'rgba(255, 209, 92, 0.6)';
      ctx.strokeRect(frameX, frameY, frameW, frameH);

      // Carregar imagem
      if (card.image_url) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise((resolve) => {
          img.onload = () => {
            const aspect = img.width / img.height;
            let drawW = frameW * 0.8;
            let drawH = drawW / aspect;
            if (drawH > frameH * 0.9) {
              drawH = frameH * 0.9;
              drawW = drawH * aspect;
            }
            const posX = frameX + (frameW - drawW) / 2;
            const posY = frameY + (frameH - drawH) / 2;
            ctx.drawImage(img, posX, posY, drawW, drawH);
            resolve(true);
          };
          img.onerror = () => resolve(true);
          img.src = card.image_url!;
        });
      }

      // 5. Caixa de Efeito de Batalha (Main Effect)
      const effectY = 1100;
      const effectH = 340;
      ctx.fillStyle = 'rgba(8, 20, 38, 0.92)';
      ctx.fillRect(80, effectY, width - 160, effectH);
      ctx.lineWidth = 4;
      ctx.strokeStyle = 'rgba(0, 217, 255, 0.4)';
      ctx.strokeRect(80, effectY, width - 160, effectH);

      // Texto do Efeito
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 36px "Rajdhani", sans-serif';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      // Quebra de linha simples
      const words = (card.maineffect || '').split(' ');
      let line = '';
      let curY = effectY + 36;
      for (const w of words) {
        const testLine = line + w + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > (width - 240) && line !== '') {
          ctx.fillText(line, 110, curY);
          line = w + ' ';
          curY += 50;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, 110, curY);

      // Efeito Herdado
      if (card.soureeffect) {
        ctx.fillStyle = '#ffd15c';
        ctx.font = 'bold 32px "Rajdhani", sans-serif';
        ctx.fillText(card.soureeffect, 110, effectY + 240);
      }

      // 6. Rodapé: Cardnumber, DP, Estágio e Assinatura
      ctx.fillStyle = '#ffd15c';
      ctx.font = 'bold 44px "Rajdhani", sans-serif';
      ctx.fillText(card.cardnumber, 100, 1530);

      const dpText = card.dp !== '-' ? `${card.dp} DP` : `${card.type} • ${card.stage || ''}`;
      ctx.textAlign = 'right';
      ctx.fillText(dpText, width - 100, 1530);

      ctx.fillStyle = '#8ea5c8';
      ctx.font = '30px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(`DIGIVERSE TCG • Developed by luscaarmstrong`, width / 2, 1600);

      // Download da imagem PNG de alta resolução
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const downloadLink = document.createElement('a');
      downloadLink.download = `${card.cardnumber}_${card.name.replace(/\s+/g, '_')}_HQ.png`;
      downloadLink.href = dataUrl;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      downloadLink.remove();
      soundFx.playVictory();
    } catch (err) {
      console.error('Erro ao gerar carta em alta resolução:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* Modal de Acesso em Tela Cheia / Zoom */}
      {isModalOpen && selectedCard && (
        <div style={{
          position: 'fixed',
          inset: 0,
          zIndex: 1000,
          background: 'rgba(4, 10, 20, 0.92)',
          backdropFilter: 'blur(16px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          {/* Botão de Fechar */}
          <button
            onClick={() => {
              soundFx.playClick();
              setIsModalOpen(false);
            }}
            style={{
              position: 'absolute',
              top: '2rem',
              right: '2rem',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-cyan)',
              color: '#fff',
              padding: '0.75rem',
              clipPath: 'var(--clip-chamfer)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <X size={24} />
          </button>

          {/* Card em Alta Escala */}
          <div style={{
            width: '360px',
            maxWidth: '90vw',
            background: selectedCard.color === 'Red' ? 'linear-gradient(135deg, #c0392b, #781d13)' :
                        selectedCard.color === 'Blue' ? 'linear-gradient(135deg, #2980b9, #154360)' :
                        selectedCard.color === 'Yellow' ? 'linear-gradient(135deg, #f39c12, #9a6309)' :
                        selectedCard.color === 'Green' ? 'linear-gradient(135deg, #27ae60, #145a32)' :
                        'linear-gradient(135deg, #8e44ad, #512e5f)',
            borderRadius: '16px',
            border: '4px solid #ffd15c',
            boxShadow: '0 25px 60px rgba(0,0,0,0.9), 0 0 40px rgba(0, 217, 255, 0.4)',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{
                background: '#081426',
                color: '#00d9ff',
                width: '38px',
                height: '38px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '1.1rem',
                border: '2px solid #00d9ff'
              }}>
                {selectedCard.play_cost}
              </div>
              <div style={{ fontWeight: 900, fontSize: '1.4rem', color: '#fff' }}>
                {selectedCard.name}
              </div>
            </div>

            <div style={{
              background: 'rgba(8, 20, 38, 0.75)',
              borderRadius: '10px',
              height: '220px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <img
                src={selectedCard.image_url}
                alt={selectedCard.name}
                style={{ width: '180px', height: '180px', objectFit: 'contain' }}
              />
            </div>

            <div style={{
              fontSize: '0.88rem',
              color: '#fff',
              background: 'rgba(8, 20, 38, 0.85)',
              padding: '0.75rem',
              borderRadius: '6px',
              lineHeight: 1.4
            }}>
              {selectedCard.maineffect}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffd15c', fontWeight: 900, fontSize: '1rem' }}>
              <span>{selectedCard.cardnumber}</span>
              <span>{selectedCard.dp !== '-' ? `${selectedCard.dp} DP` : selectedCard.type}</span>
            </div>
          </div>

          {/* Botão de Download dentro do Modal */}
          <button
            onClick={() => downloadHighResCard(selectedCard)}
            disabled={isGenerating}
            style={{
              marginTop: '1.5rem',
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-cyan))',
              color: '#081426',
              fontWeight: 900,
              fontSize: '1.1rem',
              letterSpacing: '1px',
              padding: '0.9rem 2rem',
              clipPath: 'var(--clip-chamfer-lg)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.6rem',
              boxShadow: '0 0 25px rgba(0, 217, 255, 0.6)'
            }}
          >
            <Download size={20} />
            <span>{isGenerating ? 'RENDERIZANDO ALTA RESOLUÇÃO...' : 'BAIXAR CARTA EM ALTA QUALIDADE (PNG 1200x1680)'}</span>
          </button>
        </div>
      )}

      {/* Header DigiCards */}
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <Layers size={22} color="var(--color-cyan)" />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>
              DIGICARDS — COLEÇÃO OFICIAL DE CARTAS TCG
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Acesse qualquer carta em detalhes e faça o download em alta qualidade (HQ 1200x1680px).
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'var(--color-bg)',
            border: '1px solid var(--color-surface-border)',
            padding: '0.45rem 0.75rem',
            clipPath: 'var(--clip-chamfer)'
          }}>
            <Search size={16} color="var(--color-cyan)" />
            <input
              type="text"
              placeholder="Buscar por carta ou número..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#fff',
                fontSize: '0.85rem'
              }}
            />
          </div>

          <select
            value={selectedColor}
            onChange={(e) => {
              soundFx.playClick();
              setSelectedColor(e.target.value);
            }}
            style={{
              background: 'var(--color-bg)',
              border: '1px solid var(--color-surface-border)',
              color: '#fff',
              padding: '0.45rem 0.75rem',
              clipPath: 'var(--clip-chamfer)',
              fontSize: '0.85rem'
            }}
          >
            <option value="ALL">Todas as Cores</option>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
            <option value="Yellow">Yellow</option>
            <option value="Green">Green</option>
            <option value="Purple">Purple</option>
          </select>
        </div>
      </div>

      {/* Grid de Cartas & Destaque Holográfico */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(320px, 420px) 1fr',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Painel de Visualização Holográfica 3D da Carta Selecionada */}
        {selectedCard && (
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-cyan)',
            clipPath: 'var(--clip-chamfer-lg)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem',
            position: 'sticky',
            top: '80px',
            boxShadow: '0 0 30px rgba(0, 217, 255, 0.15)'
          }}>
            {/* Visual da Carta Estilizada TCG */}
            <div
              ref={cardRef}
              onClick={() => {
                soundFx.playClick();
                setIsModalOpen(true);
              }}
              title="Clique para abrir e inspecionar a carta"
              style={{
                width: '260px',
                height: '380px',
                background: selectedCard.color === 'Red' ? 'linear-gradient(135deg, #c0392b, #781d13)' :
                            selectedCard.color === 'Blue' ? 'linear-gradient(135deg, #2980b9, #154360)' :
                            selectedCard.color === 'Yellow' ? 'linear-gradient(135deg, #f39c12, #9a6309)' :
                            selectedCard.color === 'Green' ? 'linear-gradient(135deg, #27ae60, #145a32)' :
                            'linear-gradient(135deg, #8e44ad, #512e5f)',
                borderRadius: '12px',
                border: '3px solid #ffd15c',
                boxShadow: '0 15px 35px rgba(0,0,0,0.7), inset 0 0 15px rgba(255,255,255,0.2)',
                padding: '1rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
              }}
            >
              {/* Topo da Carta: Play Cost & Nome */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{
                  background: '#081426',
                  color: '#00d9ff',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  fontSize: '0.9rem',
                  border: '1px solid #00d9ff'
                }}>
                  {selectedCard.play_cost}
                </div>
                <div style={{ fontWeight: 900, fontSize: '1.1rem', color: '#fff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                  {selectedCard.name}
                </div>
              </div>

              {/* Arte Central */}
              <div style={{
                background: 'rgba(8, 20, 38, 0.7)',
                borderRadius: '8px',
                height: '160px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <img
                  src={selectedCard.image_url}
                  alt={selectedCard.name}
                  style={{ width: '130px', height: '130px', objectFit: 'contain' }}
                />
              </div>

              {/* Rodapé: DP e Efeito */}
              <div>
                <div style={{
                  fontSize: '0.72rem',
                  color: '#fff',
                  background: 'rgba(8, 20, 38, 0.85)',
                  padding: '0.4rem',
                  borderRadius: '4px',
                  marginBottom: '0.4rem',
                  lineHeight: 1.3
                }}>
                  {selectedCard.maineffect}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#ffd15c', fontWeight: 900, fontSize: '0.85rem' }}>
                  <span>{selectedCard.cardnumber}</span>
                  <span>{selectedCard.dp !== '-' ? `${selectedCard.dp} DP` : selectedCard.type}</span>
                </div>
              </div>
            </div>

            {/* Ações: Acessar / Inspecionar & Download HQ */}
            <div style={{ display: 'flex', gap: '0.6rem', width: '100%' }}>
              <button
                onClick={() => {
                  soundFx.playClick();
                  setIsModalOpen(true);
                }}
                style={{
                  flex: 1,
                  background: 'var(--color-bg)',
                  border: '1px solid var(--color-cyan)',
                  color: 'var(--color-cyan)',
                  padding: '0.65rem',
                  clipPath: 'var(--clip-chamfer)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem'
                }}
              >
                <Maximize2 size={16} /> Inspecionar Carta
              </button>

              <button
                onClick={() => downloadHighResCard(selectedCard)}
                disabled={isGenerating}
                style={{
                  flex: 1.2,
                  background: 'linear-gradient(90deg, var(--color-primary), var(--color-cyan))',
                  color: '#081426',
                  padding: '0.65rem',
                  clipPath: 'var(--clip-chamfer)',
                  fontWeight: 900,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 0 15px rgba(0, 217, 255, 0.4)'
                }}
              >
                <Download size={16} />
                <span>{isGenerating ? 'Gerando...' : 'Baixar HQ (PNG)'}</span>
              </button>
            </div>

            <div style={{ width: '100%', fontSize: '0.82rem', color: 'var(--color-text-muted)' }}>
              <div>Raridade: <strong style={{ color: '#fff' }}>{selectedCard.cardrarity}</strong></div>
              <div>Artista: <strong style={{ color: '#fff' }}>{selectedCard.artist}</strong></div>
            </div>
          </div>
        )}

        {/* Galeria de Miniaturas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '1rem'
        }}>
          {filteredCards.map(c => (
            <div
              key={c.cardnumber}
              onClick={() => {
                soundFx.playScan();
                setSelectedCard(c);
              }}
              style={{
                background: 'var(--color-surface)',
                border: selectedCard?.cardnumber === c.cardnumber ? '2px solid var(--color-cyan)' : '1px solid var(--color-surface-border)',
                clipPath: 'var(--clip-chamfer)',
                padding: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{
                background: 'var(--color-bg)',
                height: '120px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '6px'
              }}>
                <img src={c.image_url} alt={c.name} style={{ width: '90px', height: '90px', objectFit: 'contain' }} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {c.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                  <span>{c.cardnumber}</span>
                  <span style={{ color: 'var(--color-cyan)' }}>{c.color}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
