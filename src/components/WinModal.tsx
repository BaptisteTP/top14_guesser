import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Share2, Check, RotateCw, Flame, Trophy, X } from 'lucide-react';
import type { Player, GuessResult, GameMode } from '../types/game';
import { CLUBS } from '../data/clubs';
import { generateShareText } from '../utils/gameLogic';

interface WinModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPlayer: Player;
  guesses: GuessResult[];
  mode: GameMode;
  onPlayUnlimited: () => void;
  onResetUnlimited: () => void;
}

export const WinModal: React.FC<WinModalProps> = ({
  isOpen,
  onClose,
  targetPlayer,
  guesses,
  mode,
  onPlayUnlimited,
  onResetUnlimited,
}) => {
  const [copied, setCopied] = useState(false);
  const [timeUntilNext, setTimeUntilNext] = useState('');

  // Déclencher les confettis à l'ouverture
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#ffffff'],
        });
      } catch (e) {
        console.error('Confetti error', e);
      }
    }
  }, [isOpen]);

  // Compte à rebours jusqu'à minuit pour le mode quotidien
  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = tomorrow.getTime() - now.getTime();

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      const pad = (n: number) => n.toString().padStart(2, '0');
      setTimeUntilNext(`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isOpen) return null;

  const club = CLUBS[targetPlayer.clubId];

  const handleShare = () => {
    const text = generateShareText(guesses, targetPlayer, mode === 'daily');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Victory Header */}
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3">
          <Trophy size={36} className="animate-bounce" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          ESSAI TRANSFORMÉ ! 🏉
        </h2>
        <p className="text-sm text-slate-300 mt-1 font-medium">
          Tu as trouvé le joueur mystère en{' '}
          <span className="text-amber-400 font-bold text-base">{guesses.length}</span>{' '}
          essai{guesses.length > 1 ? 's' : ''}.
        </p>

        {/* Player Spotlight Card */}
        <div className="my-6 p-5 rounded-2xl bg-slate-950/80 border border-slate-800 text-left relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-15 pointer-events-none"
            style={{ backgroundColor: club?.colors.primary || '#f59e0b' }}
          />

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-3xl shadow-inner">
              {club?.logo || '🏉'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl sm:text-2xl font-black text-white">
                  {targetPlayer.name}
                </span>
                <span className="text-lg">{targetPlayer.flag}</span>
              </div>
              <div className="text-xs sm:text-sm text-slate-400 flex items-center gap-2 mt-0.5">
                <span className="font-semibold text-slate-200">{club?.name}</span>
                <span>•</span>
                <span className="text-amber-400 font-medium">{targetPlayer.position}</span>
              </div>
            </div>
          </div>

          {/* Player Quick Stats Grid */}
          <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-center">
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Âge</span>
              <span className="text-xs sm:text-sm font-bold text-white">{targetPlayer.age} ans</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Taille</span>
              <span className="text-xs sm:text-sm font-bold text-white">{targetPlayer.height} cm</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Poids</span>
              <span className="text-xs sm:text-sm font-bold text-white">{targetPlayer.weight} kg</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/60">
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">Sélec.</span>
              <span className="text-xs sm:text-sm font-bold text-amber-400">
                {targetPlayer.isInternational ? targetPlayer.caps || 'Oui' : 'Non'}
              </span>
            </div>
          </div>

          {/* Anecdote */}
          {targetPlayer.funFact && (
            <p className="mt-3 text-xs text-slate-300 italic bg-amber-500/5 p-2.5 rounded-xl border border-amber-500/20">
              💡 {targetPlayer.funFact}
            </p>
          )}
        </div>

        {/* Share Button */}
        <div className="space-y-3">
          <button
            onClick={handleShare}
            className={`w-full py-3.5 px-6 rounded-2xl font-bold flex items-center justify-center gap-2.5 shadow-lg transition-all ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:scale-[1.02] active:scale-[0.98]'
            }`}
          >
            {copied ? (
              <>
                <Check size={18} />
                <span>Copié dans le presse-papiers !</span>
              </>
            ) : (
              <>
                <Share2 size={18} />
                <span>Partager le résultat</span>
              </>
            )}
          </button>

          {/* Action according to mode */}
          {mode === 'daily' ? (
            <div className="pt-2">
              <div className="text-xs text-slate-400 mb-3">
                Prochain joueur du jour dans :{' '}
                <span className="font-mono font-bold text-white">{timeUntilNext}</span>
              </div>
              <button
                onClick={onPlayUnlimited}
                className="w-full py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2"
              >
                <Flame size={16} className="text-amber-400" />
                <span>Continuer en mode Entraînement</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onResetUnlimited}
              className="w-full py-3 px-5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <RotateCw size={16} className="text-amber-400" />
              <span>Nouveau joueur mystère</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
