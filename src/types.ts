export type GameId = 
  | 'memory'
  | 'word-quiz'
  | 'star-catcher'
  | 'coloring'
  | 'maze'
  | 'spot-difference'
  | 'word-jumble'
  | 'hidden-objects';

export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type PlayerMode = 1 | 2 | 3;

export interface TeamInfo {
  id: number;
  name: string;
  emoji: string;
  colorName: string;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  badgeClass: string;
}

export interface GameSettings {
  difficulty: DifficultyLevel;
  playerCount: PlayerMode;
}

export const TEAMS_DATA: Record<number, TeamInfo> = {
  1: {
    id: 1,
    name: 'Red Team',
    emoji: '🔴',
    colorName: 'rose',
    colorClass: 'text-rose-600',
    bgClass: 'bg-rose-50',
    borderClass: 'border-rose-300',
    badgeClass: 'bg-rose-500 text-white',
  },
  2: {
    id: 2,
    name: 'Blue Team',
    emoji: '🔵',
    colorName: 'blue',
    colorClass: 'text-blue-600',
    bgClass: 'bg-blue-50',
    borderClass: 'border-blue-300',
    badgeClass: 'bg-blue-500 text-white',
  },
  3: {
    id: 3,
    name: 'Green Team',
    emoji: '🟢',
    colorName: 'emerald',
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50',
    borderClass: 'border-emerald-300',
    badgeClass: 'bg-emerald-500 text-white',
  },
};

export interface GameInfo {
  id: GameId;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  tag: string;
}

export interface Sticker {
  id: string;
  name: string;
  emoji: string;
  cost: number;
  description: string;
  category: 'animals' | 'bible' | 'nature';
}

export interface PlayerStats {
  stars: number;
  gamesPlayed: number;
  unlockedStickers: string[];
  highScores: Record<string, number>;
}
