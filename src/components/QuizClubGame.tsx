import { useState } from 'react';
import type { Player, Club } from '../types/game';
import { PLAYERS } from '../data/players';
import { CLUBS } from '../data/clubs';
import { ClubLogo } from './ClubLogo';

const CLUB_IDS = Object.keys(CLUBS);

interface QuizRound {
  targetClub: Club;
  samplePlayers: Player[];
  options: Club[];
}

function generateRound(): QuizRound {
  const targetId = CLUB_IDS[Math.floor(Math.random() * CLUB_IDS.length)];
  const targetClub = CLUBS[targetId];

  const clubPlayers = PLAYERS.filter((p) => p.clubId === targetId);

  const shuffledPlayers = [...clubPlayers].sort(() => 0.5 - Math.random());
  const samplePlayers = shuffledPlayers.slice(0, 4);

  const otherClubIds = CLUB_IDS.filter((id) => id !== targetId).sort(() => 0.5 - Math.random()).slice(0, 3);
  const options = [targetClub, ...otherClubIds.map((id) => CLUBS[id])].sort(() => 0.5 - Math.random());

  return { targetClub, samplePlayers, options };
}

export function QuizClubGame() {
  const [round, setRound] = useState<QuizRound>(() => generateRound());
  const [selectedClubId, setSelectedClubId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(() => {
    try {
      return parseInt(localStorage.getItem('top14_quiz_highscore') || '0', 10);
    } catch {
      return 0;
    }
  });
  const [isGameOver, setIsGameOver] = useState<boolean>(false);

  const handleSelectClub = (clubId: string) => {
    if (selectedClubId !== null || isGameOver) return;
    setSelectedClubId(clubId);

    const isCorrect = clubId === round.targetClub.id;

    if (isCorrect) {
      const nextScore = score + 1;
      setScore(nextScore);
      if (nextScore > highScore) {
        setHighScore(nextScore);
        try {
          localStorage.setItem('top14_quiz_highscore', nextScore.toString());
        } catch {}
      }

      setTimeout(() => {
        setRound(generateRound());
        setSelectedClubId(null);
      }, 1000);
    } else {
      setTimeout(() => {
        setIsGameOver(true);
      }, 1200);
    }
  };

  const handleRestart = () => {
    setRound(generateRound());
    setSelectedClubId(null);
    setScore(0);
    setIsGameOver(false);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 flex flex-col items-center">
      {/* Barre de Score */}
      <div className="w-full flex items-center justify-between mb-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 px-5 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">🔥 Série :</span>
          <span className="text-xl font-black text-amber-500">{score}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-bold text-slate-500 dark:text-slate-400">🏆 Record :</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400">{highScore}</span>
        </div>
      </div>

      <div className="text-center mb-5">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-wide">
          🏉 Devine le Club
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Dans quel club de Top 14 évoluent ces 4 joueurs ?
        </p>
      </div>

      {/* Cartes des 4 Joueurs */}
      <div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 mb-6">
        {round.samplePlayers.map((player) => (
          <div
            key={player.id}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 flex flex-col items-center text-center shadow-sm hover:border-slate-300 dark:hover:border-slate-700 transition-all"
          >
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 mb-2">
              {player.photoUrl ? (
                <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-lg font-black text-slate-400">
                  {player.name[0]}
                </div>
              )}
            </div>
            <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight line-clamp-1">{player.name}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 line-clamp-1">{player.position}</span>
          </div>
        ))}
      </div>

      {/* Choix des 4 Clubs */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {round.options.map((club) => {
          const isSelected = selectedClubId === club.id;
          const isTarget = club.id === round.targetClub.id;

          let btnClass = 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm';
          if (selectedClubId !== null) {
            if (isTarget) {
              btnClass = 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-500 text-emerald-900 dark:text-emerald-200 shadow-emerald-500/20';
            } else if (isSelected) {
              btnClass = 'bg-red-50 dark:bg-red-950/80 border-red-500 text-red-900 dark:text-red-200 shadow-red-500/20';
            } else {
              btnClass = 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-900 text-slate-400 opacity-40';
            }
          }

          return (
            <button
              key={club.id}
              onClick={() => handleSelectClub(club.id)}
              disabled={selectedClubId !== null}
              className={`p-3.5 rounded-xl border flex items-center gap-3 transition-all active:scale-98 ${btnClass}`}
            >
              <ClubLogo club={club} size="sm" />
              <div className="text-left flex-1 min-w-0">
                <span className="font-black text-sm block truncate">{club.name}</span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 block">{club.city}</span>
              </div>
              {selectedClubId !== null && (
                <span className="text-sm font-bold">
                  {isTarget ? '✅' : isSelected ? '❌' : ''}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Modal Game Over */}
      {isGameOver && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl animate-fade-in">
            <span className="text-4xl block mb-2">🏉</span>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Perdu !</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              C'était le <strong className="text-amber-600 dark:text-amber-400">{round.targetClub.name}</strong> !
            </p>

            <div className="my-5 p-3.5 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 flex justify-around">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Score final</span>
                <span className="text-2xl font-black text-amber-500">{score}</span>
              </div>
              <div className="w-px bg-slate-200 dark:bg-slate-800" />
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Record</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{highScore}</span>
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
