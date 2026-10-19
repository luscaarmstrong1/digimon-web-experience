# DIGIVERSE — Digital Monster Experience
### Enciclopédia · Digievoluções · Batalhas · RPG · Treinamento · TCG · PWA Offline
**Developed with passion by luscaarmstrong**

---

## 🌐 Visão Geral do Projeto
O **DIGIVERSE** é uma plataforma e experiência web cinematográfica completa inspirada no universo dos jogos e animes da franquia Digimon (*Digimon Adventure, Tamers, Digimon World, Cyber Sleuth, Next Order* e *Digimon Card Game*). 

A aplicação reúne dados canônicos reais de **1.400 Digimon** integrados diretamente da DAPI (*digi-api.com*), apresentados sob um design system holográfico autêntico de Digivice com Web Audio sintetizado em tempo real e funcionamento offline garantido via PWA.

---

## ⚡ Módulos da Aplicação

### 1. 📖 DigiDex Interativa
- Catálogo com mais de **1.400 espécimes canônicos**.
- Plataforma holográfica isométrica 3D com luz de escaneamento adaptada ao atributo (*Vaccine, Data, Virus, Free*).
- Filtros multivariáveis em tempo real por atributo, estágio/rank e busca instantânea.
- Comparador lado a lado de dados biológicos, perfis canônicos e métricas de simulação DIGIVERSE.

### 2. 🧬 DigiEvolution Lab
- Visualizador de árvore evolutiva em grafo ramificado multirrota (formas prévias, nó ativo e ramificações posteriores).
- Sequência cinematográfica de Digievolução com anéis de energia, desconstrução binária, flash e reconstrução da nova forma.

### 3. ⚔️ DigiArena
- Motor de combate tático em turnos 1v1 e 3v3.
- Matriz canônica de vantagens do triângulo de atributos:
  $$\text{Vaccine} \rightarrow \text{Virus} \rightarrow \text{Data} \rightarrow \text{Vaccine}$$
- 10 Arenas temáticas exclusivas (Coliseu Digital, Floresta Primordial, Cidade Cyberpunk, Vulcão de Dados, Oceano Digital, Caverna de Cristais, Deserto de Circuitos, Templo Sagrado, Zona Corrompida e Núcleo Digital).
- Técnicas com consumo de SP, postura de defesa e inteligência artificial para o oponente.

### 4. 🧭 Digital World (RPG 2D)
- Motor de exploração em Canvas com loop de 60 FPS desacoplado.
- 7 Regiões exploráveis (*DigiVillage, Ancient Forest, Circuit City, Crystal Caverns, Data Ocean, Firewall Mountains, Dark Area*).
- Protagonista tamer com movimentação suave em 4 direções e parceiro Digimon seguidor.
- Sistema de escaneamento de dados selvagens (*Scan %*), NPCs, terminais digitais e missões ativas.

### 5. 🏡 DigiFarm
- Centro de treinamento com minigames dedicados para ganho de status (*Força/ATK, Resistência/DEF, Agilidade/SPD, Dados/INT*).
- Alimentação, descanso e sistema de Vínculo (*Bond %*) com persistência direta nos atributos do parceiro.

### 6. ❓ DigiQuiz
- Desafio de identificação por silhueta de dados holográfica com revelação dinâmica.
- Cronômetro, sistema de combos, pontuação e persistência de recordes.

### 7. 🃏 DigiCards (TCG)
- Galeria de cartas fiéis ao *Digimon Card Game* com efeito holográfico 3D tilt.
- Filtros por cor, número de carta, play cost, DP e efeitos herdados.

### 8. 👤 DigiCore
- Central do treinador com sincronização de perfil, conquistas desbloqueáveis e backup/exportação de dados em JSON.

---

## 🛠️ Stack Tecnológica
- **Core:** React 19, TypeScript, Vite
- **Roteamento:** React Router DOM (v7)
- **Áudio:** Web Audio API (Sintetizador Sci-Fi procedimental sem dependências externas)
- **PWA:** Vite PWA Plugin, Service Worker com precache de assets
- **Estilização:** CSS Modules e Variáveis Globais Sci-Fi com clip-path chamfer
- **Testes:** Vitest (100% dos testes aprovados)

---

## 🚀 Como Executar Localmente

```bash
# Clone o repositório
git clone https://github.com/luscaarmstrong1/digimon-web-experience.git

# Acesse a pasta
cd digimon-web-experience

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev

# Execute a suíte de testes unitários
npm test

# Crie a build de produção
npm run build
```

---

## 📜 Avisos Legais e Créditos
*Digimon*, *Digital Monster*, logotipos oficiais e todos os nomes e imagens de criaturas associadas são marcas registradas e propriedade intelectual de **Bandai Namco Entertainment Inc.**, **Akiyoshi Hongo** e **Toei Animation Co., Ltd.**
Este projeto é uma obra de fã sem fins lucrativos desenvolvida por **luscaarmstrong** para fins educacionais. Todo o código original está sob licença MIT.
