# Fontes de Dados e Integração de APIs

## 1. DAPI (https://digi-api.com)
- **Status:** Operacional e validada.
- **Total de Registros:** 1.488 Digimon documentados.
- **Endpoints Chave:**
  - `GET /api/v1/digimon?page=0&pageSize=X`: Listagem paginada com id, nome, imagem e href de detalhe.
  - `GET /api/v1/digimon/{id}` ou `/{name}`: Detalhe completo contendo descrições (inglês/japonês), níveis (`levels`), atributos (`attributes`), tipos/espécies (`types`), campos (`fields`), técnicas (`skills`), digievoluções anteriores (`priorEvolutions`) e digievoluções posteriores (`nextEvolutions`).
- **Estratégia de Cache e Snapshot:**
  - Snapshot local compactado em `src/data/digimon_catalog.json` para permitir inicialização instantânea, funcionamento 100% offline e imunidade a oscilações de rede.
  - Serviço de sincronização dinâmica e carregamento sob demanda para detalhes e imagens complementares.

## 2. API Alternativa Digimon (https://digimon-api.vercel.app)
- **Status:** Disponível com 209 registros clássicos.
- **Uso:** Fallback leve de imagens e conferência cruzada de nomes clássicos (Adventure/Tamers).

## 3. DigimonCard.io (https://digimoncard.io)
- **Status:** API pública com rate-limits e restrições expressas de hotlinking direto de imagens.
- **Uso:** Catálogo de metadados, busca por nome, cartas de Tamer, Digimon e Option.
- **Respeito aos Direitos:** Metadados estruturados em cartões holográficos simulados com canvas/CSS 3D e links de referência para registros oficiais do World Digimon Card.
