import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchTcgCards() {
  console.log('--- Buscando metadados de cartas TCG para DIGIVERSE ---');
  // Buscar amostra diversificada de cartas conhecidas do Digimon Card Game
  const searchTerms = ['Agumon', 'Gabumon', 'Greymon', 'Garurumon', 'WarGreymon', 'MetalGarurumon', 'Omnimon', 'Angemon', 'Patamon', 'Tailmon', 'Beelzemon', 'Gallantmon', 'Dukemon', 'Veemon', 'Imperialdramon', 'Guilmon', 'Renamon'];
  
  const cardsMap = new Map();

  for (const term of searchTerms) {
    try {
      console.log(`Buscando cartas para '${term}'...`);
      const res = await fetch(`https://digimoncard.io/api-public/search.php?n=${term}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          data.slice(0, 8).forEach(c => {
            if (c.cardnumber && !cardsMap.has(c.cardnumber)) {
              cardsMap.set(c.cardnumber, {
                cardnumber: c.cardnumber,
                name: c.name,
                type: c.type || 'Digimon',
                color: c.color || 'Red',
                stage: c.stage || 'Rookie',
                attribute: c.attribute || 'Vaccine',
                cardrarity: c.cardrarity || 'Common',
                artist: c.artist || 'Bandai Art Team',
                dp: c.dp || '-',
                play_cost: c.play_cost || '3',
                digivolve_cost: c.digivolve_cost_1 || '0',
                maineffect: c.maineffect || 'Efeito de batalha do Digimon Card Game.',
                soureeffect: c.soureeffect || '',
                image_url: `https://images.digimoncard.io/images/cards/${c.cardnumber}.jpg`
              });
            }
          });
        }
      }
      await new Promise(r => setTimeout(r, 100));
    } catch {
      // ignore
    }
  }

  const cardsList = Array.from(cardsMap.values());
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'tcg_cards.json');
  fs.writeFileSync(outputPath, JSON.stringify(cardsList, null, 2), 'utf-8');
  console.log(`✓ Cartas TCG compiladas com sucesso: ${cardsList.length} cartas em ${outputPath}`);
}

fetchTcgCards();
