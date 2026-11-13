import { useState, useMemo, useEffect } from 'react';
import type { Player } from '../types/game';
import { PLAYERS } from '../data/players';
import { CLUBS } from '../data/clubs';
import { getAssetUrl } from '../utils/assets';
import { SearchBar } from './SearchBar';
import { ClubLogo } from './ClubLogo';
import { CountryFlag } from './CountryFlag';

// Strictement les joueurs actifs qui possèdent un vrai fichier photo valide
const PLAYERS_WITH_PHOTO = PLAYERS.filter((p) => typeof p.photoUrl === 'string' && p.photoUrl.length > 0);

function getDailyBlurPlayer(): Player {
  const d = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < d.length; i++) {
    hash = (hash << 5) - hash + d.charCodeAt(i);
    hash |= 0;
  }
  const idx = (Math.abs(hash) + 42) % PLAYERS_WITH_PHOTO.length;
  return PLAYERS_WITH_PHOTO[idx];
}

function getRandomBlurPlayer(excludeId?: string): Player {
  const pool = excludeId
    ? PLAYERS_WITH_PHOTO.filter((p) => p.id !== excludeId)
    : PLAYERS_WITH_PHOTO;
  return pool[Math.floor(Math.random() * pool.length)];
}

const MAX_ATTEMPTS = 5;

export function BlurGame() {
  const [subMode, setSubMode] = useState<'daily' | 'unlimited'>('daily');

  const dailyTarget = useMemo(() => getDailyBlurPlayer(), []);
  const [unlimitedTarget, setUnlimitedTarget] = useState<Player>(() => getRandomBlurPlayer());

  const currentTarget = subMode === 'daily' ? dailyTarget : unlimitedTarget;

  const [dailyGuesses, setDailyGuesses] = useState<Player[]>(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem(`top14_blur_daily_${today}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [unlimitedGuesses, setUnlimitedGuesses] = useState<Player[]>([]);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [currentTarget.id]);

  const guesses = subMode === 'daily' ? dailyGuesses : unlimitedGuesses;
  const isWon = guesses.some((p) => p.id === currentTarget.id);
  const isLost = !isWon && guesses.length >= MAX_ATTEMPTS;
  const isGameOver = isWon || isLost;

  // Calcul du flou en pixels selon le nombre d'essais
  const blurPixels = useMemo(() => {
    if (isGameOver) return 0;
    const levels = [24, 18, 12, 7, 3];
    return levels[Math.min(guesses.length, levels.length - 1)];
  }, [guesses.length, isGameOver]);

  const grayscalePercent = useMemo(() => {
    if (isGameOver) return 0;
    const levels = [80, 60, 40, 20, 0];
    return levels[Math.min(guesses.length, levels.length - 1)];
  }, [guesses.length, isGameOver]);

  const handleGuess = (player: Player) => {
    if (isGameOver) return;
    const updated = [player, ...guesses];
    if (subMode === 'daily') {
      setDailyGuesses(updated);
      try {
        const today = new Date().toISOString().slice(0, 10);
        localStorage.setItem(`top14_blur_daily_${today}`, JSON.stringify(updated));
      } catch {}
    } else {
      setUnlimitedGuesses(updated);
    }
  };

  const handleResetUnlimited = () => {
    setUnlimitedTarget(getRandomBlurPlayer(unlimitedTarget.id));
    setUnlimitedGuesses([]);
    setImageError(false);
  };

  const club = CLUBS[currentTarget.clubId];
  const photoSrc = getAssetUrl(currentTarget.photoUrl);

  return (
    <div className="max-w-xl mx-auto px-4 py-4 flex flex-col items-center">
      {/* Sélecteur Quotidien / Illimité */}
      <div className="flex items-center gap-2 mb-5 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full p-1 shadow-inner">
        <button
          onClick={() => setSubMode('daily')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            subMode === 'daily'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          📅 Quotidien
        </button>
        <button
          onClick={() => setSubMode('unlimited')}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            subMode === 'unlimited'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          ♾️ Illimité
        </button>
      </div>

      <div className="text-center mb-4">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
          👤 Qui est ce joueur ?
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          La photo devient de plus en plus nette à chaque essai. Tu as {MAX_ATTEMPTS} tentatives !
        </p>
      </div>

      {/* Cadre Photo Floutée */}
      <div className="relative w-56 h-72 sm:w-64 sm:h-80 rounded-2xl overflow-hidden border-2 border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-900 shadow-2xl flex items-center justify-center mb-5 group">
        {!imageError && photoSrc ? (
          <img
            src={photoSrc}
            alt="Joueur mystère"
            onError={() => setImageError(true)}
            style={{
              filter: `blur(${blurPixels}px) grayscale(${grayscalePercent}%)`,
              transition: 'filter 0.5s ease-out',
            }}
            className="w-full h-full object-cover scale-110 pointer-events-none select-none"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-4">
            <span className="text-6xl mb-2">🏉</span>
            <span className="text-xs font-bold text-center">Silhouette Mystère</span>
          </div>
        )}

        {/* Badge niveau de netteté */}
        <div className="absolute top-2.5 right-2.5 bg-white/95 dark:bg-slate-950/80 backdrop-blur-md border border-slate-200 dark:border-slate-700/80 text-amber-600 dark:text-amber-400 text-[11px] font-bold px-2.5 py-1 rounded-full shadow">
          {isGameOver ? 'Révélé' : `Essai ${guesses.length + 1} / ${MAX_ATTEMPTS}`}
        </div>

        {/* Overlay Victoire / Défaite */}
        {isGameOver && (
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent p-4 text-center">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase mb-1 ${
                isWon ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'
              }`}
            >
              {isWon ? '🎉 Trouvé !' : '❌ Perdu !'}
            </span>
            <h3 className="text-lg font-black text-white">{currentTarget.name}</h3>
            <p className="text-xs text-slate-300">
              {club?.name} • {currentTarget.position}
            </p>
          </div>
        )}
      </div>

      {/* Indices Débloqués */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {/* Indice 1: Club */}
        <div
          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
            guesses.length >= 1 || isGameOver
              ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm'
              : 'bg-slate-100/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 opacity-50'
          }`}
        >
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Club</span>
          {guesses.length >= 1 || isGameOver ? (
            <div className="flex items-center gap-1.5">
              <ClubLogo club={club} size="xs" />
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200">{club?.shortName || currentTarget.clubId}</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 dark:text-slate-600 font-bold">🔒 1 essai</span>
          )}
        </div>

        {/* Indice 2: Poste */}
        <div
          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
            guesses.length >= 2 || isGameOver
              ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm'
              : 'bg-slate-100/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 opacity-50'
          }`}
        >
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Poste</span>
          {guesses.length >= 2 || isGameOver ? (
            <span className="text-xs font-bold text-slate-900 dark:text-slate-200 leading-tight">{currentTarget.position}</span>
          ) : (
            <span className="text-xs text-slate-400 dark:text-slate-600 font-bold">🔒 2 essais</span>
          )}
        </div>

        {/* Indice 3: Nationalité */}
        <div
          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
            guesses.length >= 3 || isGameOver
              ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm'
              : 'bg-slate-100/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 opacity-50'
          }`}
        >
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Pays</span>
          {guesses.length >= 3 || isGameOver ? (
            <div className="flex items-center gap-1.5">
              <CountryFlag nationality={currentTarget.nationality} size="sm" />
              <span className="text-xs font-bold text-slate-900 dark:text-slate-200 truncate">{currentTarget.nationality}</span>
            </div>
          ) : (
            <span className="text-xs text-slate-400 dark:text-slate-600 font-bold">🔒 3 essais</span>
          )}
        </div>

        {/* Indice 4: Gabarit & Âge */}
        <div
          className={`p-2.5 rounded-xl border flex flex-col items-center justify-center text-center transition-all ${
            guesses.length >= 4 || isGameOver
              ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-sm'
              : 'bg-slate-100/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 opacity-50'
          }`}
        >
          <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold mb-1">Physique</span>
          {guesses.length >= 4 || isGameOver ? (
            <span className="text-xs font-bold text-slate-900 dark:text-slate-200">
              {currentTarget.age} ans • {currentTarget.height}cm
            </span>
          ) : (
            <span className="text-xs text-slate-400 dark:text-slate-600 font-bold">🔒 4 essais</span>
          )}
        </div>
      </div>

      {/* Barre de recherche */}
      {!isGameOver ? (
        <div className="w-full mb-4">
          <SearchBar
            onSelectPlayer={handleGuess}
            guessedPlayerIds={guesses.map((p) => p.id)}
            disabled={isGameOver}
          />
        </div>
      ) : (
        <div className="w-full flex justify-center mb-6">
          {subMode === 'unlimited' ? (
            <button
              onClick={handleResetUnlimited}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg transition-all active:scale-95"
            >
              🔄 Jouer avec un autre joueur
            </button>
          ) : (
            <div className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center text-xs text-slate-600 dark:text-slate-400 shadow-sm">
              Rendez-vous demain pour un nouveau joueur en mode Quotidien !
              <button
                onClick={() => {
                  setSubMode('unlimited');
                  handleResetUnlimited();
                }}
                className="block mx-auto mt-2 text-amber-600 dark:text-amber-400 font-bold underline hover:text-amber-500"
              >
                Jouer en illimité maintenant →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Liste des tentatives passées */}
      {guesses.length > 0 && (
        <div className="w-full space-y-1.5">
          <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Tes propositions ({guesses.length}/{MAX_ATTEMPTS}) :
          </div>
          {guesses.map((p, idx) => {
            const correct = p.id === currentTarget.id;
            const itemPhoto = getAssetUrl(p.photoUrl);
            return (
              <div
                key={idx}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  correct
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-emerald-200'
                    : 'bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-xs font-black w-4 text-slate-400 dark:text-slate-500">{guesses.length - idx}</span>
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-800 flex-shrink-0">
                    {itemPhoto ? (
                      <img
                        src={itemPhoto}
                        alt={p.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-slate-500">
                        {p.name[0]}
                      </div>
                    )}
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-sm block truncate">{p.name}</span>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400">
                      {CLUBS[p.clubId]?.shortName || p.clubId} • {p.position}
                    </span>
                  </div>
                </div>
                <span className="text-base flex-shrink-0">{correct ? '✅' : '❌'}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
