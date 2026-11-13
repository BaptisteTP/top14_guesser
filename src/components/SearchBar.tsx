import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import type { Player } from '../types/game';
import { PLAYERS } from '../data/players';
import { CLUBS } from '../data/clubs';
import { PlayerAvatar } from './PlayerAvatar';
import { ClubLogo } from './ClubLogo';
import { CountryFlag } from './CountryFlag';

interface SearchBarProps {
  onSelectPlayer: (player: Player) => void;
  guessedPlayerIds: string[];
  disabled?: boolean;
  selectedClubIds?: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSelectPlayer,
  guessedPlayerIds,
  disabled = false,
  selectedClubIds = [],
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

  const hasClubFilter = selectedClubIds.length > 0;

  // Calcul des joueurs filtrés
  const filteredPlayers = useMemo(() => {
    const trimmedQuery = query.trim();

    // Si le champ est vide mais un filtre club est actif, afficher des suggestions de ce club
    if (!trimmedQuery) {
      if (hasClubFilter) {
        return PLAYERS.filter(
          (p) => selectedClubIds.includes(p.clubId) && !guessedPlayerIds.includes(p.id)
        ).slice(0, 7);
      }
      return [];
    }

    const normalizedQuery = normalize(trimmedQuery);

    const matches = PLAYERS.filter((player) => {
      if (guessedPlayerIds.includes(player.id)) return false;

      const normalizedName = normalize(player.name);
      const club = CLUBS[player.clubId];
      const normalizedClub = club ? normalize(club.name) : '';
      const normalizedShortClub = club ? normalize(club.shortName) : '';

      return (
        normalizedName.includes(normalizedQuery) ||
        normalizedClub.includes(normalizedQuery) ||
        normalizedShortClub.includes(normalizedQuery)
      );
    });

    // Si un filtre de club est actif, prioriser les joueurs des clubs sélectionnés
    if (hasClubFilter) {
      matches.sort((a, b) => {
        const aInSelected = selectedClubIds.includes(a.clubId) ? 1 : 0;
        const bInSelected = selectedClubIds.includes(b.clubId) ? 1 : 0;
        return bInSelected - aInSelected;
      });
    }

    return matches.slice(0, 7);
  }, [query, guessedPlayerIds, selectedClubIds, hasClubFilter]);

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

  // Placeholder dynamique
  const placeholderText = disabled
    ? 'Trouvé ! Félicitations 🎉'
    : hasClubFilter && selectedClubIds.length === 1
    ? `Chercher un joueur du ${CLUBS[selectedClubIds[0]]?.name || 'club'}...`
    : hasClubFilter
    ? `Chercher parmi les ${selectedClubIds.length} clubs sélectionnés...`
    : 'Chercher un joueur (ex: Dupont, Ramos, Jalibert...)';

  return (
    <div ref={containerRef} className="relative w-full max-w-lg mx-auto my-3 z-30 px-4">
      <div className="relative flex items-center">
        <Search size={18} className="absolute left-4 text-slate-400 dark:text-slate-500 pointer-events-none" />

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
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholderText}
          className="w-full pl-11 pr-10 py-3.5 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-2xl border border-slate-300 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 shadow-md outline-none text-sm font-medium transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        />

        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Clean Dropdown */}
      {isOpen && (
        <div className="absolute left-4 right-4 mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80 max-h-80 overflow-y-auto">
          {hasClubFilter && !query.trim() && filteredPlayers.length > 0 && (
            <div className="px-4 py-2 bg-amber-50/70 dark:bg-amber-950/30 text-[11px] font-bold text-amber-800 dark:text-amber-400 flex items-center gap-1.5 border-b border-amber-200/50 dark:border-amber-900/40">
              <Sparkles size={13} />
              <span>Joueurs suggérés du club sélectionné :</span>
            </div>
          )}

          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player, index) => {
              const club = CLUBS[player.clubId];
              const isSelected = index === highlightedIndex;
              const isFromSelectedClub = selectedClubIds.includes(player.clubId);

              return (
                <button
                  key={player.id}
                  type="button"
                  onClick={() => handleSelect(player)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors ${
                    isSelected ? 'bg-amber-500/15' : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <PlayerAvatar player={player} size="sm" />
                    <div>
                      <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                        <span>{player.name}</span>
                        <CountryFlag nationality={player.nationality} fallbackEmoji={player.flag} size="sm" />
                        {hasClubFilter && isFromSelectedClub && (
                          <span className="text-[10px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-700 dark:text-amber-300">
                            Club choisi
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
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
          ) : query.trim() ? (
            <div className="px-4 py-4 text-center text-slate-500 text-xs">
              Aucun joueur trouvé pour « {query} »
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
