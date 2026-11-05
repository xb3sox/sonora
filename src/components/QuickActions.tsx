import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { 
  Plus, Heart, ListMusic, Share2, MoreHorizontal,
  X, Music2, Disc3, Users
} from 'lucide-react';

interface QuickActionsProps {
  onNavigate: (view: any, id?: string) => void;
  onOpenCreatePlaylist: () => void;
}

export function QuickActions({ onNavigate, onOpenCreatePlaylist }: QuickActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { state, toggleFavorite, isFavorite } = usePlayer();

  const currentTrack = state.currentTrack;
  const isLiked = currentTrack ? isFavorite(currentTrack.id) : false;

  const actions = [
    {
      id: 'create-playlist',
      label: 'New Playlist',
      icon: <Plus size={20} />,
      action: () => {
        onOpenCreatePlaylist();
        setIsOpen(false);
      },
    },
    {
      id: 'like',
      label: isLiked ? 'Unlike Track' : 'Like Track',
      icon: <Heart size={20} fill={isLiked ? 'currentColor' : 'none'} />,
      action: () => {
        if (currentTrack) {
          toggleFavorite(currentTrack.id);
        }
        setIsOpen(false);
      },
      disabled: !currentTrack,
    },
    {
      id: 'queue',
      label: 'View Queue',
      icon: <ListMusic size={20} />,
      action: () => {
        // Queue view is handled by parent
        setIsOpen(false);
      },
    },
    {
      id: 'share',
      label: 'Share',
      icon: <Share2 size={20} />,
      action: () => {
        // Share functionality
        setIsOpen(false);
      },
      disabled: !currentTrack,
    },
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-28 right-6 z-40 w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isOpen
            ? 'bg-sonora-stone text-sonora-cream rotate-45'
            : 'bg-sonora-bark text-sonora-cream hover:bg-sonora-night'
        }`}
        aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
      >
        {isOpen ? <X size={24} /> : <MoreHorizontal size={24} />}
      </button>

      {/* Action Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-30 bg-black/20 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div className="fixed bottom-44 right-6 z-40 bg-sonora-cream rounded-2xl shadow-2xl border border-sonora-sand overflow-hidden animate-slide-up">
            <div className="p-2 min-w-[200px]">
              {actions.map((action) => (
                <button
                  key={action.id}
                  onClick={action.action}
                  disabled={action.disabled}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    action.disabled
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-sonora-warm'
                  }`}
                >
                  <div className="text-sonora-bark">
                    {action.icon}
                  </div>
                  <span className="text-sm font-medium text-sonora-bark">
                    {action.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}
