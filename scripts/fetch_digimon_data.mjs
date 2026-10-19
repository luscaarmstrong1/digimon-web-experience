import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchDigimonCatalog() {
  console.log('--- Ingressando dados da DAPI (digi-api.com) ---');
  const pageSize = 100;
  let page = 0;
  let totalPages = 1;
  const allDigimon = [];

  try {
    // 1. Fetch initial summary pages to get valid catalog (target 1,488 records)
    while (page < totalPages) {
      const url = `https://digi-api.com/api/v1/digimon?page=${page}&pageSize=${pageSize}`;
      console.log(`Buscando página ${page + 1}/${totalPages || '?'}...`);
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`Falha na página ${page}, status: ${res.status}`);
        break;
      }
      const data = await res.json();
      if (data.pageable) {
        totalPages = data.pageable.totalPages;
      }
      if (Array.isArray(data.content)) {
        allDigimon.push(...data.content);
      }
      page++;
      // Pequeno delay educado com a API pública
      await new Promise(r => setTimeout(r, 120));
    }
  } catch (err) {
    console.error('Erro na paginação de sumário da DAPI:', err);
  }

  console.log(`Total preliminar obtido da DAPI: ${allDigimon.length} espécimes.`);

  // 2. Coletar dados detalhados enriquecidos para os principais espécimes para ter árvores de evolução e golpes perfeitos
  // Amostra chave de destaque com rotas completas para o DigiEvolution Lab e Batalhas
  const keyDigimonIds = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
    11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
    30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
    50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60,
    70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80,
    90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100,
    120, 121, 122, 123, 124, 125,
    150, 151, 152, 153, 154, 155,
    200, 201, 202, 203, 204, 205,
    250, 251, 252, 253, 254, 255,
    300, 301, 302, 303, 304, 305,
    350, 351, 352, 353, 354, 355,
    400, 401, 402, 403, 404, 405,
    450, 451, 452, 453, 454, 455,
    490, 491, 492, 493, 494, 495,
    500, 501, 502, 503, 504, 505,
    600, 601, 602, 603, 604, 605,
    700, 701, 702, 703, 704, 705,
    800, 801, 802, 803, 804, 805
  ];

  const detailsMap = {};
  console.log(`Coletando detalhes ricos de ${keyDigimonIds.length} espécimes selecionados...`);
  
  for (const id of keyDigimonIds) {
    try {
      const res = await fetch(`https://digi-api.com/api/v1/digimon/${id}`);
      if (res.ok) {
        const detail = await res.json();
        detailsMap[detail.id] = detail;
        detailsMap[detail.name.toLowerCase()] = detail;
      }
      await new Promise(r => setTimeout(r, 60));
    } catch {
      // Ignora falhas pontuais
    }
  }

  // 3. Normalizar dataset unificado DIGIVERSE
  const levelRankMap = {
    'Baby I': 1,
    'Fresh': 1,
    'Baby II': 2,
    'In-Training': 2,
    'Child': 3,
    'Rookie': 3,
    'Adult': 4,
    'Champion': 4,
    'Armor': 4,
    'Perfect': 5,
    'Ultimate': 5,
    'Hybrid': 5,
    'Mega': 6,
    'Burst Mode': 7,
    'Super Ultimate': 7
  };

  const normalizedList = allDigimon.map((item, idx) => {
    const detail = detailsMap[item.id] || detailsMap[item.name.toLowerCase()];
    
    // Normalizar nível
    let rawLevel = 'Rookie';
    if (detail?.levels?.length) {
      rawLevel = detail.levels[0].level;
    }
    const cleanLevel = rawLevel.replace(/\s+/g, ' ');
    const rank = levelRankMap[cleanLevel] || 3;

    // Normalizar atributo
    let rawAttribute = 'Free';
    if (detail?.attributes?.length) {
      rawAttribute = detail.attributes[0].attribute;
    }
    // Tríade canônica: Vaccine, Data, Virus, Free, Variable, Unknown
    let cleanAttr = rawAttribute;
    if (['Vaccine', 'Data', 'Virus', 'Free'].includes(rawAttribute)) {
      cleanAttr = rawAttribute;
    } else if (rawAttribute.toLowerCase().includes('vaccine')) cleanAttr = 'Vaccine';
    else if (rawAttribute.toLowerCase().includes('virus')) cleanAttr = 'Virus';
    else if (rawAttribute.toLowerCase().includes('data')) cleanAttr = 'Data';
    else cleanAttr = 'Free';

    // Tipo de espécie
    const type = detail?.types?.[0]?.type || 'Digimon';
    
    // Campo digital (Dragon's Roar, Deep Savers, Metal Empire, etc.)
    const fields = detail?.fields?.map(f => f.field) || ['Nature Spirits'];

    // Descrição canônica em inglês
    const descObj = detail?.descriptions?.find(d => d.language === 'en_us') || detail?.descriptions?.[0];
    const description = descObj?.description || `${item.name} é um monstro digital habitante do Mundo Digital.`;

    // Habilidades / Técnicas especiais
    const skills = detail?.skills?.map(s => ({
      name: s.skill,
      description: s.description || 'Golpe com energia de dados concentrados.'
    })) || [
      { name: 'Digital Strike', description: 'Impacto físico com energia digital.' },
      { name: 'Data Blast', description: 'Disparo de partículas carregadas de bits.' }
    ];

    // Rotas de Digievolução documentadas
    const priorEvolutions = detail?.priorEvolutions?.map(p => ({
      id: p.id,
      name: p.digimon,
      image: p.image,
      condition: p.condition || ''
    })) || [];

    const nextEvolutions = detail?.nextEvolutions?.map(n => ({
      id: n.id,
      name: n.digimon,
      image: n.image,
      condition: n.condition || ''
    })) || [];

    // Fórmulas de estatísticas balanceadas de RPG DIGIVERSE
    // Baseadas estritamente no estágio evolutivo e no tipo, com variação determinística por ID
    const seed = (item.id * 17 + 23) % 100;
    const baseMult = rank === 1 ? 25 : rank === 2 ? 40 : rank === 3 ? 75 : rank === 4 ? 120 : rank === 5 ? 180 : 250;
    const hp = Math.floor(baseMult * 10 + seed * 3);
    const sp = Math.floor(baseMult * 2.5 + seed * 1.2);
    const atk = Math.floor(baseMult * 0.8 + (seed % 20));
    const def = Math.floor(baseMult * 0.75 + ((seed * 3) % 25));
    const int = Math.floor(baseMult * 0.85 + ((seed * 7) % 20));
    const spd = Math.floor(baseMult * 0.7 + ((seed * 5) % 30));

    return {
      id: item.id,
      name: item.name,
      image: item.image || `https://digi-api.com/images/digimon/w/${encodeURIComponent(item.name)}.png`,
      level: cleanLevel,
      rank,
      attribute: cleanAttr,
      type,
      fields,
      description,
      skills,
      priorEvolutions,
      nextEvolutions,
      isXAntibody: item.name.includes('(X-Antibody)'),
      stats: {
        hp,
        sp,
        atk,
        def,
        int,
        spd
      }
    };
  });

  const outputPath = path.join(__dirname, '..', 'src', 'data', 'digimon_catalog.json');
  fs.writeFileSync(outputPath, JSON.stringify(normalizedList, null, 2), 'utf-8');
  console.log(`✓ Catálogo DIGIVERSE gerado com sucesso em: ${outputPath}`);
  console.log(`✓ Total de Digimon importados e normalizados: ${normalizedList.length}`);
}

fetchDigimonCatalog();
