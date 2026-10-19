import React, { useState, useMemo } from 'react';
import rawDigimonList from '../../data/digimon_catalog.json';
import { DigimonDefinition, DigimonAttribute } from '../../types/digimon';
import { HexBadge } from '../../components/HexBadge';
import { DigiHoloPlate } from '../../components/DigiHoloPlate';
import { soundFx } from '../../services/soundFx';
import { Search, Filter, ArrowRight, Zap, Shield, Cpu, Activity, Award, Swords } from 'lucide-react';

const catalog = rawDigimonList as DigimonDefinition[];

export const DigiDex: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedAttr, setSelectedAttr] = useState<string>('ALL');
  const [selectedRank, setSelectedRank] = useState<string>('ALL');
  const [selectedDigimon, setSelectedDigimon] = useState<DigimonDefinition>(catalog[0] || {} as DigimonDefinition);
  const [compareTarget, setCompareTarget] = useState<DigimonDefinition | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  // Filtragem ultraveloz
  const filteredDigimon = useMemo(() => {
    return catalog.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || String(d.id).includes(search);
      const matchAttr = selectedAttr === 'ALL' || d.attribute === selectedAttr;
      const matchRank = selectedRank === 'ALL' || String(d.rank) === selectedRank;
      return matchSearch && matchAttr && matchRank;
    });
  }, [search, selectedAttr, selectedRank]);

  const handleSelect = (item: DigimonDefinition) => {
    soundFx.playScan();
    if (isComparing) {
      setCompareTarget(item);
    } else {
      setSelectedDigimon(item);
    }
  };

  return (
    <div style={{
      maxWidth: '1600px',
      margin: '0 auto',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* Top Bar: Search, Stats Counter & Filters */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        background: 'var(--color-surface)',
        border: '1px solid var(--color-surface-border)',
        padding: '1rem 1.25rem',
        clipPath: 'var(--clip-chamfer)'
      }}>
        {/* Search Input */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          background: 'var(--color-bg)',
          border: '1px solid var(--color-surface-border)',
          padding: '0.5rem 0.85rem',
          clipPath: 'var(--clip-chamfer)',
          flex: '1 1 280px'
        }}>
          <Search size={18} color="var(--color-cyan)" />
          <input
            type="text"
            placeholder="Buscar por nome ou ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '0.95rem',
              width: '100%'
            }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Atributo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Filter size={16} color="var(--color-text-muted)" />
            <select
              value={selectedAttr}
              onChange={(e) => {
                soundFx.playClick();
                setSelectedAttr(e.target.value);
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
              <option value="ALL">Todos os Atributos</option>
              <option value="Vaccine">Vaccine</option>
              <option value="Data">Data</option>
              <option value="Virus">Virus</option>
              <option value="Free">Free</option>
            </select>
          </div>

          {/* Nível / Rank */}
          <select
            value={selectedRank}
            onChange={(e) => {
              soundFx.playClick();
              setSelectedRank(e.target.value);
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
            <option value="ALL">Todos os Níveis</option>
            <option value="1">Baby I / Fresh</option>
            <option value="2">Baby II / In-Training</option>
            <option value="3">Child / Rookie</option>
            <option value="4">Adult / Champion</option>
            <option value="5">Perfect / Ultimate</option>
            <option value="6">Ultimate / Mega</option>
          </select>

          {/* Comparador Toggle */}
          <button
            onClick={() => {
              soundFx.playClick();
              setIsComparing(!isComparing);
              if (!compareTarget && filteredDigimon.length > 1) {
                setCompareTarget(filteredDigimon[1]);
              }
            }}
            style={{
              background: isComparing ? 'linear-gradient(90deg, var(--color-primary), var(--color-cyan))' : 'var(--color-bg)',
              color: isComparing ? '#081426' : 'var(--color-cyan)',
              border: '1px solid var(--color-cyan)',
              padding: '0.45rem 0.85rem',
              clipPath: 'var(--clip-chamfer)',
              fontWeight: 700,
              fontSize: '0.85rem'
            }}
          >
            {isComparing ? 'Encerrar Comparação' : 'Comparar Digimon'}
          </button>

          {/* Contador de espécimes */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--color-text-muted)'
          }}>
            <span style={{ color: 'var(--color-cyan)', fontWeight: 700 }}>{filteredDigimon.length}</span> / {catalog.length} ESPÉCIMES
          </div>
        </div>
      </div>

      {/* Main Grid: Detail Analysis & List */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isComparing ? '1fr 1fr 340px' : 'minmax(420px, 1fr) 380px',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Painel de Análise Holográfica Principal */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-border)',
          clipPath: 'var(--clip-chamfer-lg)',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Header do Digimon Selecionado */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-cyan)',
                fontSize: '0.85rem',
                letterSpacing: '2px',
                marginBottom: '0.2rem'
              }}>
                REGISTRO CANÔNICO DAPI #{String(selectedDigimon.id).padStart(4, '0')}
              </div>
              <h2 style={{
                fontSize: '2.2rem',
                fontWeight: 900,
                letterSpacing: '1px',
                color: '#fff'
              }}>
                {selectedDigimon.name}
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                <HexBadge label={selectedDigimon.attribute} type="attribute" attribute={selectedDigimon.attribute} />
                <HexBadge label={selectedDigimon.level} type="level" />
                <HexBadge label={selectedDigimon.type} />
                {selectedDigimon.isXAntibody && <HexBadge label="X-Antibody" color="var(--color-purple)" />}
              </div>
            </div>

            {/* Badges de Campos Digitais */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase' }}>
                Campo Digital
              </span>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {selectedDigimon.fields?.map(f => (
                  <span key={f} style={{
                    fontSize: '0.75rem',
                    background: 'rgba(20, 108, 255, 0.2)',
                    color: 'var(--color-cyan)',
                    padding: '0.2rem 0.5rem',
                    border: '1px solid rgba(0, 217, 255, 0.3)',
                    clipPath: 'var(--clip-chamfer)'
                  }}>
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Palco Holográfico */}
          <DigiHoloPlate digimon={selectedDigimon} size={300} />

          {/* Descrição Canônica Oficial */}
          <div style={{
            background: 'rgba(8, 20, 38, 0.7)',
            padding: '1.25rem',
            borderLeft: '3px solid var(--color-cyan)',
            clipPath: 'var(--clip-chamfer)',
            fontSize: '0.92rem',
            lineHeight: 1.6,
            color: 'var(--color-text-main)'
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--color-cyan)',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              marginBottom: '0.4rem'
            }}>
              Perfil Digimon Reference Book
            </div>
            {selectedDigimon.description}
          </div>

          {/* Radar / Barras de Estatísticas Simuladas DIGIVERSE */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem'
            }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-orange)', letterSpacing: '1px' }}>
                PARÂMETROS DE COMBATE (SIMULAÇÃO DIGIVERSE)
              </span>
              <span style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                Fórmula Base: Rank {selectedDigimon.rank}
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.75rem'
            }}>
              {[
                { label: 'HP', val: selectedDigimon.stats?.hp, max: 3000, icon: Activity, col: 'var(--color-green)' },
                { label: 'SP', val: selectedDigimon.stats?.sp, max: 700, icon: Zap, col: 'var(--color-cyan)' },
                { label: 'ATK', val: selectedDigimon.stats?.atk, max: 300, icon: Swords, col: 'var(--color-red)' },
                { label: 'DEF', val: selectedDigimon.stats?.def, max: 300, icon: Shield, col: 'var(--color-primary)' },
                { label: 'INT', val: selectedDigimon.stats?.int, max: 300, icon: Cpu, col: 'var(--color-purple)' },
                { label: 'SPD', val: selectedDigimon.stats?.spd, max: 300, icon: Award, col: 'var(--color-gold)' }
              ].map(st => {
                const Icon = st.icon;
                const pct = Math.min(100, Math.round(((st.val || 50) / st.max) * 100));
                return (
                  <div key={st.label} style={{
                    background: 'var(--color-bg)',
                    padding: '0.6rem 0.85rem',
                    border: '1px solid var(--color-surface-border)',
                    clipPath: 'var(--clip-chamfer)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', fontWeight: 800, color: st.col }}>
                        <Icon size={13} /> {st.label}
                      </span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700 }}>
                        {st.val}
                      </span>
                    </div>
                    <div style={{
                      height: '4px',
                      background: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        height: '100%',
                        width: `${pct}%`,
                        backgroundColor: st.col,
                        transition: 'width 0.4s ease'
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Golpes Especiais Canônicos */}
          <div>
            <div style={{
              fontSize: '0.85rem',
              fontWeight: 800,
              color: 'var(--color-cyan)',
              letterSpacing: '1px',
              marginBottom: '0.6rem',
              textTransform: 'uppercase'
            }}>
              Técnicas Especiais Catalogadas
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {selectedDigimon.skills?.slice(0, 4).map((sk, idx) => (
                <div key={idx} style={{
                  background: 'var(--color-bg)',
                  padding: '0.6rem 1rem',
                  border: '1px solid var(--color-surface-border)',
                  clipPath: 'var(--clip-chamfer)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontWeight: 800, color: 'var(--color-text-main)', fontSize: '0.9rem' }}>
                      {sk.name}
                    </span>
                    <p style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.1rem' }}>
                      {sk.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Segundo Card em Modo Comparador */}
        {isComparing && compareTarget && (
          <div style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-cyan)',
            clipPath: 'var(--clip-chamfer-lg)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            position: 'relative'
          }}>
            <div>
              <div style={{
                fontFamily: 'var(--font-mono)',
                color: 'var(--color-cyan)',
                fontSize: '0.85rem',
                letterSpacing: '2px',
                marginBottom: '0.2rem'
              }}>
                ALVO DE COMPARAÇÃO #{String(compareTarget.id).padStart(4, '0')}
              </div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#fff' }}>
                {compareTarget.name}
              </h2>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                <HexBadge label={compareTarget.attribute} type="attribute" attribute={compareTarget.attribute} />
                <HexBadge label={compareTarget.level} type="level" />
                <HexBadge label={compareTarget.type} />
              </div>
            </div>

            <DigiHoloPlate digimon={compareTarget} size={300} />

            <div style={{
              background: 'rgba(8, 20, 38, 0.7)',
              padding: '1.25rem',
              borderLeft: '3px solid var(--color-orange)',
              clipPath: 'var(--clip-chamfer)',
              fontSize: '0.92rem',
              lineHeight: 1.6
            }}>
              {compareTarget.description}
            </div>

            {/* Comparativo Direto de Atributos */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '0.75rem'
            }}>
              {[
                { label: 'HP', val: compareTarget.stats?.hp, baseVal: selectedDigimon.stats?.hp },
                { label: 'SP', val: compareTarget.stats?.sp, baseVal: selectedDigimon.stats?.sp },
                { label: 'ATK', val: compareTarget.stats?.atk, baseVal: selectedDigimon.stats?.atk },
                { label: 'DEF', val: compareTarget.stats?.def, baseVal: selectedDigimon.stats?.def },
                { label: 'INT', val: compareTarget.stats?.int, baseVal: selectedDigimon.stats?.int },
                { label: 'SPD', val: compareTarget.stats?.spd, baseVal: selectedDigimon.stats?.spd }
              ].map(st => {
                const diff = (st.val || 0) - (st.baseVal || 0);
                return (
                  <div key={st.label} style={{
                    background: 'var(--color-bg)',
                    padding: '0.6rem 0.85rem',
                    border: '1px solid var(--color-surface-border)',
                    clipPath: 'var(--clip-chamfer)'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-text-muted)' }}>
                      {st.label}
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800 }}>
                      {st.val}{' '}
                      <span style={{
                        fontSize: '0.75rem',
                        color: diff > 0 ? 'var(--color-green)' : diff < 0 ? 'var(--color-red)' : 'var(--color-text-muted)'
                      }}>
                        ({diff > 0 ? `+${diff}` : diff})
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Lista Lateral de Digimon com Scroll Virtual / Otimizado */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-border)',
          clipPath: 'var(--clip-chamfer)',
          padding: '1rem',
          maxHeight: '900px',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem'
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--color-cyan)',
            letterSpacing: '1px',
            marginBottom: '0.2rem',
            padding: '0 0.25rem'
          }}>
            LISTA DIGIVERSE • SELECIONE
          </div>

          {filteredDigimon.slice(0, 150).map(item => {
            const isSelected = selectedDigimon.id === item.id;
            const isTarget = compareTarget?.id === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleSelect(item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.6rem 0.75rem',
                  background: isSelected ? 'linear-gradient(90deg, rgba(20, 108, 255, 0.4), rgba(0, 217, 255, 0.2))' :
                              isTarget ? 'linear-gradient(90deg, rgba(255, 138, 36, 0.4), rgba(255, 77, 94, 0.2))' :
                              'var(--color-bg)',
                  border: isSelected ? '1px solid var(--color-cyan)' :
                          isTarget ? '1px solid var(--color-orange)' :
                          '1px solid var(--color-surface-border)',
                  clipPath: 'var(--clip-chamfer)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  loading="lazy"
                  style={{ width: '42px', height: '42px', objectFit: 'contain' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://digi-api.com/images/digimon/w/Agumon.png';
                  }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--color-text-muted)' }}>
                      #{String(item.id).padStart(4, '0')}
                    </span>
                    <span style={{
                      fontWeight: 800,
                      fontSize: '0.9rem',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {item.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.2rem' }}>
                    <span style={{
                      fontSize: '0.65rem',
                      color: item.attribute === 'Vaccine' ? 'var(--attr-vaccine)' :
                             item.attribute === 'Virus' ? 'var(--attr-virus)' :
                             item.attribute === 'Data' ? 'var(--attr-data)' : 'var(--attr-free)'
                    }}>
                      {item.attribute}
                    </span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>•</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--color-text-muted)' }}>
                      {item.level}
                    </span>
                  </div>
                </div>
                <ArrowRight size={14} color="var(--color-cyan)" />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
