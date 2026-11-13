import React from 'react';
import type { GuessResult } from '../types/game';
import { GuessRow } from './GuessRow';
import { User, Shield, Shirt, Flag, Calendar, Ruler, Weight, Globe2 } from 'lucide-react';

interface GuessesTableProps {
  guesses: GuessResult[];
}

export const GuessesTable: React.FC<GuessesTableProps> = ({ guesses }) => {
  if (guesses.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto my-12 text-center p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 backdrop-blur-md">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-3xl">
          🏉
        </div>
        <h3 className="text-lg font-bold text-slate-200">Prêt à jouer ?</h3>
        <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
          Entre le nom d'un joueur du Top 14 pour obtenir tes premiers indices de couleur (vert, jaune, rouge).
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto my-6 px-2 sm:px-4">
      {/* Scrollable container for mobile */}
      <div className="overflow-x-auto pb-4">
        <div className="min-w-[680px]">
          {/* Header Row */}
          <div className="w-full grid grid-cols-8 gap-1.5 sm:gap-2.5 pb-2 border-b border-slate-800 text-slate-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-center">
            <div className="flex items-center justify-center gap-1">
              <User size={13} className="text-amber-400" />
              <span>Joueur</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Shield size={13} className="text-amber-400" />
              <span>Club</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Shirt size={13} className="text-amber-400" />
              <span>Poste</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Flag size={13} className="text-amber-400" />
              <span>Nationalité</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Calendar size={13} className="text-amber-400" />
              <span>Âge</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Ruler size={13} className="text-amber-400" />
              <span>Taille</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Weight size={13} className="text-amber-400" />
              <span>Poids</span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <Globe2 size={13} className="text-amber-400" />
              <span>Statut Int.</span>
            </div>
          </div>

          {/* Guesses list (latest at top like Narutodle / Loldle) */}
          <div className="mt-2 divide-y divide-slate-800/40">
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
