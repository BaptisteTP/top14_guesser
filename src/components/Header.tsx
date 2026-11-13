import React from 'react';
import { Trophy, HelpCircle, RotateCw } from 'lucide-react';
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
    <header className="w-full max-w-4xl mx-auto px-4 py-4 border-b border-slate-800/60 mb-6">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl select-none">🏉</span>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white m-0">
            TOP<span className="text-amber-400">14</span>DLE
          </h1>
        </div>

        {/* Center: Mode switcher */}
        <div className="inline-flex p-1 bg-slate-900 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => onModeChange('daily')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === 'daily'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Quotidien
          </button>
          <button
            onClick={() => onModeChange('unlimited')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              mode === 'unlimited'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Illimité
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {mode === 'unlimited' && onResetUnlimited && (
            <button
              onClick={onResetUnlimited}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Nouveau joueur"
            >
              <RotateCw size={18} />
            </button>
          )}

          <button
            onClick={onOpenStats}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Statistiques"
          >
            <Trophy size={18} />
          </button>

          <button
            onClick={onOpenHelp}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Comment jouer"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </div>

      {/* Discreet counter */}
      {guessesCount > 0 && (
        <div className="text-center mt-3 text-xs text-slate-400 font-medium">
          Essai <span className="text-amber-400 font-bold">{guessesCount}</span>
        </div>
      )}
    </header>
  );
};
