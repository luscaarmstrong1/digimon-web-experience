import React, { useState } from 'react';
import rawTcgCards from '../../data/tcg_cards.json';
import { DigimonCard } from '../../types/digimon';
import { soundFx } from '../../services/soundFx';
import { Layers, Search, Sparkles, Filter } from 'lucide-react';

const tcgList = rawTcgCards as DigimonCard[];

export const DigiCards: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedColor, setSelectedColor] = useState('ALL');
  const [selectedCard, setSelectedCard] = useState<DigimonCard | null>(tcgList[0] || null);

  const filteredCards = tcgList.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.cardnumber.toLowerCase().includes(search.toLowerCase());
    const matchColor = selectedColor === 'ALL' || c.color === selectedColor;
    return matchSearch && matchColor;
  });

  return (
    <div style={{
      maxWidth: '1400px',
      margin: '0 auto',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
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
              Metadados completos de Digimon Card Game com efeito de projeção holográfica 3D.
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <input
            type="text"
            placeholder="Buscar por carta ou número..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'var(--color-bg)',
              border: '1px solid var(--color-surface-border)',
              color: '#fff',
              padding: '0.45rem 0.75rem',
              clipPath: 'var(--clip-chamfer)',
              fontSize: '0.85rem'
            }}
          />

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
            <div style={{
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
              position: 'relative'
            }}>
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
