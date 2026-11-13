import { useState, useEffect } from 'react';
import type { Player, GuessResult, GameMode, GameStats } from './types/game';
import {
  getDailyPlayer,
  getRandomPlayer,
  comparePlayer,
  loadStats,
  updateStatsOnWin,
} from './utils/gameLogic';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { GuessesTable } from './components/GuessesTable';
import { CluesCard } from './components/CluesCard';
import { WinModal } from './components/WinModal';
import { StatsModal } from './components/StatsModal';
import { HelpModal } from './components/HelpModal';

export function App() {
  const [mode, setMode] = useState<GameMode>('daily');
  const [stats, setStats] = useState<GameStats>(loadStats);

  // Joueur du jour
  const todayStr = new Date().toISOString().slice(0, 10);
  const [dailyTarget] = useState<Player>(() => getDailyPlayer(todayStr));

  // Joueur illimité
  const [unlimitedTarget, setUnlimitedTarget] = useState<Player>(() => getRandomPlayer());

  // Historique des essais
  const [dailyGuesses, setDailyGuesses] = useState<GuessResult[]>(() => {
    try {
      const saved = localStorage.getItem(`top14dle_daily_${todayStr}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [unlimitedGuesses, setUnlimitedGuesses] = useState<GuessResult[]>([]);

  // Modales
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Cible et essais actuels selon le mode
  const currentTarget = mode === 'daily' ? dailyTarget : unlimitedTarget;
  const currentGuesses = mode === 'daily' ? dailyGuesses : unlimitedGuesses;
  const hasWon = currentGuesses.some((g) => g.isWinningGuess);

  // Sauvegarde des essais quotidiens
  useEffect(() => {
    try {
      localStorage.setItem(`top14dle_daily_${todayStr}`, JSON.stringify(dailyGuesses));
    } catch (e) {
      console.error('Sauvegarde échec', e);
    }
  }, [dailyGuesses, todayStr]);

  // Si l'utilisateur revient et qu'il a déjà gagné le Daily, on ne réouvre pas la modal automatiquement mais on affiche l'état gagné
  const handleSelectPlayer = (player: Player) => {
    if (hasWon) return;

    const result = comparePlayer(player, currentTarget);
    const updated = [result, ...currentGuesses];

    if (mode === 'daily') {
      setDailyGuesses(updated);
    } else {
      setUnlimitedGuesses(updated);
    }

    // Victoire !
    if (result.isWinningGuess) {
      const newStats = updateStatsOnWin(updated.length, mode === 'daily');
      setStats(newStats);
      setTimeout(() => {
        setIsWinModalOpen(true);
      }, 700);
    }
  };

  const handleResetUnlimited = () => {
    setUnlimitedTarget(getRandomPlayer(unlimitedTarget.id));
    setUnlimitedGuesses([]);
    setIsWinModalOpen(false);
  };

  const handlePlayUnlimitedFromDaily = () => {
    setMode('unlimited');
    setIsWinModalOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950">
      <main className="flex-1 w-full pb-16">
        <Header
          mode={mode}
          onModeChange={(m) => setMode(m)}
          onOpenHelp={() => setIsHelpModalOpen(true)}
          onOpenStats={() => setIsStatsModalOpen(true)}
          onResetUnlimited={handleResetUnlimited}
          hasWon={hasWon}
          guessesCount={currentGuesses.length}
        />

        {/* Search Bar */}
        <SearchBar
          onSelectPlayer={handleSelectPlayer}
          guessedPlayerIds={currentGuesses.map((g) => g.player.id)}
          disabled={hasWon}
        />

        {/* Indices progressifs */}
        <CluesCard
          targetPlayer={currentTarget}
          guessesCount={currentGuesses.length}
          hasWon={hasWon}
        />

        {/* Guesses Table */}
        <GuessesTable guesses={currentGuesses} />
      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-slate-900 bg-slate-950/80 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            Inspiré de <span className="text-slate-400 font-medium">Narutodle</span>,{' '}
            <span className="text-slate-400 font-medium">Loldle</span> &{' '}
            <span className="text-slate-400 font-medium">Wordle</span>.
          </p>
          <p className="flex items-center gap-1.5">
            <span>Fait pour les fans de rugby & de Top 14</span>
            <span>🏉</span>
          </p>
        </div>
      </footer>

      {/* Modales */}
      <WinModal
        isOpen={isWinModalOpen}
        onClose={() => setIsWinModalOpen(false)}
        targetPlayer={currentTarget}
        guesses={currentGuesses}
        mode={mode}
        onPlayUnlimited={handlePlayUnlimitedFromDaily}
        onResetUnlimited={handleResetUnlimited}
      />

      <StatsModal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        stats={stats}
      />

      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
      />
    </div>
  );
}

export default App;
