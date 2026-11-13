import React, { useState } from 'react';
import type { Player } from '../types/game';
import { CLUBS } from '../data/clubs';
import { getAssetUrl } from '../utils/assets';

interface PlayerAvatarProps {
  player: Player;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const PlayerAvatar: React.FC<PlayerAvatarProps> = ({
  player,
  size = 'md',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);
  const club = CLUBS[player.clubId];

  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base',
    xl: 'w-20 h-20 text-xl',
  };

  const initials = player.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const rawPhotoSrc = player.photoUrl || `/players/${player.id}.jpg`;
  const photoSrc = getAssetUrl(rawPhotoSrc);

  if (hasError || !photoSrc) {
    return (
      <div
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center font-black shadow-md border border-white/20 shrink-0 ${className}`}
        style={{
          backgroundColor: club?.colors.primary || '#1e293b',
          color: club?.colors.text || '#ffffff',
        }}
        title={player.name}
      >
        <span>{initials}</span>
      </div>
    );
  }

  return (
    <div
      className={`relative ${sizeClasses[size]} rounded-full overflow-hidden shrink-0 border border-slate-700/80 shadow-md bg-slate-800 ${className}`}
    >
      <img
        src={photoSrc}
        alt={player.name}
        onError={() => setHasError(true)}
        className="w-full h-full object-cover object-top"
        loading="lazy"
      />
    </div>
  );
};
