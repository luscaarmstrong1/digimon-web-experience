import { TamerProfile, PartnerInstance } from '../types/digimon';

const STORAGE_KEY = 'digiverse_tamer_profile_v1';

export const initialStarterPartner: PartnerInstance = {
  instanceId: 'starter-agumon-01',
  digimonId: 1, // Agumon
  nickname: 'Agumon',
  level: 5,
  exp: 0,
  bond: 50,
  bonusStats: {
    hp: 20,
    sp: 10,
    atk: 5,
    def: 5,
    int: 5,
    spd: 5
  },
  equippedSkills: [
    { name: 'Pepper Breath', description: 'Cospe uma bola de fogo de altíssima temperatura.', spCost: 10, power: 45, element: 'Fire' },
    { name: 'Spitfire Blast', description: 'Dispara rajadas sucessivas de chamas explosivas.', spCost: 15, power: 60, element: 'Fire' }
  ],
  scanRate: 100,
  wins: 0,
  losses: 0
};

export const defaultProfile: TamerProfile = {
  name: 'Tamer Lucas',
  title: 'DigiDestined Explorer',
  avatarId: 1,
  bits: 2500,
  activePartnerInstanceId: 'starter-agumon-01',
  partners: [initialStarterPartner],
  discoveredIds: [1, 2, 3, 4, 5, 34, 54, 73],
  achievements: [
    'Digital Gate Opened',
    'First Partner Synchronized'
  ],
  highScores: {
    quizScore: 0,
    arenaStreak: 0,
    bossesDefeated: 0
  },
  settings: {
    soundVolume: 0.7,
    bgmVolume: 0.5,
    reducedMotion: false,
    highPerformanceMode: true
  }
};

export const getStoredProfile = (): TamerProfile => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return defaultProfile;
};

export const saveStoredProfile = (profile: TamerProfile) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore
  }
};
