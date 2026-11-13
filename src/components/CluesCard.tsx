import React, { useState } from 'react';
import { Lightbulb, X } from 'lucide-react';
import type { Player } from '../types/game';

interface CluesCardProps {
  targetPlayer: Player;
  guessesCount: number;
  hasWon: boolean;
}

export const CluesCard: React.FC<CluesCardProps> = ({
  targetPlayer,
  guessesCount,
  hasWon,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const clue1Unlocked = guessesCount >= 3 || hasWon;
  const clue2Unlocked = guessesCount >= 6 || hasWon;
  const clue3Unlocked = guessesCount >= 8 || hasWon;

  const unlockedCount = [clue1Unlocked, clue2Unlocked, clue3Unlocked].filter(Boolean).length;

  if (unlockedCount === 0) {
    return null;
  }

  const clue1Text = targetPlayer.formerClub
    ? `Ancien club / Origine : ${targetPlayer.formerClub}`
    : `Initiale du prénom : "${targetPlayer.name[0]}"`;

  const clue2Text = targetPlayer.jerseyNumber
    ? `Numéro habituel : N°${targetPlayer.jerseyNumber}`
    : `Poste : ${targetPlayer.line} (${targetPlayer.category})`;

  const clue3Text = targetPlayer.funFact
    ? targetPlayer.funFact
    : `Compte ${targetPlayer.caps || 0} sélections internationales.`;

  return (
    <div className="w-full max-w-lg mx-auto my-3 px-4 text-center">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 hover:bg-amber-500/25 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-sm"
        >
          <Lightbulb size={14} />
          <span>{unlockedCount} indice{unlockedCount > 1 ? 's' : ''} débloqué{unlockedCount > 1 ? 's' : ''}</span>
        </button>
      ) : (
        <div className="relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left shadow-xl text-xs space-y-2">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-3 right-3 text-slate-400 hover:text-slate-800 dark:hover:text-white p-1"
          >
            <X size={14} />
          </button>

          <div className="font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1 mb-2 text-sm">
            <Lightbulb size={16} />
            <span>Indices</span>
          </div>

          {clue1Unlocked && (
            <div className="text-slate-700 dark:text-slate-300">
              <span className="font-bold text-slate-900 dark:text-slate-400">Indice 1 :</span> {clue1Text}
            </div>
          )}

          {clue2Unlocked && (
            <div className="text-slate-700 dark:text-slate-300 pt-1.5 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-slate-400">Indice 2 :</span> {clue2Text}
            </div>
          )}

          {clue3Unlocked && (
            <div className="text-slate-700 dark:text-slate-300 pt-1.5 border-t border-slate-100 dark:border-slate-800">
              <span className="font-bold text-slate-900 dark:text-slate-400">Indice 3 :</span> {clue3Text}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
