import { PlayerStats, Sticker } from '../types';

const STATS_KEY = 'joykids_nepal_stats_v1';
const SOUND_KEY = 'joykids_nepal_sound_enabled';

export const ALL_STICKERS: Sticker[] = [
  { id: 'lamb', name: 'Gentle Lamb', emoji: '🐑', cost: 15, description: 'The Little Sheep of the Good Shepherd', category: 'animals' },
  { id: 'dove', name: 'Peace Dove', emoji: '🕊️', cost: 15, description: 'Messenger of peace with an olive branch', category: 'bible' },
  { id: 'rainbow', name: 'Promise Rainbow', emoji: '🌈', cost: 20, description: "God's promise in the sky", category: 'nature' },
  { id: 'star', name: 'Bethlehem Star', emoji: '⭐', cost: 20, description: 'The shining star of hope', category: 'bible' },
  { id: 'lion', name: 'Brave Lion', emoji: '🦁', cost: 25, description: 'Strong and bold in faith', category: 'animals' },
  { id: 'fish', name: 'Happy Fish', emoji: '🐟', cost: 25, description: 'The miracle of five loaves and two fish', category: 'bible' },
  { id: 'boat', name: "Noah's Ark", emoji: '⛵', cost: 30, description: 'Safe refuge on the water', category: 'bible' },
  { id: 'bread', name: 'Daily Bread', emoji: '🍞', cost: 30, description: 'Giving thanks for our food', category: 'bible' },
  { id: 'sun', name: 'Joyful Sun', emoji: '☀️', cost: 35, description: 'Let your light shine bright!', category: 'nature' },
  { id: 'heart', name: 'Kind Heart', emoji: '💖', cost: 35, description: 'Love one another with pure hearts', category: 'bible' },
  { id: 'cross', name: 'Golden Cross', emoji: '✝️', cost: 40, description: 'Symbol of salvation and love', category: 'bible' },
  { id: 'crown', name: 'Crown of Joy', emoji: '👑', cost: 40, description: 'Treasures of heaven', category: 'bible' },
  { id: 'camel', name: 'Desert Camel', emoji: '🐪', cost: 45, description: 'Carrying wise gifts with patience', category: 'animals' },
  { id: 'tree', name: 'Tree of Life', emoji: '🌳', cost: 45, description: 'Rooted deep in goodness', category: 'nature' },
  { id: 'harp', name: 'Praise Harp', emoji: '🎵', cost: 50, description: 'Singing songs of joy with gladness', category: 'bible' },
  { id: 'church', name: 'Sunday School', emoji: '⛪', cost: 50, description: 'Where friends gather with love', category: 'bible' },
];

const DEFAULT_STATS: PlayerStats = {
  stars: 10, // 10 welcome stars!
  gamesPlayed: 0,
  unlockedStickers: ['lamb'], // First sticker unlocked by default!
  highScores: {},
};

export function loadPlayerStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        ...DEFAULT_STATS,
        ...parsed,
        unlockedStickers: Array.isArray(parsed.unlockedStickers) ? parsed.unlockedStickers : DEFAULT_STATS.unlockedStickers,
        highScores: parsed.highScores || {},
      };
    }
  } catch {
    // fallback
  }
  return DEFAULT_STATS;
}

export function savePlayerStats(stats: PlayerStats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch {
    // ignore in private mode
  }
}

export function loadSoundPreference(): boolean {
  try {
    const val = localStorage.getItem(SOUND_KEY);
    return val !== 'false';
  } catch {
    return true;
  }
}

export function saveSoundPreference(enabled: boolean) {
  try {
    localStorage.setItem(SOUND_KEY, enabled ? 'true' : 'false');
  } catch {
    // ignore
  }
}
