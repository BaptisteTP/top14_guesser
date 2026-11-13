import React, { useState } from 'react';
import type { Club } from '../types/game';
import { getAssetUrl } from '../utils/assets';

interface ClubLogoProps {
  club?: Club;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const ClubLogo: React.FC<ClubLogoProps> = ({
  club,
  size = 'md',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    xs: 'w-5 h-5 text-sm',
    sm: 'w-7 h-7 text-base',
    md: 'w-9 h-9 text-xl',
    lg: 'w-12 h-12 text-2xl',
    xl: 'w-16 h-16 text-3xl',
  };

  if (!club) {
    return <span className="text-lg">🏉</span>;
  }

  if (hasError || !club.logo) {
    return (
      <span className={`${sizeClasses[size]} inline-flex items-center justify-center select-none ${className}`}>
        {club.badgeEmoji || '🏉'}
      </span>
    );
  }

  const logoSrc = getAssetUrl(club.logo);

  return (
    <div
      className={`${sizeClasses[size]} inline-flex items-center justify-center shrink-0 drop-shadow-md ${className}`}
    >
      <img
        src={logoSrc}
        alt={club.name}
        onError={() => setHasError(true)}
        className="max-w-full max-h-full object-contain filter drop-shadow"
        loading="lazy"
      />
    </div>
  );
};
