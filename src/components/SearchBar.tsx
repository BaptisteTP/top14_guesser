import React, { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
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

    return (
      normalizedName.includes(normalizedQuery) ||
      normalizedClub.includes(normalizedQuery) ||
      normalizedShortClub.includes(normalizedQuery)
    );
  }).slice(0, 7);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    <div ref={containerRef} className="relative w-full max-w-lg mx-auto my-4 z-30 px-4">
      <div className="relative flex items-center">
        <Search size={18} className="absolute left-4 text-slate-400 pointer-events-none" />

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
              ? 'Trouvé ! Félicitations 🎉'
              : 'Chercher un joueur (ex: Dupont, Ramos, Jalibert...)'
          }
          className="w-full pl-11 pr-10 py-3.5 bg-slate-900 text-white placeholder-slate-500 rounded-2xl border border-slate-800 hover:border-slate-700 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-lg outline-none text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3.5 p-1 text-slate-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Clean Dropdown */}
      {isOpen && query.trim() && (
        <div className="absolute left-4 right-4 mt-2 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden divide-y divide-slate-800/80">
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
                    isSelected ? 'bg-amber-500/15' : 'hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <PlayerAvatar player={player} size="sm" />
                    <div>
                      <div className="font-semibold text-sm text-slate-100 flex items-center gap-1.5">
                        <span>{player.name}</span>
                        <span className="text-xs">{player.flag}</span>
                      </div>
                      <div className="text-xs text-slate-400 flex items-center gap-1.5">
                        <ClubLogo club={club} size="xs" />
                        <span>{club?.shortName || club?.name}</span>
                        <span>•</span>
                        <span>{player.position}</span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="px-4 py-4 text-center text-slate-500 text-xs">
              Aucun joueur trouvé
            </div>
          )}
        </div>
      )}
    </div>
  );
};
