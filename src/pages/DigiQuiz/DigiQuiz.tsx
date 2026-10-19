import React, { useState } from 'react';
import rawDigimonList from '../../data/digimon_catalog.json';
import { DigimonDefinition } from '../../types/digimon';
import { soundFx } from '../../services/soundFx';
import confetti from 'canvas-confetti';
import { HelpCircle, Check, X, Award, RotateCcw } from 'lucide-react';

const catalog = rawDigimonList as DigimonDefinition[];

export const DigiQuiz: React.FC = () => {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [feedback, setFeedback] = useState<'CORRECT' | 'WRONG' | null>(null);

  // Gera uma nova rodada de pergunta baseada no catálogo
  const generateQuestion = () => {
    const randomIndex = Math.floor(Math.random() * (Math.min(catalog.length, 300)));
    const target = catalog[randomIndex];

    // Gerar 3 opções incorretas distintas
    const options = [target.name];
    while (options.length < 4) {
      const distIndex = Math.floor(Math.random() * (Math.min(catalog.length, 300)));
      const optName = catalog[distIndex].name;
      if (!options.includes(optName)) {
        options.push(optName);
      }
    }
    // Embaralhar opções
    options.sort(() => Math.random() - 0.5);

    return { target, options };
  };

  const [currentRound, setCurrentRound] = useState(generateQuestion);

  const handleAnswer = (chosenName: string) => {
    if (isRevealed) return;
    setIsRevealed(true);

    if (chosenName === currentRound.target.name) {
      soundFx.playVictory();
      setFeedback('CORRECT');
      const newScore = score + 100 + streak * 20;
      const newStreak = streak + 1;
      setScore(newScore);
      setStreak(newStreak);
      if (newScore > highScore) setHighScore(newScore);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } else {
      soundFx.playHit();
      setFeedback('WRONG');
      setStreak(0);
    }
  };

  const handleNextQuestion = () => {
    soundFx.playClick();
    setIsRevealed(false);
    setFeedback(null);
    setCurrentRound(generateQuestion());
  };

  return (
    <div style={{
      maxWidth: '900px',
      margin: '0 auto',
      padding: '1.5rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {/* Header DigiQuiz */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-surface-border)',
        padding: '1.25rem',
        clipPath: 'var(--clip-chamfer)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <HelpCircle size={22} color="var(--color-cyan)" />
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.2rem' }}>DIGIQUIZ — QUEM É ESSE DIGIMON?</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
              Identifique o parceiro digital pela silhueta de dados antes da revelação.
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'var(--font-mono)' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>PONTUAÇÃO: </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-cyan)' }}>{score}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>SEQUÊNCIA: </span>
            <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-orange)' }}>{streak}x</span>
          </div>
        </div>
      </div>

      {/* Caixa do Desafio / Silhueta */}
      <div style={{
        background: 'var(--color-surface)',
        border: '1px solid var(--color-surface-border)',
        clipPath: 'var(--clip-chamfer-lg)',
        padding: '2.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '340px',
        position: 'relative'
      }}>
        <div style={{
          position: 'relative',
          width: '240px',
          height: '240px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <img
            src={currentRound.target.image}
            alt="Silhueta do Digimon"
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'contain',
              filter: isRevealed
                ? 'drop-shadow(0 0 20px rgba(0, 217, 255, 0.7))'
                : 'brightness(0) contrast(200%) drop-shadow(0 0 8px rgba(0, 217, 255, 0.4))',
              transition: 'all 0.4s ease'
            }}
          />
        </div>

        {/* Revelação do Nome e Atributos */}
        {isRevealed && (
          <div style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            animation: 'floatAnim 2s ease-in-out infinite'
          }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, color: feedback === 'CORRECT' ? 'var(--color-green)' : 'var(--color-red)' }}>
              {feedback === 'CORRECT' ? 'ACERTOU!' : 'INCORRETO!'} É {currentRound.target.name}
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--color-cyan)', marginTop: '0.2rem' }}>
              Nível: {currentRound.target.level} • Atributo: {currentRound.target.attribute}
            </div>
          </div>
        )}
      </div>

      {/* Opções de Resposta */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        {currentRound.options.map((optName, index) => {
          const isTarget = optName === currentRound.target.name;
          let btnBg = 'var(--color-surface)';
          let btnBorder = 'var(--color-surface-border)';

          if (isRevealed) {
            if (isTarget) {
              btnBg = 'rgba(66, 230, 149, 0.25)';
              btnBorder = 'var(--color-green)';
            }
          }

          return (
            <button
              key={index}
              onClick={() => handleAnswer(optName)}
              disabled={isRevealed}
              style={{
                background: btnBg,
                border: `1px solid ${btnBorder}`,
                color: '#fff',
                padding: '1rem',
                clipPath: 'var(--clip-chamfer)',
                fontWeight: 800,
                fontSize: '1.05rem',
                textAlign: 'center',
                transition: 'all 0.2s ease',
                cursor: isRevealed ? 'default' : 'pointer'
              }}
            >
              {optName}
            </button>
          );
        })}
      </div>

      {/* Botão de Próxima Pergunta */}
      {isRevealed && (
        <button
          onClick={handleNextQuestion}
          style={{
            background: 'linear-gradient(90deg, var(--color-primary), var(--color-cyan))',
            color: '#081426',
            fontWeight: 800,
            fontSize: '1rem',
            letterSpacing: '1px',
            padding: '0.9rem',
            clipPath: 'var(--clip-chamfer)',
            boxShadow: '0 0 15px rgba(0, 217, 255, 0.4)'
          }}
        >
          PRÓXIMO DESAFIO DIGITAL &gt;&gt;
        </button>
      )}
    </div>
  );
};
