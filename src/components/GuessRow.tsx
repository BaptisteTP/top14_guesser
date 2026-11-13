import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import type { GuessResult, MatchStatus, Direction } from '../types/game';
import { CLUBS } from '../data/clubs';
import { PlayerAvatar } from './PlayerAvatar';
import { ClubLogo } from './ClubLogo';

interface GuessRowProps {
  guess: GuessResult;
  isNewest?: boolean;
}

export const GuessRow: React.FC<GuessRowProps> = ({ guess, isNewest = false }) => {
  const club = CLUBS[guess.player.clubId];

  const getStatusClasses = (status: MatchStatus) => {
    switch (status) {
      case 'correct':
        return 'bg-emerald-600 border-emerald-500 text-white';
      case 'partial':
        return 'bg-amber-600 border-amber-500 text-white';
      case 'wrong':
      default:
        return 'bg-slate-900 border-slate-800 text-slate-300';
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
            ? 'bg-emerald-600 border-emerald-500 text-white'
            : 'bg-slate-900 border-slate-800 text-white'
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

      {/* 4. Nationalité */}
      <div
        style={{ animationDelay: isNewest ? '450ms' : '0ms' }}
        className={`h-20 sm:h-22 p-1 rounded-xl border flex flex-col items-center justify-center text-center shadow-sm transition-all ${getStatusClasses(
          guess.nationality.status
        )} ${isNewest ? 'animate-flip' : ''}`}
      >
        <span className="text-xl mb-0.5">{guess.player.flag}</span>
        <span className="leading-tight text-[11px] truncate max-w-full font-bold">
          {guess.player.nationality}
        </span>
      </div>

      {/* 5. Âge */}
      <div
        style={{ animationDelay: isNewest ? '600ms' : '0ms' }}
        className={`h-20 sm:h-22 p-1 rounded-xl border flex items-center justify-center gap-0.5 text-center shadow-sm transition-all ${getStatusClasses(
          guess.age.status
        )} ${isNewest ? 'animate-flip' : ''}`}
      >
        <span className="text-sm font-bold">{guess.age.value} ans</span>
        {renderDirection(guess.age.direction)}
      </div>

      {/* 6. Taille */}
      <div
        style={{ animationDelay: isNewest ? '750ms' : '0ms' }}
        className={`h-20 sm:h-22 p-1 rounded-xl border flex items-center justify-center gap-0.5 text-center shadow-sm transition-all ${getStatusClasses(
          guess.height.status
        )} ${isNewest ? 'animate-flip' : ''}`}
      >
        <span className="text-sm font-bold">{guess.height.value} cm</span>
        {renderDirection(guess.height.direction)}
      </div>

      {/* 7. Poids */}
      <div
        style={{ animationDelay: isNewest ? '900ms' : '0ms' }}
        className={`h-20 sm:h-22 p-1 rounded-xl border flex items-center justify-center gap-0.5 text-center shadow-sm transition-all ${getStatusClasses(
          guess.weight.status
        )} ${isNewest ? 'animate-flip' : ''}`}
      >
        <span className="text-sm font-bold">{guess.weight.value} kg</span>
        {renderDirection(guess.weight.direction)}
      </div>

      {/* 8. Sélections */}
      <div
        style={{ animationDelay: isNewest ? '1050ms' : '0ms' }}
        className={`h-20 sm:h-22 p-1 rounded-xl border flex flex-col items-center justify-center text-center shadow-sm transition-all ${getStatusClasses(
          guess.isInternational.status
        )} ${isNewest ? 'animate-flip' : ''}`}
      >
        <span className="text-xs font-bold">
          {guess.player.isInternational ? 'Oui' : 'Non'}
        </span>
      </div>
    </div>
  );
};
