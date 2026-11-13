import React from 'react';
import type { GuessResult } from '../types/game';
import { GuessRow } from './GuessRow';

interface GuessesTableProps {
  guesses: GuessResult[];
}

export const GuessesTable: React.FC<GuessesTableProps> = ({ guesses }) => {
  if (guesses.length === 0) {
    return (
      <div className="w-full max-w-lg mx-auto my-12 text-center text-slate-500 text-xs sm:text-sm">
        Devine le joueur du Top 14 en tapant son nom ci-dessus.
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto my-6 px-2 sm:px-4">
      {/* Scrollable table container */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[640px]">
          {/* Header Row */}
          <div className="w-full grid grid-cols-8 gap-1.5 sm:gap-2 pb-2 text-slate-400 text-[11px] sm:text-xs font-semibold text-center border-b border-slate-800/80 uppercase tracking-wider">
            <div>Joueur</div>
            <div>Club</div>
            <div>Poste</div>
            <div>Nationalité</div>
            <div>Âge</div>
            <div>Taille</div>
            <div>Poids</div>
            <div>Sélec.</div>
          </div>

          {/* Guesses list */}
          <div className="mt-2 space-y-1.5">
            {guesses.map((guess, index) => (
              <GuessRow
                key={guess.player.id}
                guess={guess}
                isNewest={index === 0}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
