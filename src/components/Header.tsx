import React from 'react';
import { Trophy, HelpCircle, RotateCw, Sun, Moon } from 'lucide-react';
import type { GameMode, ActiveGame } from '../types/game';

interface HeaderProps {
  mode: GameMode;
  activeGame: ActiveGame;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onModeChange: (mode: GameMode) => void;
  onOpenHelp: () => void;
  onOpenStats: () => void;
  onResetUnlimited?: () => void;
  hasWon: boolean;
  guessesCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  activeGame,
  theme,
  onToggleTheme,
  onModeChange,
  onOpenHelp,
  onOpenStats,
  onResetUnlimited,
  guessesCount,
}) => {
  return (
    <header className="w-full max-w-4xl mx-auto px-4 py-3.5 border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between gap-2">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-2">
          <span className="text-2xl select-none">🏉</span>
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white m-0 leading-none">
              TOP<span className="text-amber-500">14</span>DLE
            </h1>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
              Le jeu des fans de Top 14
            </span>
          </div>
        </div>

        {/* Center: Mode switcher (Classic game only) */}
        {activeGame === 'classic' ? (
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
            <button
              onClick={() => onModeChange('daily')}
              className={`px-3 py-1 rounded-lg transition-all ${
                mode === 'daily'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Quotidien
            </button>
            <button
              onClick={() => onModeChange('unlimited')}
              className={`px-3 py-1 rounded-lg transition-all ${
                mode === 'unlimited'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Illimité
            </button>
          </div>
        ) : (
          <div className="hidden sm:block text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800">
            {activeGame === 'blur' && '👤 Mode Mystère Flou'}
            {activeGame === 'higher-lower' && '⚖️ Mode Plus ou Moins'}
            {activeGame === 'quiz' && '🏉 Mode Quiz Club'}
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {activeGame === 'classic' && mode === 'unlimited' && onResetUnlimited && (
            <button
              onClick={onResetUnlimited}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Nouveau joueur"
            >
              <RotateCw size={18} />
            </button>
          )}

          <button
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>

          <button
            onClick={onOpenStats}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Statistiques"
          >
            <Trophy size={18} />
          </button>

          <button
            onClick={onOpenHelp}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Comment jouer"
          >
            <HelpCircle size={18} />
          </button>
        </div>
      </div>

      {/* Discreet counter for classic mode */}
      {activeGame === 'classic' && guessesCount > 0 && (
        <div className="text-center mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          Essai <span className="text-amber-600 dark:text-amber-400 font-bold">{guessesCount}</span>
        </div>
      )}
    </header>
  );
};
