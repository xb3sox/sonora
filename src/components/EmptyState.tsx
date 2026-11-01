import React from 'react';
import { Music2, Disc3, Heart, ListMusic, Search, Clock } from 'lucide-react';

type EmptyStateType = 'library' | 'liked' | 'playlists' | 'history' | 'search' | 'queue';

interface EmptyStateProps {
  type: EmptyStateType;
  title?: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

const emptyStateConfig: Record<EmptyStateType, {
  icon: React.ReactNode;
  defaultTitle: string;
  defaultDescription: string;
}> = {
  library: {
    icon: <Music2 size={48} className="text-sonora-sand" />,
    defaultTitle: 'Your library is empty',
    defaultDescription: 'Start building your collection by adding albums and playlists',
  },
  liked: {
    icon: <Heart size={48} className="text-sonora-sand" />,
    defaultTitle: 'No liked tracks yet',
    defaultDescription: 'Tap the heart icon on any track to save it here',
  },
  playlists: {
    icon: <ListMusic size={48} className="text-sonora-sand" />,
    defaultTitle: 'No playlists yet',
    defaultDescription: 'Create your first playlist to organize your favorite tracks',
  },
  history: {
    icon: <Clock size={48} className="text-sonora-sand" />,
    defaultTitle: 'No listening history',
    defaultDescription: 'Tracks you play will appear here',
  },
  search: {
    icon: <Search size={48} className="text-sonora-sand" />,
    defaultTitle: 'No results found',
    defaultDescription: 'Try a different search term or browse by genre',
  },
  queue: {
    icon: <ListMusic size={48} className="text-sonora-sand" />,
    defaultTitle: 'Queue is empty',
    defaultDescription: 'Add tracks to your queue from any track menu',
  },
};

export function EmptyState({ type, title, description, action }: EmptyStateProps) {
  const config = emptyStateConfig[type];

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="mb-4">{config.icon}</div>
      <h3 className="font-display text-lg font-semibold text-sonora-bark mb-2">
        {title || config.defaultTitle}
      </h3>
      <p className="text-sm text-sonora-stone max-w-sm mb-6">
        {description || config.defaultDescription}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-5 py-2.5 bg-sonora-bark text-sonora-cream rounded-full text-sm font-medium hover:bg-sonora-night transition-calm"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
