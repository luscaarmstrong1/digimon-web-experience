import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  BookOpen, 
  GitBranch, 
  Swords, 
  Compass, 
  Home, 
  HelpCircle, 
  Layers, 
  User, 
  Volume2, 
  VolumeX 
} from 'lucide-react';
import { soundFx } from '../services/soundFx';

interface HeaderProps {
  muted: boolean;
  onToggleMute: () => void;
}

export const Header: React.FC<HeaderProps> = ({ muted, onToggleMute }) => {
  const navItems = [
    { to: '/digidex', label: 'DigiDex', icon: BookOpen },
    { to: '/evolution', label: 'DigiEvolution', icon: GitBranch },
    { to: '/arena', label: 'DigiArena', icon: Swords },
    { to: '/world', label: 'Digital World', icon: Compass },
    { to: '/farm', label: 'DigiFarm', icon: Home },
    { to: '/quiz', label: 'DigiQuiz', icon: HelpCircle },
    { to: '/cards', label: 'DigiCards', icon: Layers },
    { to: '/core', label: 'DigiCore', icon: User }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'rgba(8, 20, 38, 0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--color-surface-border)',
      padding: '0.6rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
    }}>
      {/* Brand & Digivice Indicator */}
      <NavLink 
        to="/" 
        onClick={() => soundFx.playClick()}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          textDecoration: 'none',
          color: 'inherit'
        }}
      >
        <div style={{
          width: '38px',
          height: '38px',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-cyan))',
          clipPath: 'var(--clip-hex)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 12px rgba(0, 217, 255, 0.5)'
        }}>
          <span style={{ fontWeight: 900, fontSize: '1rem', color: '#081426' }}>DV</span>
        </div>
        <div>
          <div style={{
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '2px',
            background: 'linear-gradient(90deg, #fff, var(--color-cyan))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            DIGIVERSE
          </div>
          <div style={{
            fontSize: '0.65rem',
            letterSpacing: '1px',
            color: 'var(--color-orange)',
            textTransform: 'uppercase',
            fontWeight: 700
          }}>
            by luscaarmstrong
          </div>
        </div>
      </NavLink>

      {/* Main Module Nav */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        overflowX: 'auto',
        padding: '0.2rem'
      }}>
        {navItems.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => soundFx.playClick()}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 0.85rem',
                fontSize: '0.88rem',
                fontWeight: 700,
                letterSpacing: '0.5px',
                textDecoration: 'none',
                color: isActive ? 'var(--color-text-main)' : 'var(--color-text-muted)',
                background: isActive ? 'linear-gradient(90deg, rgba(20, 108, 255, 0.3), rgba(0, 217, 255, 0.15))' : 'transparent',
                border: isActive ? '1px solid var(--color-cyan)' : '1px solid transparent',
                clipPath: 'var(--clip-chamfer)',
                transition: 'all 0.2s ease',
                boxShadow: isActive ? '0 0 12px rgba(0, 217, 255, 0.3)' : 'none'
              })}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sound & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          onClick={onToggleMute}
          title={muted ? 'Desmutar áudio' : 'Mutar áudio'}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-surface-border)',
            color: muted ? 'var(--color-red)' : 'var(--color-cyan)',
            padding: '0.5rem',
            clipPath: 'var(--clip-chamfer)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
        >
          {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>
    </header>
  );
};
