import React from 'react';
import { X, HelpCircle, ArrowUp, ArrowDown } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400">
            <HelpCircle size={22} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Les 4 Jeux Top 14
          </h2>
        </div>

        {/* 4 Games summary */}
        <div className="space-y-3 mb-6">
          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-bold text-amber-600 dark:text-amber-400 text-sm block mb-1">🎯 1. Top14dle (Classique)</span>
            <span className="text-slate-700 dark:text-slate-300">
              Devine le joueur en comparant son club, poste, nationalité, âge, taille et poids. Les cases changent de couleur (Vert, Jaune, Gris, Flèches) à chaque essai.
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-bold text-amber-600 dark:text-amber-400 text-sm block mb-1">👤 2. Photo Flou</span>
            <span className="text-slate-700 dark:text-slate-300">
              La photo du joueur mystère se défloute à chaque tentative. Des indices (club, poste, nationalité) se débloquent au fil de tes 5 essais.
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-bold text-amber-600 dark:text-amber-400 text-sm block mb-1">⚖️ 3. Plus ou Moins</span>
            <span className="text-slate-700 dark:text-slate-300">
              Duel direct entre deux joueurs : devine si le second joueur est plus grand, plus lourd ou plus âgé pour enchaîner la plus longue série !
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-bold text-amber-600 dark:text-amber-400 text-sm block mb-1">🏉 4. Quiz Club</span>
            <span className="text-slate-700 dark:text-slate-300">
              4 joueurs d'un même effectif apparaissent à l'écran. Retrouve dans quel club du Top 14 ils évoluent ensemble !
            </span>
          </div>
        </div>

        {/* Legend for classic game */}
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Couleurs du mode Top14dle :</h3>
        <div className="space-y-3 text-xs">
          {/* Vert */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 border border-emerald-500 flex items-center justify-center text-white font-bold shrink-0">
              ✓
            </div>
            <div>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-0.5">Vert (Correct)</span>
              <span className="text-slate-600 dark:text-slate-300">L'attribut correspond exactement.</span>
            </div>
          </div>

          {/* Jaune */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500 border border-amber-400 flex items-center justify-center text-slate-950 font-bold shrink-0">
              ~
            </div>
            <div>
              <span className="font-bold text-amber-600 dark:text-amber-400 block mb-0.5">Jaune (Partiel / Proche)</span>
              <span className="text-slate-600 dark:text-slate-300">Même ligne / famille de poste, ou valeur proche (±2 ans, ±3 cm, ±4 kg).</span>
            </div>
          </div>

          {/* Flèches */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-start gap-3">
            <div className="flex gap-1 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold">
                <ArrowUp size={14} />
              </div>
              <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center text-amber-600 dark:text-amber-400 font-bold">
                <ArrowDown size={14} />
              </div>
            </div>
            <div>
              <span className="font-bold text-amber-600 dark:text-amber-400 block mb-0.5">Flèches (Âge, Taille, Poids)</span>
              <span className="text-slate-600 dark:text-slate-300">↑ La valeur du joueur mystère est supérieure. ↓ Elle est inférieure.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
