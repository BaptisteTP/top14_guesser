import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Share2, Check, RotateCw, Flame, Trophy, X } from 'lucide-react';
import type { Player, GuessResult, GameMode } from '../types/game';
import { CLUBS } from '../data/clubs';
import { generateShareText } from '../utils/gameLogic';
import { PlayerAvatar } from './PlayerAvatar';
import { ClubLogo } from './ClubLogo';
import { CountryFlag } from './CountryFlag';

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

  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#ffffff'],
        });
      } catch (e) {
        console.error('Confetti error', e);
      }
    }
  }, [isOpen]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X size={20} />
        </button>

        {/* Victory Header */}
        <div className="inline-flex p-3 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 mb-3">
          <Trophy size={36} className="animate-bounce" />
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          ESSAI TRANSFORMÉ ! 🏉
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 font-medium">
          Tu as trouvé le joueur mystère en{' '}
          <strong className="text-amber-600 dark:text-amber-400 font-bold">
            {guesses.length} essai{guesses.length > 1 ? 's' : ''}
          </strong>{' '}
          !
        </p>

        {/* Player Spotlight Card */}
        <div className="my-5 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800/80 flex items-center gap-4 text-left shadow-inner">
          <PlayerAvatar player={targetPlayer} size="xl" className="shrink-0" />
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-black text-slate-900 dark:text-white truncate">
              {targetPlayer.name}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-600 dark:text-slate-400">
              <ClubLogo club={club} size="xs" />
              <span className="font-semibold">{club?.name}</span>
            </div>
            <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <CountryFlag
                  nationality={targetPlayer.nationality}
                  fallbackEmoji={targetPlayer.flag}
                  size="sm"
                />
                <span className="font-medium">{targetPlayer.nationality}</span>
              </span>
              <span>•</span>
              <span className="font-medium">{targetPlayer.position}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 dark:text-slate-500">
              <span>{targetPlayer.age} ans</span>
              <span>•</span>
              <span>{targetPlayer.height} cm</span>
              <span>•</span>
              <span>{targetPlayer.weight} kg</span>
            </div>
          </div>
        </div>

        {/* Mini stats preview */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2">
            <Flame className="text-amber-500" size={18} />
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-slate-500">Essais</div>
              <div className="text-base font-black text-slate-900 dark:text-white">{guesses.length}</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2">
            <Trophy className="text-emerald-500" size={18} />
            <div className="text-left">
              <div className="text-[10px] uppercase font-bold text-slate-500">Mode</div>
              <div className="text-base font-black text-slate-900 dark:text-white capitalize">{mode}</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5">
          <button
            onClick={handleShare}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg transition-all active:scale-98 flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check size={18} />
                <span>Copié dans le presse-papier !</span>
              </>
            ) : (
              <>
                <Share2 size={18} />
                <span>Partager mon résultat</span>
              </>
            )}
          </button>

          {mode === 'daily' ? (
            <div className="pt-2">
              <button
                onClick={onPlayUnlimited}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
              >
                <span>Rejouer en mode Illimité</span>
                <span>→</span>
              </button>
              {timeUntilNext && (
                <p className="text-[11px] text-slate-500 dark:text-slate-500 mt-2 font-medium">
                  Prochain joueur quotidien dans :{' '}
                  <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{timeUntilNext}</span>
                </p>
              )}
            </div>
          ) : (
            <button
              onClick={onResetUnlimited}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
            >
              <RotateCw size={14} />
              <span>Joueur suivant</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
