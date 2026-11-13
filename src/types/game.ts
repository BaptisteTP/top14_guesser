export type Position =
  | 'Pilier gauche'
  | 'Talonneur'
  | 'Pilier droit'
  | 'Deuxième ligne'
  | 'Troisième ligne aile'
  | 'Troisième ligne centre'
  | 'Demi de mêlée'
  | 'Demi d\'ouverture'
  | 'Centre'
  | 'Ailier'
  | 'Arrière';

export type PositionLine =
  | '1ère ligne'
  | '2e ligne'
  | '3e ligne'
  | 'Charnière'
  | 'Centres'
  | 'Triangle arrière';

export type PositionCategory = 'Avants' | 'Arrières';

export interface Club {
  id: string;
  name: string;
  shortName: string;
  city: string;
  stadium: string;
  colors: {
    primary: string;
    secondary: string;
    text: string;
  };
  logo: string;
  badgeEmoji?: string;
}

export interface Player {
  id: string;
  name: string;
  clubId: string;
  position: Position;
  line: PositionLine;
  category: PositionCategory;
  nationality: string;
  flag: string;
  age: number;
  height: number; // in cm
  weight: number; // in kg
  isInternational: boolean;
  caps?: number;
  formerClub?: string;
  jerseyNumber?: number;
  funFact?: string;
  photoUrl?: string;
}

export type MatchStatus = 'correct' | 'partial' | 'wrong';
export type Direction = 'up' | 'down' | 'none';

export interface AttributeResult<T = string | number | boolean> {
  value: T;
  displayValue?: string;
  status: MatchStatus;
  direction?: Direction;
}

export interface GuessResult {
  player: Player;
  club: AttributeResult<string>;
  position: AttributeResult<string>;
  nationality: AttributeResult<string>;
  age: AttributeResult<number>;
  height: AttributeResult<number>;
  weight: AttributeResult<number>;
  isInternational: AttributeResult<boolean>;
  isWinningGuess: boolean;
}

export type GameMode = 'daily' | 'unlimited';
export type ActiveGame = 'classic' | 'blur' | 'higher-lower' | 'quiz';

export interface GameStats {
  played: number;
  won: number;
  currentStreak: number;
  maxStreak: number;
  guessDistribution: Record<number, number>;
  lastPlayedDate?: string;
}
