import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { GuessResult, MatchStatus, Direction } from '../types/game';
import { CLUBS } from '../data/clubs';
import { PlayerAvatar } from './PlayerAvatar';
import { ClubLogo } from './ClubLogo';
import { CountryFlag } from './CountryFlag';

interface GuessRowProps {
  guess: GuessResult;
  isNewest?: boolean;
}

export const GuessRow: React.FC<GuessRowProps> = ({ guess, isNewest = false }) => {
  const club = CLUBS[guess.player.clubId];

  const getStatusClasses = (status: MatchStatus) => {
    switch (status) {
      case 'correct':
        return 'bg-emerald-600 border-emerald-500 text-white font-bold';
      case 'partial':
        return 'bg-amber-500 border-amber-400 text-slate-950 font-bold';
      case 'wrong':
      default:
        return 'bg-slate-200 dark:bg-slate-900 border-slate-300 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-medium';
    }
  };

  const renderDirection = (dir?: Direction) => {
    if (!dir || dir === 'none') return null;
    return (
      <span className="inline-flex items-center justify-center ml-0.5">
        {dir === 'up' ? <ArrowUp size={12} strokeWidth={2.5} /> : <ArrowDown size={12} strokeWidth={2.5} />}
      </span>
    );
  };

  return (
    <div className="w-full grid grid-cols-8 gap-1.5 sm:gap-2 text-xs font-semibold select-none">
      {/* 1. Joueur */}
      <div
        style={{ animationDelay: isNewest ? '0ms' : '0ms' }}
        className={`h-20 sm:h-22 p-1 rounded-xl border flex flex-col items-center justify-center text-center shadow-sm transition-all ${
          guess.isWinningGuess
            ? 'bg-emerald-600 border-emerald-500 text-white font-bold'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white'
        } ${isNewest ? 'animate-flip' : ''}`}
      >
        <div className="mb-1">
          <PlayerAvatar player={guess.player} size="xs" />
        </div>
        <span className="leading-tight text-[11px] font-bold line-clamp-2">
          {guess.player.name}
        </span>
      </div>

      {/* 2. Club */}
      <div
        style={{ animationDelay: isNewest ? '150ms' : '0ms' }}
        className={`h-20 sm:h-22 p-1 rounded-xl border flex flex-col items-center justify-center text-center shadow-sm transition-all ${getStatusClasses(
          guess.club.status
        )} ${isNewest ? 'animate-flip' : ''}`}
      >
        <div className="mb-1">
          <ClubLogo club={club} size="xs" />
        </div>
        <span className="leading-tight text-[11px] font-bold">
          {club?.shortName || guess.club.displayValue}
        </span>
      </div>

      {/* 3. Poste */}
      <div
        style={{ animationDelay: isNewest ? '300ms' : '0ms' }}
        className={`h-20 sm:h-22 p-1 rounded-xl border flex flex-col items-center justify-center text-center shadow-sm transition-all ${getStatusClasses(
          guess.position.status
        )} ${isNewest ? 'animate-flip' : ''}`}
      >
        <span className="text-[11px] leading-tight font-bold">
          {guess.position.value}
        </span>
      </div>

      {/* 4. Nationalité (Drapeau officiel + Pays) */}
      <div
        style={{ animationDelay: isNewest ? '450ms' : '0ms' }}
        className={`h-20 sm:h-22 p-1 rounded-xl border flex flex-col items-center justify-center text-center shadow-sm transition-all ${getStatusClasses(
          guess.nationality.status
        )} ${isNewest ? 'animate-flip' : ''}`}
      >
        <div className="mb-1 flex items-center justify-center">
          <CountryFlag
            nationality={guess.player.nationality}
            fallbackEmoji={guess.player.flag}
            size="lg"
          />
        </div>
        <span className="leading-tight text-[11px] truncate max-w-full font-bold">
          {guess.player.nationality}
        </span>
      </div>

      {/* 5. Âge */}
      <div
        style={{ animationDelay: isNewest ? '600ms' : '0ms' }}
        className={`h-20 sm:h-22 p-1 rounded-xl border flex flex-col items-center justify-center text-center shadow-sm transition-all ${getStatusClasses(
          guess.age.status
        )} ${isNewest ? 'animate-flip' : ''}`}
      >
        <span className="text-sm font-bold flex items-center justify-center">
          {guess.age.value}
          {renderDirection(guess.age.direction)}
        </span>
        <span className="text-[10px] opacity-80">ans</span>
      </div>

      {/* 6. Taille */}
      <div
        style={{ animationDelay: isNewest ? '750ms' : '0ms' }}
        className={`h-20 sm:h-22 p-1 rounded-xl border flex flex-col items-center justify-center text-center shadow-sm transition-all ${getStatusClasses(
          guess.height.status
        )} ${isNewest ? 'animate-flip' : ''}`}
      >
        <span className="text-sm font-bold flex items-center justify-center">
          {guess.height.value}
          {renderDirection(guess.height.direction)}
        </span>
        <span className="text-[10px] opacity-80">cm</span>
      </div>

      {/* 7. Poids */}
      <div
        style={{ animationDelay: isNewest ? '900ms' : '0ms' }}
        className={`h-20 sm:h-22 p-1 rounded-xl border flex flex-col items-center justify-center text-center shadow-sm transition-all ${getStatusClasses(
          guess.weight.status
        )} ${isNewest ? 'animate-flip' : ''}`}
      >
        <span className="text-sm font-bold flex items-center justify-center">
          {guess.weight.value}
          {renderDirection(guess.weight.direction)}
        </span>
        <span className="text-[10px] opacity-80">kg</span>
      </div>

      {/* 8. International */}
      <div
        style={{ animationDelay: isNewest ? '1050ms' : '0ms' }}
        className={`h-20 sm:h-22 p-1 rounded-xl border flex flex-col items-center justify-center text-center shadow-sm transition-all ${getStatusClasses(
          guess.isInternational.status
        )} ${isNewest ? 'animate-flip' : ''}`}
      >
        <span className="text-sm font-bold">
          {guess.isInternational.value ? 'Oui' : 'Non'}
        </span>
      </div>
    </div>
  );
};
