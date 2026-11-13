import React from 'react';
import { X, HelpCircle, ArrowUp, ArrowDown } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-left max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-2.5 mb-4">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <HelpCircle size={22} />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Comment jouer ?
          </h2>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          Devine le joueur mystère du <strong>Top 14</strong>. À chaque proposition, les cases
          changent de couleur pour te guider vers la bonne réponse.
        </p>

        {/* Legend */}
        <div className="space-y-4 text-xs sm:text-sm">
          {/* Vert */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 border border-emerald-400 flex items-center justify-center text-white font-bold text-base shrink-0">
              ✓
            </div>
            <div>
              <span className="font-bold text-emerald-400 block mb-0.5">Vert (Correct)</span>
              <span className="text-slate-300">
                L'attribut correspond <strong>exactement</strong> à celui du joueur mystère.
              </span>
            </div>
          </div>

          {/* Jaune */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-600 border border-amber-400 flex items-center justify-center text-white font-bold text-base shrink-0">
              ~
            </div>
            <div>
              <span className="font-bold text-amber-400 block mb-0.5">Jaune (Partiel / Proche)</span>
              <span className="text-slate-300">
                • <strong>Poste :</strong> même ligne (ex: <em>Charnière</em>, <em>3e ligne</em>) ou même grande famille (<em>Avants</em> / <em>Arrières</em>).<br />
                • <strong>Âge / Taille / Poids :</strong> valeur très proche (±2 ans, ±3 cm, ±4 kg).
              </span>
            </div>
          </div>

          {/* Rouge */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 font-bold text-base shrink-0">
              ✗
            </div>
            <div>
              <span className="font-bold text-slate-400 block mb-0.5">Gris / Rouge (Erreur)</span>
              <span className="text-slate-300">
                Aucune correspondance pour cet attribut.
              </span>
            </div>
          </div>

          {/* Flèches */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3">
            <div className="flex gap-1 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold">
                <ArrowUp size={16} />
              </div>
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400 font-bold">
                <ArrowDown size={16} />
              </div>
            </div>
            <div>
              <span className="font-bold text-amber-400 block mb-0.5">Flèches (Âge, Taille, Poids)</span>
              <span className="text-slate-300">
                • <strong>↑ Flèche vers le haut :</strong> La valeur du joueur mystère est <strong>supérieure</strong>.<br />
                • <strong>↓ Flèche vers le bas :</strong> La valeur du joueur mystère est <strong>inférieure</strong>.
              </span>
            </div>
          </div>
        </div>

        {/* Indices */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-slate-300">
          <span className="font-bold text-amber-400 block mb-1">💡 Indices progressifs</span>
          Si tu es bloqué, des indices se débloquent automatiquement au bout de <strong>3, 6 et 8 essais</strong> !
        </div>
      </div>
    </div>
  );
};
