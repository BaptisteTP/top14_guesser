import { useState, useEffect } from 'react';
import type { Player, GuessResult, GameMode, GameStats, ActiveGame } from './types/game';
import {
  getDailyPlayer,
  getRandomPlayer,
  comparePlayer,
  loadStats,
  updateStatsOnWin,
} from './utils/gameLogic';
import { Header } from './components/Header';
import { GameNav } from './components/GameNav';
import { ClubFilterBar } from './components/ClubFilterBar';
import { SearchBar } from './components/SearchBar';
import { GuessesTable } from './components/GuessesTable';
import { CluesCard } from './components/CluesCard';
import { WinModal } from './components/WinModal';
import { StatsModal } from './components/StatsModal';
import { HelpModal } from './components/HelpModal';
import { BlurGame } from './components/BlurGame';
import { HigherLowerGame } from './components/HigherLowerGame';
import { QuizClubGame } from './components/QuizClubGame';

export function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('top14_theme') as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  const [activeGame, setActiveGame] = useState<ActiveGame>('classic');
  const [mode, setMode] = useState<GameMode>('daily');
  const [selectedClubIds, setSelectedClubIds] = useState<string[]>([]);
  const [stats, setStats] = useState<GameStats>(loadStats);

  // Synchronisation du thème avec le DOM HTML et le stockage local
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
      root.style.backgroundColor = '#020617';
      root.style.color = '#f8fafc';
      document.body.style.backgroundColor = '#020617';
      document.body.style.color = '#f8fafc';
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
      root.style.backgroundColor = '#f8fafc';
      root.style.color = '#0f172a';
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#0f172a';
    }
    try {
      localStorage.setItem('top14_theme', theme);
    } catch {}
  }, [theme]);

  // Joueur du jour (Mode Classique)
  const todayStr = new Date().toISOString().slice(0, 10);
  const [dailyTarget] = useState<Player>(() => getDailyPlayer(todayStr));

  // Joueur illimité (Mode Classique)
  const [unlimitedTarget, setUnlimitedTarget] = useState<Player>(() => getRandomPlayer());

  // Historique des essais (Mode Classique)
  const [dailyGuesses, setDailyGuesses] = useState<GuessResult[]>(() => {
    try {
      const saved = localStorage.getItem(`top14dle_daily_${todayStr}`);
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((g: GuessResult) => g && g.player && g.player.id);
    } catch {
      return [];
    }
  });
  const [unlimitedGuesses, setUnlimitedGuesses] = useState<GuessResult[]>([]);

  // Modales
  const [isWinModalOpen, setIsWinModalOpen] = useState(false);
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  // Cible et essais actuels selon le mode classique
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

  const handleSelectClub = (clubId: string) => {
    if (selectedClubIds.length === 1 && selectedClubIds[0] === clubId) {
      setSelectedClubIds([]);
      setUnlimitedTarget(getRandomPlayer(unlimitedTarget.id));
      setUnlimitedGuesses([]);
      setIsWinModalOpen(false);
    } else {
      setSelectedClubIds([clubId]);
      setMode('unlimited');
      setUnlimitedTarget(getRandomPlayer(undefined, [clubId]));
      setUnlimitedGuesses([]);
      setIsWinModalOpen(false);
    }
  };

  const handleSelectMultipleClubs = (clubIds: string[]) => {
    setSelectedClubIds(clubIds);
    setMode('unlimited');
    setUnlimitedTarget(getRandomPlayer(undefined, clubIds));
    setUnlimitedGuesses([]);
    setIsWinModalOpen(false);
  };

  const handleResetSelection = () => {
    setSelectedClubIds([]);
    setUnlimitedTarget(getRandomPlayer());
    setUnlimitedGuesses([]);
    setIsWinModalOpen(false);
  };

  const handleNewRandomPlayer = () => {
    setUnlimitedTarget(
      getRandomPlayer(unlimitedTarget.id, selectedClubIds.length > 0 ? selectedClubIds : undefined)
    );
    setUnlimitedGuesses([]);
    setIsWinModalOpen(false);
  };

  const handleResetUnlimited = () => {
    handleNewRandomPlayer();
  };

  const handlePlayUnlimitedFromDaily = () => {
    setMode('unlimited');
    setIsWinModalOpen(false);
  };

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-amber-500 selection:text-slate-950 transition-colors">
      <div className="flex-1 w-full pb-16">
        <Header
          mode={mode}
          activeGame={activeGame}
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onModeChange={(m) => setMode(m)}
          onOpenHelp={() => setIsHelpModalOpen(true)}
          onOpenStats={() => setIsStatsModalOpen(true)}
          onResetUnlimited={handleResetUnlimited}
          hasWon={hasWon}
          guessesCount={currentGuesses.length}
        />

        {/* Sélecteur des modes de jeu */}
        <GameNav activeGame={activeGame} onSelectGame={setActiveGame} />

        {/* Contenu selon le jeu actif */}
        {activeGame === 'classic' && (
          <main className="w-full">
            {/* Barre de filtrage par club */}
            <ClubFilterBar
              selectedClubIds={selectedClubIds}
              onSelectClub={handleSelectClub}
              onSelectMultipleClubs={handleSelectMultipleClubs}
              onResetSelection={handleResetSelection}
              onNewRandomPlayer={handleNewRandomPlayer}
            />

            {/* Search Bar */}
            <SearchBar
              onSelectPlayer={handleSelectPlayer}
              guessedPlayerIds={currentGuesses.map((g) => g.player.id)}
              disabled={hasWon}
              selectedClubIds={selectedClubIds}
            />

            {/* Indices progressifs précis */}
            <CluesCard
              targetPlayer={currentTarget}
              guessesCount={currentGuesses.length}
              hasWon={hasWon}
              isSingleClubFiltered={selectedClubIds.length === 1}
            />

            {/* Guesses Table */}
            <GuessesTable guesses={currentGuesses} />
          </main>
        )}

        {activeGame === 'blur' && <BlurGame />}

        {activeGame === 'higher-lower' && <HigherLowerGame />}

        {activeGame === 'quiz' && <QuizClubGame />}
      </div>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-slate-200 dark:border-slate-900 bg-white/80 dark:bg-slate-950/80 text-center text-xs text-slate-500 transition-colors">
        <div className="max-w-4xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            4 jeux pour les passionnés du championnat de France de rugby Top 14.
          </p>
          <p className="flex items-center gap-1.5">
            <span>Saison active 2026-2027</span>
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
