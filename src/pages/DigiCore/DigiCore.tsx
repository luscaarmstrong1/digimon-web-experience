import React, { useState } from 'react';
import { getStoredProfile, saveStoredProfile } from '../../storage/profileStorage';
import { TamerProfile } from '../../types/digimon';
import { soundFx } from '../../services/soundFx';
import { User, Trophy, Download, Upload, Shield, Award, Sparkles } from 'lucide-react';

export const DigiCore: React.FC = () => {
  const [profile, setProfile] = useState<TamerProfile>(getStoredProfile());

  const handleExportJson = () => {
    soundFx.playClick();
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `digiverse_profile_${profile.name.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* Header DigiCore */}
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
          <User size={22} color="var(--color-cyan)" />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>DIGICORE — CENTRAL DO TREINADOR</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Sincronização de perfil, conquistas e backup de dados IndexedDB.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            onClick={handleExportJson}
            style={{
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-cyan))',
              color: '#081426',
              padding: '0.55rem 1rem',
              clipPath: 'var(--clip-chamfer)',
              fontWeight: 800,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Download size={16} /> Exportar Backup JSON
          </button>
        </div>
      </div>

      {/* Grid: Informações do Tamer & Conquistas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(300px, 380px) 1fr',
        gap: '1.5rem'
      }}>
        {/* Cartão de Tamer */}
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
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-cyan))',
            clipPath: 'var(--clip-hex)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(0, 217, 255, 0.4)'
          }}>
            <User size={40} color="#081426" />
          </div>

          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 900 }}>{profile.name}</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-orange)', fontWeight: 700 }}>
              {profile.title}
            </div>
          </div>

          <div style={{
            width: '100%',
            background: 'var(--color-bg)',
            padding: '1rem',
            clipPath: 'var(--clip-chamfer)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            marginTop: '0.5rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Bits Digitais:</span>
              <strong style={{ color: 'var(--color-gold)' }}>{profile.bits} Ⓓ</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Digimon Registrados:</span>
              <strong style={{ color: 'var(--color-cyan)' }}>{profile.discoveredIds.length}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--color-text-muted)' }}>Parceiros Ativos:</span>
              <strong>{profile.partners.length}</strong>
            </div>
          </div>
        </div>

        {/* Lista de Conquistas Desbloqueadas */}
        <div style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-surface-border)',
          clipPath: 'var(--clip-chamfer)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <div style={{
            fontSize: '0.9rem',
            fontWeight: 800,
            color: 'var(--color-cyan)',
            fontFamily: 'var(--font-mono)',
            letterSpacing: '1px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Trophy size={18} color="var(--color-gold)" /> CONQUISTAS DIGITAIS DO TAMER
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {[
              { title: 'Digital Gate Opened', desc: 'Atravessou o portal para o Mundo Digital pela primeira vez.', unlocked: true },
              { title: 'First Partner Synchronized', desc: 'Sincronizou Agumon como parceiro primário no Digivice.', unlocked: true },
              { title: 'DigiDex Explorer', desc: 'Descobriu e analisou dados de mais de 50 espécies.', unlocked: false },
              { title: 'Arena Champion', desc: 'Alcançou uma sequência de 5 vitórias consecutivas na DigiArena.', unlocked: false },
              { title: 'DigiFarm Master', desc: 'Elevou todos os atributos de um parceiro em +50 pontos.', unlocked: false }
            ].map(ach => (
              <div
                key={ach.title}
                style={{
                  background: 'var(--color-bg)',
                  padding: '0.85rem 1rem',
                  border: ach.unlocked ? '1px solid var(--color-green)' : '1px solid var(--color-surface-border)',
                  clipPath: 'var(--clip-chamfer)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  opacity: ach.unlocked ? 1 : 0.5
                }}
              >
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: ach.unlocked ? '#fff' : 'var(--color-text-muted)' }}>
                    {ach.title}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--color-text-muted)', marginTop: '0.2rem' }}>
                    {ach.desc}
                  </div>
                </div>
                <Award size={20} color={ach.unlocked ? 'var(--color-gold)' : 'var(--color-text-muted)'} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
