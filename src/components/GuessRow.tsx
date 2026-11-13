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

  // Helper pour les classes de couleur selon le statut
  const getStatusClasses = (status: MatchStatus) => {
    switch (status) {
      case 'correct':
        return 'bg-emerald-600 border-emerald-400 text-white shadow-emerald-900/30';
      case 'partial':
        return 'bg-amber-600 border-amber-400 text-white shadow-amber-900/30';
      case 'wrong':
      default:
        return 'bg-slate-800/90 border-slate-700/80 text-slate-300 shadow-slate-950/40';
    }
  };

  // Rendu d'une flèche indicateur
  const renderDirection = (dir?: Direction) => {
    if (!dir || dir === 'none') return null;
    return (
      <span
        className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-black/30 border border-white/20 text-white shadow-inner animate-pulse"
        title={dir === 'up' ? 'Le joueur mystère a une valeur supérieure' : 'Le joueur mystère a une valeur inférieure'}
      >
        {dir === 'up' ? <ArrowUp size={13} strokeWidth={3} /> : <ArrowDown size={13} strokeWidth={3} />}
      </span>
    );
  };

  return (
    <div className="w-full grid grid-cols-8 gap-1.5 sm:gap-2.5 my-2.5 text-xs sm:text-sm font-semibold select-none">
      {/* 1. Joueur (Photo + Nom) */}
      <div
        style={{ animationDelay: isNewest ? '0ms' : '0ms' }}
        className={`h-24 sm:h-28 p-1 sm:p-2 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center text-center shadow-lg transition-all ${
          guess.isWinningGuess
            ? 'bg-emerald-600 border-emerald-400 text-white animate-bounce'
            : 'bg-slate-900 border-slate-700/80 text-white'
        } ${isNewest ? 'animate-flip' : ''}`}
      >
        <div className="mb-1">
          <PlayerAvatar player={guess.player} size="sm" />
        </div>
        <span className="leading-tight text-[11px] sm:text-xs font-bold line-clamp-2">
          {guess.player.name}
        </span>
      </div>

      {/* 2. Club (Logo Officiel + Nom) */}
      <div
        style={{ animationDelay: isNewest ? '150ms' : '0ms' }}
        className={`h-24 sm:h-28 p-1 sm:p-2 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center text-center shadow-lg transition-all ${getStatusClasses(
          guess.club.status
        )} ${isNewest ? 'animate-flip' : ''}`}
      >
        <div className="mb-1">
          <ClubLogo club={club} size="sm" />
        </div>
        <span className="leading-tight text-[10px] sm:text-xs font-bold">
          {club?.shortName || guess.club.displayValue}
        </span>
      </div>

      {/* 3. Poste */}
      <div
        style={{ animationDelay: isNewest ? '300ms' : '0ms' }}
        className={`h-24 sm:h-28 p-1 sm:p-2 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center text-center shadow-lg transition-all ${getStatusClasses(
          guess.position.status
        )} ${isNewest ? 'animate-flip' : ''}`}
      >
        <span className="text-[11px] sm:text-xs leading-tight font-bold">
          {guess.position.value}
        </span>
        <span className="text-[9px] sm:text-[10px] opacity-80 mt-1 uppercase tracking-wider">
          {guess.player.line}
        </span>
      </div>

      {/* 4. Nationalité (Drapeau + Pays) */}
      <div
        style={{ animationDelay: isNewest ? '450ms' : '0ms' }}
        className={`h-24 sm:h-28 p-1 sm:p-2 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center text-center shadow-lg transition-all ${getStatusClasses(
          guess.nationality.status
        )} ${isNewest ? 'animate-flip' : ''}`}
      >
        <span className="text-2xl sm:text-3xl mb-1">{guess.player.flag}</span>
        <span className="leading-tight text-[10px] sm:text-xs truncate max-w-full font-bold">
          {guess.player.nationality}
        </span>
      </div>

      {/* 5. Âge */}
      <div
        style={{ animationDelay: isNewest ? '600ms' : '0ms' }}
        className={`h-24 sm:h-28 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center text-center shadow-lg transition-all ${getStatusClasses(
          guess.age.status
        )} ${isNewest ? 'animate-flip' : ''}`}
      >
        <span className="text-sm sm:text-base font-bold">{guess.age.value} ans</span>
        <div className="mt-1">{renderDirection(guess.age.direction)}</div>
      </div>

      {/* 6. Taille */}
      <div
        style={{ animationDelay: isNewest ? '750ms' : '0ms' }}
        className={`h-24 sm:h-28 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center text-center shadow-lg transition-all ${getStatusClasses(
          guess.height.status
        )} ${isNewest ? 'animate-flip' : ''}`}
      >
        <span className="text-sm sm:text-base font-bold">{guess.height.value} cm</span>
        <div className="mt-1">{renderDirection(guess.height.direction)}</div>
      </div>

      {/* 7. Poids */}
      <div
        style={{ animationDelay: isNewest ? '900ms' : '0ms' }}
        className={`h-24 sm:h-28 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center text-center shadow-lg transition-all ${getStatusClasses(
          guess.weight.status
        )} ${isNewest ? 'animate-flip' : ''}`}
      >
        <span className="text-sm sm:text-base font-bold">{guess.weight.value} kg</span>
        <div className="mt-1">{renderDirection(guess.weight.direction)}</div>
      </div>

      {/* 8. International */}
      <div
        style={{ animationDelay: isNewest ? '1050ms' : '0ms' }}
        className={`h-24 sm:h-28 p-1 sm:p-2 rounded-xl sm:rounded-2xl border flex flex-col items-center justify-center text-center shadow-lg transition-all ${getStatusClasses(
          guess.isInternational.status
        )} ${isNewest ? 'animate-flip' : ''}`}
      >
        <span className="text-xs sm:text-sm font-bold">
          {guess.player.isInternational ? 'International' : 'Non'}
        </span>
        {guess.player.isInternational && guess.player.caps && (
          <span className="text-[10px] sm:text-xs opacity-80 mt-0.5">
            ({guess.player.caps} sélec.)
          </span>
        )}
      </div>
    </div>
  );
};
