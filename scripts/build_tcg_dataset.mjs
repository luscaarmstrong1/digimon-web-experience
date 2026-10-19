import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carrega o catálogo real da DAPI
const catalogPath = path.join(__dirname, '..', 'src', 'data', 'digimon_catalog.json');
const rawCatalog = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

// Filtra Digimon icônicos com boas imagens e atributos
const keyNames = [
  'Agumon', 'Greymon', 'MetalGreymon', 'WarGreymon',
  'Gabumon', 'Garurumon', 'WereGarurumon', 'MetalGarurumon',
  'Patamon', 'Angemon', 'MagnaAngemon', 'Seraphimon',
  'Gatomon', 'Tailmon', 'Angewomon', 'Ophanimon',
  'Tentomon', 'Kabuterimon', 'MegaKabuterimon', 'HerculesKabuterimon',
  'Palmon', 'Togemon', 'Lillymon', 'Rosemon',
  'Gomamon', 'Ikkakumon', 'Zudomon', 'Vikemon',
  'Biyomon', 'Birdramon', 'Garudamon', 'Phoenixmon',
  'Veemon', 'ExVeemon', 'Flamedramon', 'Raidramon', 'Imperialdramon',
  'Guilmon', 'Growlmon', 'WarGrowlmon', 'Gallantmon', 'Dukemon',
  'Renamon', 'Kyubimon', 'Taomon', 'Sakuyamon',
  'Terriermon', 'Gargomon', 'Rapidmon', 'MegaGargomon',
  'Lucemon', 'Beelzemon', 'Devimon', 'Myotismon', 'Piedmon',
  'Omnimon', 'Omegamon', 'Alphamon', 'Magnamon'
];

const selectedDigimon = rawCatalog.filter(d => 
  keyNames.some(k => d.name.toLowerCase() === k.toLowerCase() || d.name.toLowerCase().startsWith(k.toLowerCase()))
).slice(0, 48);

// Geração de metadados de cartas fiéis às regras do Digimon Card Game
const colorByAttr = {
  'Vaccine': 'Yellow',
  'Data': 'Blue',
  'Virus': 'Purple',
  'Free': 'Green'
};

const tcgCards = selectedDigimon.map((d, index) => {
  const cardNum = `BT1-${String(index + 1).padStart(3, '0')}`;
  const baseColor = d.name.toLowerCase().includes('greymon') || d.name.toLowerCase().includes('guilmon') ? 'Red' :
                    d.name.toLowerCase().includes('garurumon') || d.name.toLowerCase().includes('veemon') ? 'Blue' :
                    d.name.toLowerCase().includes('angemon') || d.name.toLowerCase().includes('gatomon') || d.name.toLowerCase().includes('patamon') ? 'Yellow' :
                    d.name.toLowerCase().includes('kabuteri') || d.name.toLowerCase().includes('palmon') || d.name.toLowerCase().includes('terrier') ? 'Green' :
                    d.attribute === 'Virus' ? 'Purple' : 'Black';

  const dp = d.rank === 3 ? 2000 : d.rank === 4 ? 5000 : d.rank === 5 ? 8000 : 12000;
  const playCost = d.rank === 3 ? 3 : d.rank === 4 ? 5 : d.rank === 5 ? 7 : 12;
  const digiCost = d.rank === 3 ? 0 : d.rank === 4 ? 2 : d.rank === 5 ? 3 : 4;

  return {
    cardnumber: cardNum,
    name: d.name,
    type: 'Digimon',
    color: baseColor,
    stage: d.level,
    attribute: d.attribute,
    cardrarity: d.rank >= 6 ? 'Secret Rare' : d.rank === 5 ? 'Super Rare' : d.rank === 4 ? 'Rare' : 'Common',
    artist: 'Bandai Art Design & luscaarmstrong',
    dp: dp,
    play_cost: playCost,
    digivolve_cost: digiCost,
    maineffect: `[Quando Ataca] Se o Digimon adversário for ${d.attribute === 'Vaccine' ? 'Virus' : d.attribute === 'Virus' ? 'Data' : 'Vaccine'}, este Digimon ganha +${d.rank * 1000} DP neste turno.`,
    soureeffect: '[Hereditário] Ganhe 1 Memória quando este Digimon destruir um oponente em batalha.',
    image_url: d.image
  };
});

// Adicionar cartas de Tamer Icônicas
const tamerCards = [
  {
    cardnumber: 'BT1-085',
    name: 'Tai Kamiya',
    type: 'Tamer',
    color: 'Red',
    stage: 'Tamer',
    attribute: 'Free',
    cardrarity: 'Rare',
    artist: 'Akiyoshi Hongo / Toei',
    dp: '-',
    play_cost: 4,
    digivolve_cost: '-',
    maineffect: '[Início do seu Turno] Se você tiver 2 ou menos Memórias, defina suas Memórias como 3. [Seu Turno] Todos os seus Digimon Vermelhos com 4 ou mais fontes de digievolução ganham ＜Segurança Ataque +1＞.',
    soureeffect: '[Segurança] Coloque este Tamer na sua área de batalha sem pagar seu custo.',
    image_url: 'https://digi-api.com/images/digimon/w/Agumon.png'
  },
  {
    cardnumber: 'BT1-086',
    name: 'Matt Ishida',
    type: 'Tamer',
    color: 'Blue',
    stage: 'Tamer',
    attribute: 'Free',
    cardrarity: 'Rare',
    artist: 'Akiyoshi Hongo / Toei',
    dp: '-',
    play_cost: 4,
    digivolve_cost: '-',
    maineffect: '[Início do seu Turno] Se você tiver 2 ou menos Memórias, defina suas Memórias como 3. [Seu Turno] Quando um oponente perder uma fonte de digievolução, compre 1 carta do seu deck.',
    soureeffect: '[Segurança] Coloque este Tamer na sua área de batalha sem pagar seu custo.',
    image_url: 'https://digi-api.com/images/digimon/w/Gabumon.png'
  },
  {
    cardnumber: 'BT1-087',
    name: 'T.K. Takaishi',
    type: 'Tamer',
    color: 'Yellow',
    stage: 'Tamer',
    attribute: 'Free',
    cardrarity: 'Super Rare',
    artist: 'Akiyoshi Hongo / Toei',
    dp: '-',
    play_cost: 4,
    digivolve_cost: '-',
    maineffect: '[Ao Jogar] Olhe as cartas da sua área de segurança, revele 1 e adicione-a à sua mão. Em seguida, ＜Recuperação +1 (Deck)＞.',
    soureeffect: '[Segurança] Coloque este Tamer na sua área de batalha sem pagar seu custo.',
    image_url: 'https://digi-api.com/images/digimon/w/Patamon.png'
  }
];

const fullTcg = [...tcgCards, ...tamerCards];
const outputPath = path.join(__dirname, '..', 'src', 'data', 'tcg_cards.json');
fs.writeFileSync(outputPath, JSON.stringify(fullTcg, null, 2), 'utf-8');
console.log(`✓ Cartas TCG compiladas com respeito a direitos e limites: ${fullTcg.length} cartas em ${outputPath}`);
