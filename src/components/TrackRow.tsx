import React, { useState, useRef, useEffect } from 'react';
import { Track } from '../types';
import { usePlayer } from '../context/PlayerContext';
import { usePlayCount } from '../context/PlayCountContext';
import { AlbumArt } from './AlbumArt';
import { 
  Play, Pause, Clock, Heart, 
  ListPlus, Info, MoreHorizontal, 
  Disc3, User, Share2
} from 'lucide-react';

interface TrackRowProps {
  track: Track;
  index: number;
  showAlbum?: boolean;
  onNavigate?: (view: 'artist' | 'album', id: string) => void;
}

export function TrackRow({ track, index, showAlbum = true, onNavigate }: TrackRowProps) {
  const { state, play, togglePlay, toggleFavorite, isFavorite, addToQueue, addToast } = usePlayer();
  const { getPlayCount } = usePlayCount();
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);

  const isCurrentTrack = state.currentTrack?.id === track.id;
  const isPlaying = isCurrentTrack && state.isPlaying;
  const liked = isFavorite(track.id);
  const playCount = getPlayCount(track.id);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    }
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
  };

  const handleClick = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else {
      play(track);
    }
  };

  return (
    <>
      <div
        onContextMenu={handleContextMenu}
        onClick={handleClick}
        className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-calm group text-left cursor-pointer
          ${isCurrentTrack ? 'bg-sonora-warm' : 'hover:bg-sonora-warm/60'}`}
      >
        {/* Index / Play indicator */}
        <div className="w-6 flex items-center justify-center">
          {isPlaying ? (
            <div className="flex items-end gap-0.5 h-3">
              <span className="w-0.5 bg-sonora-bark animate-pulse" style={{ height: '60%', animationDelay: '0ms' }} />
              <span className="w-0.5 bg-sonora-bark animate-pulse" style={{ height: '100%', animationDelay: '150ms' }} />
              <span className="w-0.5 bg-sonora-bark animate-pulse" style={{ height: '40%', animationDelay: '300ms' }} />
            </div>
          ) : (
            <>
              <span className="text-xs text-sonora-stone group-hover:hidden">{index + 1}</span>
              <Play size={12} className="text-sonora-bark hidden group-hover:block" />
            </>
          )}
        </div>

        {/* Album Art */}
        <AlbumArt type="track" id={track.id} size="sm" />

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <p className={`text-sm truncate ${isCurrentTrack ? 'text-sonora-bark font-medium' : 'text-sonora-bark'}`}>
            {track.title}
          </p>
          <p className="text-xs text-sonora-stone truncate">
            {onNavigate ? (
              <span 
                className="hover:text-sonora-bark hover:underline cursor-pointer"
                onClick={(e) => { e.stopPropagation(); onNavigate('artist', track.artistId); }}
              >
                {track.artist}
              </span>
            ) : track.artist}
          </p>
        </div>

        {/* Album */}
        {showAlbum && (
          <span 
            className="text-xs text-sonora-stone hidden md:block truncate max-w-[140px] cursor-pointer hover:text-sonora-bark hover:underline"
            onClick={(e) => { e.stopPropagation(); onNavigate?.('album', track.albumId); }}
          >
            {track.album}
          </span>
        )}

        {/* Lossless badge */}
        {track.lossless && (
          <span className="text-[9px] font-semibold text-sonora-sage bg-sonora-sage/10 px-1.5 py-0.5 rounded hidden lg:block">
            LOSSLESS
          </span>
        )}

        {/* Like button */}
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); }}
          className={`p-1.5 rounded-full transition-calm
            ${liked ? 'text-sonora-accent' : 'text-sonora-stone opacity-0 group-hover:opacity-100 hover:text-sonora-accent'}`}
          aria-label={liked ? 'Unlike' : 'Like'}
        >
          <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
        </button>

        {/* Play Count */}
        {playCount > 0 && (
          <span className="text-[10px] text-sonora-stone hidden xl:block" title={`Played ${playCount} times`}>
            {playCount}×
          </span>
        )}

        {/* Duration */}
        <span className="text-xs text-sonora-stone flex items-center gap-1 w-12 justify-end">
          {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
        </span>

        {/* More menu */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            setMenuPosition({ x: rect.left, y: rect.bottom + 4 });
            setShowMenu(!showMenu);
          }}
          className="p-1.5 rounded-full text-sonora-stone opacity-0 group-hover:opacity-100 hover:text-sonora-bark transition-calm"
          aria-label="More options"
        >
          <MoreHorizontal size={14} />
        </button>
      </div>

      {/* Context Menu */}
      {showMenu && (
        <div
          ref={menuRef}
          className="fixed z-50 bg-white rounded-xl shadow-xl border border-sonora-sand py-2 min-w-[200px] animate-fade-in"
          style={{
            left: Math.min(menuPosition.x, window.innerWidth - 220),
            top: Math.min(menuPosition.y, window.innerHeight - 250),
          }}
        >
          <button
            onClick={(e) => { e.stopPropagation(); play(track); setShowMenu(false); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-sonora-bark hover:bg-sonora-warm transition-calm"
          >
            <Play size={14} /> Play
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); addToQueue(track); setShowMenu(false); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-sonora-bark hover:bg-sonora-warm transition-calm"
          >
            <ListPlus size={14} /> Add to Queue
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); addToast('Open playlist selector (coming soon)', 'info'); setShowMenu(false); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-sonora-bark hover:bg-sonora-warm transition-calm"
          >
            <ListPlus size={14} /> Add to Playlist
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); toggleFavorite(track.id); setShowMenu(false); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-sonora-bark hover:bg-sonora-warm transition-calm"
          >
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
            {liked ? 'Remove from Liked' : 'Add to Liked'}
          </button>
          <div className="border-t border-sonora-sand my-1" />
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate?.('album', track.albumId); setShowMenu(false); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-sonora-bark hover:bg-sonora-warm transition-calm"
          >
            <Disc3 size={14} /> Go to Album
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNavigate?.('artist', track.artistId); setShowMenu(false); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-sonora-bark hover:bg-sonora-warm transition-calm"
          >
            <User size={14} /> Go to Artist
          </button>
          <div className="border-t border-sonora-sand my-1" />
          <button
            onClick={(e) => { e.stopPropagation(); addToast(`Credits: ${track.credits.songwriter?.join(', ') || 'Unknown'}`, 'info'); setShowMenu(false); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-sonora-bark hover:bg-sonora-warm transition-calm"
          >
            <Info size={14} /> View Credits
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); addToast('Share link copied', 'success'); setShowMenu(false); }}
            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-sonora-bark hover:bg-sonora-warm transition-calm"
          >
            <Share2 size={14} /> Share
          </button>
        </div>
      )}
    </>
  );
}
