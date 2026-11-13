import React from 'react';
import { X, Trophy, Flame, Award, Hash } from 'lucide-react';
import type { GameStats } from '../types/game';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: GameStats;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  const winRate = stats.played > 0 ? Math.round((stats.won / stats.played) * 100) : 0;
  const maxGuessCount = Math.max(...Object.values(stats.guessDistribution), 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3">
          <Trophy size={30} />
        </div>

        <h2 className="text-2xl font-black text-white tracking-tight">Statistiques</h2>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-4 gap-2.5 my-6">
          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
            <Hash size={16} className="text-slate-400 mx-auto mb-1" />
            <div className="text-xl sm:text-2xl font-black text-white">{stats.played}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Jouées</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
            <Award size={16} className="text-emerald-400 mx-auto mb-1" />
            <div className="text-xl sm:text-2xl font-black text-emerald-400">{winRate}%</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Victoires</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
            <Flame size={16} className="text-amber-400 mx-auto mb-1" />
            <div className="text-xl sm:text-2xl font-black text-amber-400">{stats.currentStreak}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Série</div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/70 border border-slate-800">
            <Trophy size={16} className="text-amber-500 mx-auto mb-1" />
            <div className="text-xl sm:text-2xl font-black text-amber-500">{stats.maxStreak}</div>
            <div className="text-[10px] uppercase font-bold text-slate-400">Max Série</div>
          </div>
        </div>

        {/* Guesses Distribution */}
        <div className="text-left mt-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Distribution des essais
          </h3>
          <div className="space-y-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => {
              const count = stats.guessDistribution[num] || 0;
              const widthPct = Math.max((count / maxGuessCount) * 100, 7);

              return (
                <div key={num} className="flex items-center gap-2 text-xs font-semibold">
                  <span className="w-4 text-slate-400 text-right">{num === 8 ? '8+' : num}</span>
                  <div className="flex-1 bg-slate-950 rounded-lg overflow-hidden h-6 p-0.5 border border-slate-800/80">
                    <div
                      style={{ width: `${widthPct}%` }}
                      className={`h-full rounded-md flex items-center justify-end px-2 text-[11px] font-bold text-slate-950 transition-all ${
                        count > 0 ? 'bg-amber-500' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {count}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
