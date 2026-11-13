import type { ActiveGame } from '../types/game';

interface GameNavProps {
  activeGame: ActiveGame;
  onSelectGame: (game: ActiveGame) => void;
}

interface NavItem {
  id: ActiveGame;
  label: string;
  icon: string;
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'classic', label: 'Top14dle', icon: '🎯' },
  { id: 'blur', label: 'Photo Flou', icon: '👤', badge: 'Nouveau' },
  { id: 'higher-lower', label: 'Plus ou Moins', icon: '⚖️', badge: 'Nouveau' },
  { id: 'quiz', label: 'Quiz Club', icon: '🏉', badge: 'Nouveau' },
];

export function GameNav({ activeGame, onSelectGame }: GameNavProps) {
  return (
    <nav className="w-full max-w-4xl mx-auto px-4 pt-3 pb-2">
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 overflow-x-auto no-scrollbar py-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeGame === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectGame(item.id)}
              className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap active:scale-95 ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span className="text-sm sm:text-base">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && !isActive && (
                <span className="hidden sm:inline-block text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
