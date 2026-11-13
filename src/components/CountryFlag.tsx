import React, { useState } from 'react';
import { getAssetUrl } from '../utils/assets';

interface CountryFlagProps {
  nationality: string;
  fallbackEmoji?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const COUNTRY_TO_CODE: Record<string, string> = {
  'france': 'fr',
  'nouvelle-zelande': 'nz',
  'nouvelle-zélande': 'nz',
  'afrique du sud': 'za',
  'fidji': 'fj',
  'argentine': 'ar',
  'angleterre': 'gb-eng',
  'australie': 'au',
  'ecosse': 'gb-sct',
  'écosse': 'gb-sct',
  'pays de galles': 'gb-wls',
  'italie': 'it',
  'irlande': 'ie',
  'georgie': 'ge',
  'géorgie': 'ge',
  'tonga': 'to',
  'samoa': 'ws',
  'japon': 'jp',
  'etats-unis': 'us',
  'états-unis': 'us',
  'canada': 'ca',
  'uruguay': 'uy',
  'chili': 'cl',
  'espagne': 'es',
  'portugal': 'pt',
  'namibie': 'na',
  'allemagne': 'de',
  'pays-bas': 'nl',
};

export const CountryFlag: React.FC<CountryFlagProps> = ({
  nationality,
  fallbackEmoji = '🏉',
  size = 'md',
  className = '',
}) => {
  const [hasError, setHasError] = useState(false);

  const norm = (nationality || '').toLowerCase().trim();
  const code = COUNTRY_TO_CODE[norm] || COUNTRY_TO_CODE[norm.normalize('NFD').replace(/[\u0300-\u036f]/g, '')];

  const sizeClasses = {
    sm: 'w-4 h-3',
    md: 'w-6 h-4',
    lg: 'w-8 h-5 sm:w-9 sm:h-6',
    xl: 'w-11 h-7 sm:w-12 sm:h-8',
  };

  if (hasError || !code) {
    return <span className="inline-block select-none">{fallbackEmoji}</span>;
  }

  const flagSrc = getAssetUrl(`/flags/${code}.png`);

  return (
    <img
      src={flagSrc}
      alt={nationality}
      title={nationality}
      onError={() => setHasError(true)}
      className={`inline-block ${sizeClasses[size]} object-cover rounded-sm shadow-sm border border-slate-700/50 shrink-0 ${className}`}
      loading="lazy"
    />
  );
};
