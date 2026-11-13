import { PLAYERS } from '../data/players';
import { CLUBS } from '../data/clubs';
import type { Player, GuessResult, MatchStatus, Direction, GameStats } from '../types/game';

// Hash string deterministe (pour le mode quotidien)
export function getDailyPlayerIndex(dateStr?: string): number {
  const d = dateStr || new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < d.length; i++) {
    hash = (hash << 5) - hash + d.charCodeAt(i);
    hash |= 0;
  }
  const positiveHash = Math.abs(hash);
  return positiveHash % PLAYERS.length;
}

export function getDailyPlayer(dateStr?: string): Player {
  const index = getDailyPlayerIndex(dateStr);
  return PLAYERS[index];
}

export function getRandomPlayer(excludeId?: string): Player {
  const pool = excludeId ? PLAYERS.filter((p) => p.id !== excludeId) : PLAYERS;
  const randomIndex = Math.floor(Math.random() * pool.length);
  return pool[randomIndex];
}

// Calcule la comparaison entre le joueur proposé (guess) et le joueur mystère
export function comparePlayer(guess: Player, target: Player): GuessResult {
  const isWinningGuess = guess.id === target.id;

  // Club
  const clubStatus: MatchStatus = guess.clubId === target.clubId ? 'correct' : 'wrong';

  // Poste
  let positionStatus: MatchStatus = 'wrong';
  if (guess.position === target.position) {
    positionStatus = 'correct';
  } else if (guess.line === target.line || guess.category === target.category) {
    positionStatus = 'partial';
  }

  // Nationalité
  const nationalityStatus: MatchStatus = guess.nationality === target.nationality ? 'correct' : 'wrong';

  // Âge
  const ageDiff = target.age - guess.age;
  const ageStatus: MatchStatus = ageDiff === 0 ? 'correct' : Math.abs(ageDiff) <= 2 ? 'partial' : 'wrong';
  const ageDirection: Direction = ageDiff > 0 ? 'up' : ageDiff < 0 ? 'down' : 'none';

  // Taille (cm)
  const heightDiff = target.height - guess.height;
  const heightStatus: MatchStatus = heightDiff === 0 ? 'correct' : Math.abs(heightDiff) <= 3 ? 'partial' : 'wrong';
  const heightDirection: Direction = heightDiff > 0 ? 'up' : heightDiff < 0 ? 'down' : 'none';

  // Poids (kg)
  const weightDiff = target.weight - guess.weight;
  const weightStatus: MatchStatus = weightDiff === 0 ? 'correct' : Math.abs(weightDiff) <= 4 ? 'partial' : 'wrong';
  const weightDirection: Direction = weightDiff > 0 ? 'up' : weightDiff < 0 ? 'down' : 'none';

  // Statut International
  const internationalStatus: MatchStatus = guess.isInternational === target.isInternational ? 'correct' : 'wrong';

  return {
    player: guess,
    club: {
      value: guess.clubId,
      displayValue: CLUBS[guess.clubId]?.shortName || guess.clubId,
      status: clubStatus,
    },
    position: {
      value: guess.position,
      status: positionStatus,
    },
    nationality: {
      value: guess.nationality,
      displayValue: `${guess.flag} ${guess.nationality}`,
      status: nationalityStatus,
    },
    age: {
      value: guess.age,
      displayValue: `${guess.age} ans`,
      status: ageStatus,
      direction: ageDirection,
    },
    height: {
      value: guess.height,
      displayValue: `${guess.height} cm`,
      status: heightStatus,
      direction: heightDirection,
    },
    weight: {
      value: guess.weight,
      displayValue: `${guess.weight} kg`,
      status: weightStatus,
      direction: weightDirection,
    },
    isInternational: {
      value: guess.isInternational,
      displayValue: guess.isInternational ? `Oui (${guess.caps || 1}+)` : 'Non',
      status: internationalStatus,
    },
    isWinningGuess,
  };
}

// Génération du texte de partage avec emojis
export function generateShareText(guesses: GuessResult[], _target: Player, isDaily: boolean): string {
  const dayNumber = Math.floor(
    (Date.now() - new Date('2025-01-01').getTime()) / (1000 * 60 * 60 * 24)
  );

  const title = isDaily
    ? `🏉 Top14dle #${dayNumber} - ${guesses.length} essai${guesses.length > 1 ? 's' : ''}`
    : `🏉 Top14dle (Entraînement) - Trouvé en ${guesses.length} essai${guesses.length > 1 ? 's' : ''}`;

  const statusToEmoji = (status: MatchStatus, direction?: Direction): string => {
    if (status === 'correct') return '🟩';
    if (direction === 'up') return '⬆️';
    if (direction === 'down') return '⬇️';
    if (status === 'partial') return '🟨';
    return '🟥';
  };

  const grid = guesses
    .map((g) => {
      const c = statusToEmoji(g.club.status);
      const p = statusToEmoji(g.position.status);
      const n = statusToEmoji(g.nationality.status);
      const a = statusToEmoji(g.age.status, g.age.direction);
      const h = statusToEmoji(g.height.status, g.height.direction);
      const w = statusToEmoji(g.weight.status, g.weight.direction);
      const i = statusToEmoji(g.isInternational.status);
      return `${c}${p}${n}${a}${h}${w}${i}`;
    })
    .join('\n');

  return `${title}\n\n${grid}\n\nJouer sur https://top14dle.fr`;
}

// Gestion des statistiques locales
const STATS_STORAGE_KEY = 'top14dle_stats';

export function loadStats(): GameStats {
  try {
    const raw = localStorage.getItem(STATS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Erreur chargement stats', e);
  }
  return {
    played: 0,
    won: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: {},
  };
}

export function saveStats(stats: GameStats): void {
  try {
    localStorage.setItem(STATS_STORAGE_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Erreur sauvegarde stats', e);
  }
}

export function updateStatsOnWin(guessCount: number, isDaily: boolean): GameStats {
  const stats = loadStats();
  const today = new Date().toISOString().slice(0, 10);

  if (isDaily && stats.lastPlayedDate === today) {
    return stats; // Déjà comptabilisé pour aujourd'hui
  }

  stats.played += 1;
  stats.won += 1;
  stats.currentStreak += 1;
  if (stats.currentStreak > stats.maxStreak) {
    stats.maxStreak = stats.currentStreak;
  }
  stats.guessDistribution[guessCount] = (stats.guessDistribution[guessCount] || 0) + 1;
  if (isDaily) {
    stats.lastPlayedDate = today;
  }

  saveStats(stats);
  return stats;
}
