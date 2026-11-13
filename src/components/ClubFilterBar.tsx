import React, { useState } from 'react';
import { Filter, Check, RotateCw, X, SlidersHorizontal } from 'lucide-react';
import { CLUBS } from '../data/clubs';
import { PLAYERS } from '../data/players';
import { ClubLogo } from './ClubLogo';

interface ClubFilterBarProps {
  selectedClubIds: string[];
  onSelectClub: (clubId: string) => void;
  onSelectMultipleClubs: (clubIds: string[]) => void;
  onResetSelection: () => void;
  onNewRandomPlayer: () => void;
}

const ALL_CLUB_KEYS = Object.keys(CLUBS);

export const ClubFilterBar: React.FC<ClubFilterBarProps> = ({
  selectedClubIds,
  onSelectClub,
  onSelectMultipleClubs,
  onResetSelection,
  onNewRandomPlayer,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalSelectedClubs, setModalSelectedClubs] = useState<string[]>(selectedClubIds);

  const isAllSelected = selectedClubIds.length === 0;

  // Calcul du nombre de joueurs disponibles pour la sélection
  const availablePlayersCount = isAllSelected
    ? PLAYERS.length
    : PLAYERS.filter((p) => selectedClubIds.includes(p.clubId)).length;

  const handleOpenModal = () => {
    setModalSelectedClubs(selectedClubIds.length === 0 ? ALL_CLUB_KEYS : selectedClubIds);
    setIsModalOpen(true);
  };

  const handleToggleModalClub = (id: string) => {
    setModalSelectedClubs((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleSelectAllInModal = () => {
    setModalSelectedClubs(ALL_CLUB_KEYS);
  };

  const handleClearInModal = () => {
    setModalSelectedClubs([]);
  };

  const handleApplyModal = () => {
    if (modalSelectedClubs.length === 0 || modalSelectedClubs.length === ALL_CLUB_KEYS.length) {
      onResetSelection();
    } else {
      onSelectMultipleClubs(modalSelectedClubs);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 sm:px-4 mb-2">
      {/* Barre de sélection rapide de clubs */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border border-slate-200 dark:border-slate-800 rounded-2xl p-2 sm:p-2.5 shadow-sm">
        <div className="flex items-center justify-between gap-2 mb-2 px-1">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300">
            <Filter size={14} className="text-amber-500" />
            <span>Filtre par club :</span>
            <span className="text-[11px] font-normal text-slate-500 dark:text-slate-400">
              {isAllSelected
                ? 'Tous les 14 clubs Top 14'
                : selectedClubIds.length === 1
                ? CLUBS[selectedClubIds[0]]?.name
                : `${selectedClubIds.length} clubs sélectionnés`}
            </span>
          </div>

          <button
            onClick={handleOpenModal}
            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 px-2 py-1 rounded-lg hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-colors"
          >
            <SlidersHorizontal size={13} />
            <span>Multi-sélection</span>
          </button>
        </div>

        {/* Liste défilante des 14 clubs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
          {/* Bouton Tous les clubs */}
          <button
            onClick={onResetSelection}
            className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-sm ${
              isAllSelected
                ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-amber-500/20'
                : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
            }`}
          >
            <span>🏉</span>
            <span>Tous</span>
          </button>

          {/* Pilules des 14 clubs */}
          {ALL_CLUB_KEYS.map((clubId) => {
            const club = CLUBS[clubId];
            const isSelected = selectedClubIds.includes(clubId);

            return (
              <button
                key={clubId}
                onClick={() => onSelectClub(clubId)}
                title={club.name}
                className={`shrink-0 px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 shadow-sm ${
                  isSelected
                    ? 'bg-amber-500 border-amber-500 text-slate-950 shadow-amber-500/20'
                    : 'bg-slate-50 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <ClubLogo club={club} size="xs" />
                <span>{club.shortName}</span>
              </button>
            );
          })}
        </div>

        {/* Bandeau d'état si un filtre est actif */}
        {!isAllSelected && (
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-700 dark:text-slate-300">
                Partie limitée à :{' '}
                <strong className="text-slate-900 dark:text-white">
                  {selectedClubIds.length === 1
                    ? CLUBS[selectedClubIds[0]]?.name
                    : `${selectedClubIds.length} clubs`}
                </strong>{' '}
                <span className="text-slate-500 dark:text-slate-400">({availablePlayersCount} joueurs)</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={onNewRandomPlayer}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] shadow-sm transition-all active:scale-95"
                title="Tirer un nouveau joueur parmi cette sélection de club"
              >
                <RotateCw size={12} />
                <span>Autre joueur</span>
              </button>

              <button
                onClick={onResetSelection}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-[11px] transition-all"
                title="Réinitialiser et jouer avec tous les clubs"
              >
                <X size={12} />
                <span>Tous les clubs</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modale de sélection multiple de clubs */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-5 shadow-2xl animate-fade-in space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={18} className="text-amber-500" />
                <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-tight">
                  Sélection des clubs
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-400">
              Coche les clubs sur lesquels tu souhaites faire deviner le joueur mystère :
            </p>

            <div className="flex items-center justify-between gap-2 text-xs">
              <button
                onClick={handleSelectAllInModal}
                className="text-amber-600 dark:text-amber-400 font-bold hover:underline"
              >
                Tout sélectionner (14)
              </button>
              <button
                onClick={handleClearInModal}
                className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
              >
                Tout désélectionner
              </button>
            </div>

            {/* Grille des 14 clubs avec cases à cocher */}
            <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto pr-1">
              {ALL_CLUB_KEYS.map((clubId) => {
                const club = CLUBS[clubId];
                const checked = modalSelectedClubs.includes(clubId);

                return (
                  <button
                    key={clubId}
                    type="button"
                    onClick={() => handleToggleModalClub(clubId)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left text-xs font-semibold transition-all ${
                      checked
                        ? 'bg-amber-500/15 border-amber-500 text-slate-900 dark:text-white font-bold'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded flex items-center justify-center border text-[10px] shrink-0 ${
                        checked
                          ? 'bg-amber-500 border-amber-500 text-slate-950'
                          : 'border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800'
                      }`}
                    >
                      {checked && <Check size={12} strokeWidth={3} />}
                    </div>
                    <ClubLogo club={club} size="xs" />
                    <span className="truncate">{club.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleApplyModal}
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all active:scale-95"
              >
                Appliquer ({modalSelectedClubs.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
