import React from 'react';
import { Trophy, HelpCircle, RotateCw, Calendar, Flame } from 'lucide-react';
import type { GameMode } from '../types/game';

interface HeaderProps {
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onOpenHelp: () => void;
  onOpenStats: () => void;
  onResetUnlimited?: () => void;
  hasWon: boolean;
  guessesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  onOpenHelp,
  onOpenStats,
  onResetUnlimited,
  guessesCount,
}) => {
  return (
    <header className="w-full max-w-4xl mx-auto pt-6 pb-4 px-4">
      {/* Top action row */}
      <div className="flex items-center justify-between gap-4 mb-4">
        {/* Help button */}
        <button
          onClick={onOpenHelp}
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all flex items-center gap-1.5 text-sm font-medium shadow-sm hover:scale-105 active:scale-95"
          title="Règles du jeu"
        >
          <HelpCircle size={19} className="text-amber-400" />
          <span className="hidden sm:inline">Règles</span>
        </button>

        {/* Title & Rugby Ball */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="text-3xl sm:text-4xl select-none animate-bounce">🏉</span>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white m-0">
              TOP<span className="text-amber-400">14</span>DLE
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
            Devine le joueur mystère du championnat de Top 14
          </p>
        </div>

        {/* Stats button */}
        <button
          onClick={onOpenStats}
          className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-all flex items-center gap-1.5 text-sm font-medium shadow-sm hover:scale-105 active:scale-95"
          title="Statistiques"
        >
          <Trophy size={19} className="text-amber-400" />
          <span className="hidden sm:inline">Stats</span>
        </button>
      </div>

      {/* Mode switcher tabs */}
      <div className="flex items-center justify-center gap-2 mt-4">
        <div className="inline-flex p-1 bg-slate-900/90 rounded-2xl border border-slate-800 shadow-inner">
          <button
            onClick={() => onModeChange('daily')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === 'daily'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar size={16} />
            <span>Joueur du Jour</span>
          </button>
          <button
            onClick={() => onModeChange('unlimited')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              mode === 'unlimited'
                ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame size={16} />
            <span>Entraînement Illimité</span>
          </button>
        </div>

        {mode === 'unlimited' && onResetUnlimited && (
          <button
            onClick={onResetUnlimited}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 transition-all hover:scale-105 active:scale-95"
            title="Changer de joueur"
          >
            <RotateCw size={14} className="text-amber-400" />
            <span className="hidden sm:inline">Rejouer</span>
          </button>
        )}
      </div>

      {/* Essais counter */}
      {guessesCount > 0 && (
        <div className="text-center mt-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-xs font-medium text-slate-300">
            <span>Essai{guessesCount > 1 ? 's' : ''} :</span>
            <span className="font-bold text-amber-400">{guessesCount}</span>
          </span>
        </div>
      )}
    </header>
  );
};
