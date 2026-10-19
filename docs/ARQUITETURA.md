# Arquitetura de Software — DIGIVERSE

## 1. Visão Geral da Stack
- **Framework Base:** React 19 + TypeScript + Vite.
- **Roteamento:** React Router DOM (v7) com URLs semânticas (`/`, `/digidex`, `/evolution`, `/arena`, `/world`, `/farm`, `/quiz`, `/cards`, `/core`).
- **Estilização e Design System:** CSS Modules com variáveis de tema centralizadas, responsividade fluida e mixins de efeitos holográficos e sonoros Web Audio.
- **Armazenamento e Offline:** IndexedDB versionado via wrapper de tipagem estrita com fallback de LocalStorage; Service Worker PWA para caching e offline completo.
- **Motor de Renderização Digital World:** Canvas 2D de alta performance com loop de animação desacoplado do ciclo de renderização do React (60 FPS contínuos, sistema de tilemap dinâmico, física de colisão, iluminação radial e entidades animadas).

## 2. Camada de Dados e Entidades
- `DigimonDefinition`: Dados canônicos (id, name, level, attribute, type, fields, description, skills, images, prior/next evolutions).
- `BattleStats`: Atributos derivados de jogo DIGIVERSE (HP, SP, ATK, DEF, INT, SPD, triângulo Vaccine > Virus > Data > Vaccine).
- `PartnerInstance`: Instância do Digimon do jogador com apelido, nível de treinamento, pontos de status alocados, vínculo e golpes aprendidos.
- `TamerProfile`: Perfil do usuário (nome, insígnia, parceiro ativo, deck/time, histórico de batalhas e conquistas).
- `WorldState`: Posição no mapa atual, inventário, missões ativas e progresso de escaneamento de dados selvagens.

## 3. Isolamento e Segurança de Estado
Os módulos de Batalha e Exploração operam com máquinas de estado puras, facilitando testes unitários e prevenindo perda de sincronia.
