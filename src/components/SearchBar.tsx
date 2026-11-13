import React, { useState, useRef, useEffect } from 'react';
import { Search, X, ShieldAlert } from 'lucide-react';
import type { Player } from '../types/game';
import { PLAYERS } from '../data/players';
import { CLUBS } from '../data/clubs';
import { PlayerAvatar } from './PlayerAvatar';
import { ClubLogo } from './ClubLogo';

interface SearchBarProps {
  onSelectPlayer: (player: Player) => void;
  guessedPlayerIds: string[];
  disabled?: boolean;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectPlayer,
  guessedPlayerIds,
  disabled = false,
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Normalise les chaînes pour la recherche sans accent
  const normalize = (str: string) =>
    str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const filteredPlayers = PLAYERS.filter((player) => {
    if (guessedPlayerIds.includes(player.id)) return false;
    if (!query.trim()) return false;

    const normalizedQuery = normalize(query.trim());
    const normalizedName = normalize(player.name);
    const club = CLUBS[player.clubId];
    const normalizedClub = club ? normalize(club.name) : '';
    const normalizedShortClub = club ? normalize(club.shortName) : '';
    const normalizedNat = normalize(player.nationality);

    return (
      normalizedName.includes(normalizedQuery) ||
      normalizedClub.includes(normalizedQuery) ||
      normalizedShortClub.includes(normalizedQuery) ||
      normalizedNat.includes(normalizedQuery)
    );
  }).slice(0, 8); // Top 8 résultats

  // Gestion des clics en dehors
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clavier
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || filteredPlayers.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % filteredPlayers.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + filteredPlayers.length) % filteredPlayers.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredPlayers[highlightedIndex]) {
        handleSelect(filteredPlayers[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (player: Player) => {
    onSelectPlayer(player);
    setQuery('');
    setIsOpen(false);
    setHighlightedIndex(0);
    inputRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto my-4 z-30 px-4">
      <div className="relative flex items-center">
        <div className="absolute left-7 text-slate-400 pointer-events-none">
          <Search size={18} />
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          disabled={disabled}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setHighlightedIndex(0);
          }}
          onFocus={() => {
            if (query.trim()) setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            disabled
              ? 'Partie terminée ! Félicitations 🎉'
              : 'Devine un joueur (ex: Dupont, Ramos, Jalibert, Penaud...)'
          }
          className={`w-full pl-11 pr-10 py-3.5 bg-slate-900/95 text-white placeholder-slate-400 rounded-2xl border ${
            isOpen && filteredPlayers.length > 0
              ? 'border-amber-500 ring-2 ring-amber-500/30'
              : 'border-slate-800 hover:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
          } shadow-xl backdrop-blur-md outline-none text-sm sm:text-base font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-7 p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Dropdown Menu */}
      {isOpen && query.trim() && (
        <div className="absolute left-4 right-4 mt-2 bg-slate-900/98 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-xl overflow-hidden divide-y divide-slate-800/80 animate-in fade-in slide-in-from-top-2 duration-150">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player, index) => {
              const club = CLUBS[player.clubId];
              const isSelected = index === highlightedIndex;

              return (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => handleSelect(player)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors ${
                    isSelected ? 'bg-amber-500/15 text-white' : 'text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Player Photo Avatar */}
                    <PlayerAvatar player={player} size="md" />

                    {/* Name, Club, Position & Nationality */}
                    <div>
                      <div className="font-bold text-sm sm:text-base text-slate-100 flex items-center gap-2">
                        <span>{player.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-semibold">
                          {player.flag} {player.nationality}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                        <span className="inline-flex items-center gap-1 font-medium text-slate-300">
                          <ClubLogo club={club} size="xs" />
                          <span>{club?.name}</span>
                        </span>
                        <span>•</span>
                        <span className="text-amber-400 font-medium">{player.position}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats & Line Badges */}
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700">
                      {player.line}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {player.age} ans • {player.height} cm • {player.weight} kg
                    </span>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="px-4 py-6 text-center text-slate-400 text-sm flex flex-col items-center gap-2">
              <ShieldAlert size={24} className="text-slate-500" />
              <span>Aucun joueur correspondant trouvé.</span>
              <span className="text-xs text-slate-500">
                Essaie avec le nom de famille, la nationalité ou un club de Top 14.
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
