import { useState } from 'react';
import type { Player } from '../types/game';
import { PLAYERS } from '../data/players';
import { CLUBS } from '../data/clubs';
import { ClubLogo } from './ClubLogo';
import { CountryFlag } from './CountryFlag';

type MetricType = 'height' | 'weight' | 'age';

interface MetricConfig {
  key: MetricType;
  label: string;
  unit: string;
  higherText: string;
  lowerText: string;
}

const METRICS: MetricConfig[] = [
  { key: 'height', label: 'Taille', unit: 'cm', higherText: '🔼 Plus grand', lowerText: '🔽 Plus petit' },
  { key: 'weight', label: 'Poids', unit: 'kg', higherText: '🔼 Plus lourd', lowerText: '🔽 Plus léger' },
  { key: 'age', label: 'Âge', unit: 'ans', higherText: '🔼 Plus âgé', lowerText: '🔽 Plus jeune' },
];

function getRandomPlayerForHL(excludeId?: string): Player {
  const pool = excludeId ? PLAYERS.filter((p) => p.id !== excludeId) : PLAYERS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function HigherLowerGame() {
  const [metricIndex, setMetricIndex] = useState<number>(0);
  const currentMetric = METRICS[metricIndex];

  const [playerA, setPlayerA] = useState<Player>(() => getRandomPlayerForHL());
  const [playerB, setPlayerB] = useState<Player>(() => getRandomPlayerForHL(playerA.id));

  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('top14_hl_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });

  const [revealed, setRevealed] = useState<boolean>(false);
  const [lastResult, setLastResult] = useState<'correct' | 'wrong' | null>(null);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const valA = playerA[currentMetric.key];
  const valB = playerB[currentMetric.key];

  const handleChoice = (choice: 'higher' | 'lower') => {
    if (revealed || isGameOver) return;

    setRevealed(true);

    const isCorrect =
      valA === valB ||
      (choice === 'higher' && valB > valA) ||
      (choice === 'lower' && valB < valA);

    if (isCorrect) {
      setLastResult('correct');
      const newScore = score + 1;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        try {
          localStorage.setItem('top14_hl_highscore', newScore.toString());
        } catch {}
      }

      // Passer au tour suivant après 1.2s
      setTimeout(() => {
        setPlayerA(playerB);
        setPlayerB(getRandomPlayerForHL(playerB.id));
        setRevealed(false);
        setLastResult(null);
        // Changer de métrique aléatoirement
        setMetricIndex((prev) => (prev + 1) % METRICS.length);
      }, 1200);
    } else {
      setLastResult('wrong');
      setTimeout(() => {
        setIsGameOver(true);
      }, 1200);
    }
  };

  const handleRestart = () => {
    const newA = getRandomPlayerForHL();
    const newB = getRandomPlayerForHL(newA.id);
    setPlayerA(newA);
    setPlayerB(newB);
    setScore(0);
    setRevealed(false);
    setLastResult(null);
    setIsGameOver(false);
  };

  const clubA = CLUBS[playerA.clubId];
  const clubB = CLUBS[playerB.clubId];

  return (
    <div className="max-w-3xl mx-auto px-4 py-4 flex flex-col items-center">
      {/* En-tête Scores */}
      <div className="w-full flex items-center justify-between mb-4 bg-slate-900/80 border border-slate-800 rounded-2xl p-3 px-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-slate-400">🔥 Série en cours :</span>
          <span className="text-xl font-black text-amber-400">{score}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-slate-400">🏆 Record :</span>
          <span className="text-xl font-black text-emerald-400">{highScore}</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-100 uppercase tracking-wide">
          ⚖️ Plus ou Moins Top 14
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Compare les stats de ces deux joueurs en duel direct !
        </p>
      </div>

      {/* Duel Cartes */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 relative">
        {/* Joueur A (Référence) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800 mb-3 shadow-md">
            {playerA.photoUrl ? (
              <img src={playerA.photoUrl} alt={playerA.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-black text-slate-500">
                {playerA.name[0]}
              </div>
            )}
          </div>

          <h3 className="text-lg font-black text-white">{playerA.name}</h3>

          <div className="flex items-center gap-2 my-1">
            <ClubLogo club={clubA} size="xs" />
            <span className="text-xs text-slate-300 font-semibold">{clubA?.name}</span>
            <CountryFlag nationality={playerA.nationality} size="sm" />
          </div>

          <span className="text-[11px] text-slate-400 font-medium mb-3">{playerA.position}</span>

          <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 px-4 mt-auto">
            <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-bold mb-0.5">
              {currentMetric.label}
            </span>
            <span className="text-3xl font-black text-amber-400 tracking-tight">
              {valA} <span className="text-sm font-semibold text-slate-400">{currentMetric.unit}</span>
            </span>
          </div>
        </div>

        {/* Badge VS central */}
        <div className="hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-slate-950 border-2 border-amber-500/80 items-center justify-center text-xs font-black text-amber-400 shadow-xl">
          VS
        </div>

        {/* Joueur B (Défi) */}
        <div
          className={`bg-slate-900/90 border rounded-2xl p-5 flex flex-col items-center text-center shadow-xl relative overflow-hidden transition-all ${
            lastResult === 'correct'
              ? 'border-emerald-500 bg-emerald-950/20'
              : lastResult === 'wrong'
              ? 'border-red-500 bg-red-950/20'
              : 'border-slate-800'
          }`}
        >
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-slate-700 bg-slate-800 mb-3 shadow-md">
            {playerB.photoUrl ? (
              <img src={playerB.photoUrl} alt={playerB.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl font-black text-slate-500">
                {playerB.name[0]}
              </div>
            )}
          </div>

          <h3 className="text-lg font-black text-white">{playerB.name}</h3>

          <div className="flex items-center gap-2 my-1">
            <ClubLogo club={clubB} size="xs" />
            <span className="text-xs text-slate-300 font-semibold">{clubB?.name}</span>
            <CountryFlag nationality={playerB.nationality} size="sm" />
          </div>

          <span className="text-[11px] text-slate-400 font-medium mb-3">{playerB.position}</span>

          {/* Zone de devinette ou résultat */}
          {!revealed ? (
            <div className="w-full flex flex-col gap-2 mt-auto">
              <span className="text-xs font-bold text-slate-300">
                Est-ce que {playerB.name.split(' ')[0]} a une {currentMetric.label.toLowerCase()} :
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleChoice('higher')}
                  className="py-2.5 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  {currentMetric.higherText}
                </button>
                <button
                  onClick={() => handleChoice('lower')}
                  className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 font-black text-xs uppercase tracking-wider border border-slate-700 shadow-md transition-all"
                >
                  {currentMetric.lowerText}
                </button>
              </div>
            </div>
          ) : (
            <div className="w-full bg-slate-950/80 border border-slate-800 rounded-xl py-3 px-4 mt-auto">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 block font-bold mb-0.5">
                {currentMetric.label}
              </span>
              <span
                className={`text-3xl font-black tracking-tight ${
                  lastResult === 'correct' ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {valB} <span className="text-sm font-semibold text-slate-400">{currentMetric.unit}</span>
              </span>
              <span className="block text-xs font-black uppercase mt-1">
                {lastResult === 'correct' ? '✅ Bien vu !' : '❌ Raté !'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Modal Game Over */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl animate-fade-in">
            <span className="text-4xl block mb-2">💥</span>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight">Fin de série !</h3>
            <p className="text-sm text-slate-400 mt-1">
              Tu as enchaîné une série de <strong className="text-amber-400">{score}</strong> bonne(s) réponse(s).
            </p>

            <div className="my-5 p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex justify-around">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Score final</span>
                <span className="text-2xl font-black text-amber-400">{score}</span>
              </div>
              <div className="w-px bg-slate-800" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Record</span>
                <span className="text-2xl font-black text-emerald-400">{highScore}</span>
              </div>
            </div>

            <button
              onClick={handleRestart}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm uppercase tracking-wider shadow-lg transition-all active:scale-95"
            >
              🔄 Rejouer une partie
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
