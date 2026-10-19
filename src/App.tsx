import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePortal } from './pages/HomePortal/HomePortal';
import { DigiDex } from './pages/DigiDex/DigiDex';
import { DigiEvolution } from './pages/DigiEvolution/DigiEvolution';
import { DigiArena } from './pages/DigiArena/DigiArena';
import { DigitalWorld } from './pages/DigitalWorld/DigitalWorld';
import { DigiFarm } from './pages/DigiFarm/DigiFarm';
import { DigiQuiz } from './pages/DigiQuiz/DigiQuiz';
import { DigiCards } from './pages/DigiCards/DigiCards';
import { DigiCore } from './pages/DigiCore/DigiCore';
import { soundFx } from './services/soundFx';

export const App: React.FC = () => {
  const [muted, setMuted] = useState(false);

  const handleToggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    soundFx.setVolume(nextMuted ? 0 : 0.5);
  };

  return (
    <BrowserRouter>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header muted={muted} onToggleMute={handleToggleMute} />
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<HomePortal />} />
            <Route path="/digidex" element={<DigiDex />} />
            <Route path="/evolution" element={<DigiEvolution />} />
            <Route path="/arena" element={<DigiArena />} />
            <Route path="/world" element={<DigitalWorld />} />
            <Route path="/farm" element={<DigiFarm />} />
            <Route path="/quiz" element={<DigiQuiz />} />
            <Route path="/cards" element={<DigiCards />} />
            <Route path="/core" element={<DigiCore />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
};

export default App;
