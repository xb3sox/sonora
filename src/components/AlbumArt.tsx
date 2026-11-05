import React from 'react';
import { getAlbumGradient, getTrackGradient, getPlaylistGradient, getArtistGradient } from '../data';
import { Disc3, Music2, ListMusic, Users } from 'lucide-react';

interface AlbumArtProps {
  type: 'album' | 'track' | 'playlist' | 'artist';
  id: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rounded?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-9 h-9',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-48 h-48',
};

const iconSizes = {
  sm: 14,
  md: 18,
  lg: 24,
  xl: 48,
};

export function AlbumArt({ type, id, size = 'md', rounded = false, className = '' }: AlbumArtProps) {
  let gradient: string;
  let Icon: React.ReactNode;

  switch (type) {
    case 'album':
      gradient = getAlbumGradient(id);
      Icon = <Disc3 size={iconSizes[size]} className="text-white/30" />;
      break;
    case 'track':
      gradient = getTrackGradient(id);
      Icon = <Music2 size={iconSizes[size]} className="text-white/30" />;
      break;
    case 'playlist':
      gradient = getPlaylistGradient(id);
      Icon = <ListMusic size={iconSizes[size]} className="text-white/30" />;
      break;
    case 'artist':
      gradient = getArtistGradient(id);
      Icon = <Users size={iconSizes[size]} className="text-white/30" />;
      break;
  }

  return (
    <div
      className={`${sizeClasses[size]} bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 ${rounded ? 'rounded-full' : 'rounded-lg'} ${className}`}
    >
      {Icon}
    </div>
  );
}
