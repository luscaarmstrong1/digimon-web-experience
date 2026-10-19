export interface SkillDefinition {
  name: string;
  description: string;
  spCost?: number;
  power?: number;
  element?: BattleElement;
}

export interface EvolutionLink {
  id: number;
  name: string;
  image: string;
  condition: string;
}

export interface BattleStats {
  hp: number;
  sp: number;
  atk: number;
  def: number;
  int: number;
  spd: number;
}

export type DigimonAttribute = 'Vaccine' | 'Data' | 'Virus' | 'Free';

export type BattleElement =
  | 'Fire'
  | 'Water'
  | 'Plant'
  | 'Thunder'
  | 'Wind'
  | 'Earth'
  | 'Light'
  | 'Dark'
  | 'Neutral';

export interface DigimonDefinition {
  id: number;
  name: string;
  image: string;
  level: string;
  rank: number;
  attribute: DigimonAttribute;
  type: string;
  fields: string[];
  description: string;
  skills: SkillDefinition[];
  priorEvolutions: EvolutionLink[];
  nextEvolutions: EvolutionLink[];
  isXAntibody: boolean;
  stats: BattleStats;
}

export interface PartnerInstance {
  instanceId: string;
  digimonId: number;
  nickname: string;
  level: number;
  exp: number;
  bond: number; // 0 to 100
  bonusStats: BattleStats;
  equippedSkills: SkillDefinition[];
  scanRate: number; // 0 to 200%
  wins: number;
  losses: number;
}

export interface TamerProfile {
  name: string;
  title: string;
  avatarId: number;
  bits: number;
  activePartnerInstanceId: string;
  partners: PartnerInstance[];
  discoveredIds: number[];
  achievements: string[];
  highScores: {
    quizScore: number;
    arenaStreak: number;
    bossesDefeated: number;
  };
  settings: {
    soundVolume: number;
    bgmVolume: number;
    reducedMotion: boolean;
    highPerformanceMode: boolean;
  };
}

export interface DigimonCard {
  cardnumber: string;
  name: string;
  type: 'Digimon' | 'Tamer' | 'Option' | 'Digi-Egg';
  color: string;
  stage?: string;
  attribute?: string;
  cardrarity?: string;
  artist?: string;
  dp?: string | number;
  play_cost?: string | number;
  digivolve_cost?: string | number;
  maineffect?: string;
  soureeffect?: string;
  image_url?: string;
}
