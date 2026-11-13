import React, { useState } from 'react';
import { Lightbulb, Lock, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
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

  // Conditions de déblocage
  const clue1Unlocked = guessesCount >= 3 || hasWon;
  const clue2Unlocked = guessesCount >= 6 || hasWon;
  const clue3Unlocked = guessesCount >= 8 || hasWon;

  // Contenus des indices
  const clue1Text = targetPlayer.formerClub
    ? `Ancien club ou formation : ${targetPlayer.formerClub}`
    : `Première lettre du prénom : "${targetPlayer.name[0]}"`;

  const clue2Text = targetPlayer.jerseyNumber
    ? `Numéro de maillot habituel : N°${targetPlayer.jerseyNumber}`
    : `Ligne de jeu : ${targetPlayer.line} (${targetPlayer.category})`;

  const clue3Text = targetPlayer.funFact
    ? targetPlayer.funFact
    : `Ce joueur compte ${targetPlayer.caps || 0} sélections internationales.`;

  return (
    <div className="w-full max-w-2xl mx-auto my-4 px-4">
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-xl backdrop-blur-md">
        {/* Accordion Header */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Lightbulb size={18} />
            </div>
            <div>
              <span className="font-bold text-sm sm:text-base text-slate-100">
                Indices disponibles
              </span>
              <span className="ml-2 text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-amber-400 border border-slate-700">
                {[clue1Unlocked, clue2Unlocked, clue3Unlocked].filter(Boolean).length} / 3
              </span>
            </div>
          </div>

          <div className="text-slate-400">
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </div>
        </button>

        {/* Clues Content */}
        {isOpen && (
          <div className="p-4 pt-1 border-t border-slate-800/80 space-y-3">
            {/* Indice 1 (après 3 essais) */}
            <div
              className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                clue1Unlocked
                  ? 'bg-amber-500/10 border-amber-500/30 text-slate-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="mt-0.5">
                {clue1Unlocked ? (
                  <CheckCircle2 size={16} className="text-amber-400" />
                ) : (
                  <Lock size={16} className="text-slate-500" />
                )}
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-amber-400 block mb-0.5">
                  Indice 1 {clue1Unlocked ? '' : '(Déblocage à 3 essais)'}
                </span>
                <span>{clue1Unlocked ? clue1Text : 'Fais encore des essais pour débloquer cet indice.'}</span>
              </div>
            </div>

            {/* Indice 2 (après 6 essais) */}
            <div
              className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                clue2Unlocked
                  ? 'bg-amber-500/10 border-amber-500/30 text-slate-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="mt-0.5">
                {clue2Unlocked ? (
                  <CheckCircle2 size={16} className="text-amber-400" />
                ) : (
                  <Lock size={16} className="text-slate-500" />
                )}
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-amber-400 block mb-0.5">
                  Indice 2 {clue2Unlocked ? '' : '(Déblocage à 6 essais)'}
                </span>
                <span>{clue2Unlocked ? clue2Text : 'Fais encore des essais pour débloquer cet indice.'}</span>
              </div>
            </div>

            {/* Indice 3 (après 8 essais) */}
            <div
              className={`p-3 rounded-xl border flex items-start gap-3 transition-all ${
                clue3Unlocked
                  ? 'bg-amber-500/10 border-amber-500/30 text-slate-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-500'
              }`}
            >
              <div className="mt-0.5">
                {clue3Unlocked ? (
                  <CheckCircle2 size={16} className="text-amber-400" />
                ) : (
                  <Lock size={16} className="text-slate-500" />
                )}
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-bold text-amber-400 block mb-0.5">
                  Indice 3 {clue3Unlocked ? '' : '(Déblocage à 8 essais)'}
                </span>
                <span>{clue3Unlocked ? clue3Text : 'Fais encore des essais pour débloquer l\'anecdote ultime.'}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
