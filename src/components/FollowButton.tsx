import React from 'react';
import { useFollow } from '../context/FollowContext';
import { usePlayer } from '../context/PlayerContext';
import { UserPlus, UserCheck } from 'lucide-react';

interface FollowButtonProps {
  artistId: string;
  artistName: string;
  size?: 'sm' | 'md' | 'lg';
}

export function FollowButton({ artistId, artistName, size = 'md' }: FollowButtonProps) {
  const { isFollowing, followArtist, unfollowArtist } = useFollow();
  const { addToast } = usePlayer();

  const following = isFollowing(artistId);

  const handleClick = () => {
    if (following) {
      unfollowArtist(artistId);
      addToast(`Unfollowed ${artistName}`, 'info');
    } else {
      followArtist(artistId);
      addToast(`Following ${artistName}`, 'success');
    }
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  };

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-full font-medium transition-calm
        ${sizeClasses[size]}
        ${following
          ? 'bg-sonora-warm text-sonora-bark hover:bg-sonora-sand'
          : 'bg-sonora-bark text-sonora-cream hover:bg-sonora-night'
        }`}
    >
      {following ? (
        <>
          <UserCheck size={14} />
          Following
        </>
      ) : (
        <>
          <UserPlus size={14} />
          Follow
        </>
      )}
    </button>
  );
}
