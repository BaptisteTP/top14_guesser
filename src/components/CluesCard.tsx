import React, { useState } from 'react';
import { Lightbulb, X, Lock, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import type { Player } from '../types/game';
import { CLUBS } from '../data/clubs';
import { ClubLogo } from './ClubLogo';
import { CountryFlag } from './CountryFlag';

interface CluesCardProps {
  targetPlayer: Player;
  guessesCount: number;
  hasWon: boolean;
  isSingleClubFiltered?: boolean;
}

export const CluesCard: React.FC<CluesCardProps> = ({
  targetPlayer,
  guessesCount,
  hasWon,
  isSingleClubFiltered = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const club = CLUBS[targetPlayer.clubId];

  // Paliers de déblocage des 5 indices
  const clueSteps = [
    {
      id: 'club',
      title: '1. Club actuel',
      icon: '🏉',
      threshold: 3,
      isUnlocked: guessesCount >= 3 || hasWon,
    },
    {
      id: 'position',
      title: '2. Poste précis',
      icon: '📍',
      threshold: 5,
      isUnlocked: guessesCount >= 5 || hasWon,
    },
    {
      id: 'nationality',
      title: '3. Nationalité & Sélections',
      icon: '🌍',
      threshold: 7,
      isUnlocked: guessesCount >= 7 || hasWon,
    },
    {
      id: 'body',
      title: '4. Gabarit & Âge',
      icon: '⚖️',
      threshold: 9,
      isUnlocked: guessesCount >= 9 || hasWon,
    },
    {
      id: 'career',
      title: '5. Parcours & Détail',
      icon: 'ℹ️',
      threshold: 11,
      isUnlocked: guessesCount >= 11 || hasWon,
    },
  ];

  const unlockedCount = clueSteps.filter((c) => c.isUnlocked).length;
  const nextClue = clueSteps.find((c) => !c.isUnlocked);
  const remainingForNext = nextClue ? Math.max(0, nextClue.threshold - guessesCount) : 0;

  // Hauteur formatée en mètres (ex: 1m86)
  const formattedHeight = `${Math.floor(targetPlayer.height / 100)}m${(targetPlayer.height % 100)
    .toString()
    .padStart(2, '0')}`;

  // Initiales ou prénom / nom
  const nameParts = targetPlayer.name.trim().split(' ');
  const lastNameInitial = nameParts.length > 1 ? nameParts[nameParts.length - 1][0] : targetPlayer.name[0];

  return (
    <div className="w-full max-w-lg mx-auto my-3 px-4 text-center">
      {/* Bouton d'accès aux indices */}
      <div className="inline-flex items-center gap-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold transition-all shadow-sm active:scale-95 ${
            unlockedCount > 0
              ? 'bg-amber-500/15 border-amber-500/30 text-amber-800 dark:text-amber-400 hover:bg-amber-500/25'
              : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Lightbulb size={15} className={unlockedCount > 0 ? 'text-amber-500 fill-amber-500' : 'text-slate-400'} />
          <span>
            {unlockedCount > 0
              ? `${unlockedCount}/5 indice${unlockedCount > 1 ? 's' : ''} débloqué${unlockedCount > 1 ? 's' : ''}`
              : `Indices (1er au 3e essai)`}
          </span>
          {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        {!isOpen && nextClue && guessesCount > 0 && !hasWon && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:inline">
            • {nextClue.title.replace(/^\d+\.\s*/, '')} dans{' '}
            <strong className="text-amber-600 dark:text-amber-400">{remainingForNext}</strong> essai{remainingForNext > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Carte dépliée des indices */}
      {isOpen && (
        <div className="relative mt-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left shadow-xl text-xs space-y-3 animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-sm">
              <Lightbulb size={16} className="text-amber-500 fill-amber-500" />
              <span>Indices progressifs Top 14</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-slate-800 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title="Fermer"
            >
              <X size={15} />
            </button>
          </div>

          <div className="space-y-2.5">
            {/* 1. Indice Club */}
            <div className={`p-3 rounded-xl border transition-all ${
              clueSteps[0].isUnlocked
                ? 'bg-amber-50/60 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50'
                : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60'
            }`}>
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-200 mb-1">
                <span className="flex items-center gap-1.5">
                  <span>🏉</span>
                  <span>1. Club actuel</span>
                </span>
                {clueSteps[0].isUnlocked ? (
                  <span className="text-[10px] uppercase tracking-wider font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Débloqué
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Lock size={12} /> Au 3e essai
                  </span>
                )}
              </div>

              {clueSteps[0].isUnlocked ? (
                <div className="flex items-center gap-2.5 mt-2">
                  <ClubLogo club={club} size="sm" />
                  <div>
                    <span className="font-black text-sm text-slate-900 dark:text-white block">
                      {club?.name || targetPlayer.clubId}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      {club?.city} • {club?.stadium}
                      {isSingleClubFiltered && ' (Club déjà sélectionné)'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  Fais encore {Math.max(1, 3 - guessesCount)} essai{Math.max(1, 3 - guessesCount) > 1 ? 's' : ''} pour révéler le club officiel du joueur.
                </p>
              )}
            </div>

            {/* 2. Indice Poste Précis */}
            <div className={`p-3 rounded-xl border transition-all ${
              clueSteps[1].isUnlocked
                ? 'bg-blue-50/60 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50'
                : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60'
            }`}>
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-200 mb-1">
                <span className="flex items-center gap-1.5">
                  <span>📍</span>
                  <span>2. Poste précis</span>
                </span>
                {clueSteps[1].isUnlocked ? (
                  <span className="text-[10px] uppercase tracking-wider font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Débloqué
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Lock size={12} /> Au 5e essai
                  </span>
                )}
              </div>

              {clueSteps[1].isUnlocked ? (
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-blue-500 text-white font-black text-xs shadow-sm">
                      {targetPlayer.position}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[11px]">
                      {targetPlayer.line}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[11px]">
                      {targetPlayer.category}
                    </span>
                    {targetPlayer.jerseyNumber && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold text-[11px]">
                        N°{targetPlayer.jerseyNumber}
                      </span>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  Fais encore {Math.max(1, 5 - guessesCount)} essai{Math.max(1, 5 - guessesCount) > 1 ? 's' : ''} pour débloquer le poste exact sur le terrain.
                </p>
              )}
            </div>

            {/* 3. Indice Nationalité */}
            <div className={`p-3 rounded-xl border transition-all ${
              clueSteps[2].isUnlocked
                ? 'bg-emerald-50/60 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/50'
                : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60'
            }`}>
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-200 mb-1">
                <span className="flex items-center gap-1.5">
                  <span>🌍</span>
                  <span>3. Nationalité & Sélections</span>
                </span>
                {clueSteps[2].isUnlocked ? (
                  <span className="text-[10px] uppercase tracking-wider font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Débloqué
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Lock size={12} /> Au 7e essai
                  </span>
                )}
              </div>

              {clueSteps[2].isUnlocked ? (
                <div className="flex items-center gap-3 mt-2">
                  <CountryFlag nationality={targetPlayer.nationality} size="lg" />
                  <div>
                    <span className="font-black text-sm text-slate-900 dark:text-white block">
                      {targetPlayer.nationality} {targetPlayer.flag}
                    </span>
                    <span className="text-[11px] text-slate-600 dark:text-slate-400">
                      {targetPlayer.isInternational
                        ? `🏉 International (${targetPlayer.caps ? `${targetPlayer.caps} sélections` : 'Sélectionné en équipe nationale'})`
                        : '❌ Non capé en équipe nationale'}
                    </span>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  Fais encore {Math.max(1, 7 - guessesCount)} essai{Math.max(1, 7 - guessesCount) > 1 ? 's' : ''} pour connaître son pays et ses sélections.
                </p>
              )}
            </div>

            {/* 4. Indice Gabarit & Âge */}
            <div className={`p-3 rounded-xl border transition-all ${
              clueSteps[3].isUnlocked
                ? 'bg-purple-50/60 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/50'
                : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60'
            }`}>
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-200 mb-1">
                <span className="flex items-center gap-1.5">
                  <span>⚖️</span>
                  <span>4. Gabarit & Âge</span>
                </span>
                {clueSteps[3].isUnlocked ? (
                  <span className="text-[10px] uppercase tracking-wider font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Débloqué
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Lock size={12} /> Au 9e essai
                  </span>
                )}
              </div>

              {clueSteps[3].isUnlocked ? (
                <div className="grid grid-cols-3 gap-2 mt-2 text-center">
                  <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800 border border-purple-200 dark:border-purple-900/40">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Âge</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{targetPlayer.age} ans</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800 border border-purple-200 dark:border-purple-900/40">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Taille</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{formattedHeight}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-white/80 dark:bg-slate-800 border border-purple-200 dark:border-purple-900/40">
                    <span className="text-[10px] text-slate-500 block uppercase font-bold">Poids</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{targetPlayer.weight} kg</span>
                  </div>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  Fais encore {Math.max(1, 9 - guessesCount)} essai{Math.max(1, 9 - guessesCount) > 1 ? 's' : ''} pour débloquer sa taille, son poids et son âge exacts.
                </p>
              )}
            </div>

            {/* 5. Indice Parcours & Initiale */}
            <div className={`p-3 rounded-xl border transition-all ${
              clueSteps[4].isUnlocked
                ? 'bg-rose-50/60 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/50'
                : 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800 opacity-60'
            }`}>
              <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-200 mb-1">
                <span className="flex items-center gap-1.5">
                  <span>ℹ️</span>
                  <span>5. Parcours & Détail</span>
                </span>
                {clueSteps[4].isUnlocked ? (
                  <span className="text-[10px] uppercase tracking-wider font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 size={12} /> Débloqué
                  </span>
                ) : (
                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Lock size={12} /> Au 11e essai
                  </span>
                )}
              </div>

              {clueSteps[4].isUnlocked ? (
                <div className="mt-2 space-y-1 text-slate-800 dark:text-slate-200">
                  {targetPlayer.formerClub && (
                    <p className="text-xs">
                      <strong className="text-slate-900 dark:text-white">Ancien club / Origine :</strong> {targetPlayer.formerClub}
                    </p>
                  )}
                  {targetPlayer.funFact && (
                    <p className="text-xs">
                      <strong className="text-slate-900 dark:text-white">Anecdote :</strong> {targetPlayer.funFact}
                    </p>
                  )}
                  <p className="text-xs">
                    <strong className="text-slate-900 dark:text-white">Initiale du nom :</strong> Nom de famille commençant par <span className="font-black text-rose-600 dark:text-rose-400 text-sm font-mono">« {lastNameInitial} »</span>
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                  Fais encore {Math.max(1, 11 - guessesCount)} essai{Math.max(1, 11 - guessesCount) > 1 ? 's' : ''} pour débloquer l'initiale de son nom et son parcours.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
