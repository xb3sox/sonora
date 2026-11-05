import React from 'react';
import { Music2, Disc3, Users } from 'lucide-react';

export type SearchFilter = 'all' | 'tracks' | 'albums' | 'artists';

interface SearchFiltersProps {
  activeFilter: SearchFilter;
  onFilterChange: (filter: SearchFilter) => void;
  resultCounts: {
    tracks: number;
    albums: number;
    artists: number;
  };
}

/**
 * Search filter component
 * Allows users to filter search results by type
 */
export function SearchFilters({ activeFilter, onFilterChange, resultCounts }: SearchFiltersProps) {
  const filters: { id: SearchFilter; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'all', label: 'All', icon: null, count: resultCounts.tracks + resultCounts.albums + resultCounts.artists },
    { id: 'tracks', label: 'Tracks', icon: <Music2 size={14} />, count: resultCounts.tracks },
    { id: 'albums', label: 'Albums', icon: <Disc3 size={14} />, count: resultCounts.albums },
    { id: 'artists', label: 'Artists', icon: <Users size={14} />, count: resultCounts.artists },
  ];

  return (
    <div className="flex items-center gap-2 mb-6">
      {filters.map(filter => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-calm
            ${activeFilter === filter.id
              ? 'bg-sonora-bark text-sonora-cream'
              : 'bg-sonora-warm text-sonora-earth hover:bg-sonora-sand'
            }`}
        >
          {filter.icon}
          <span>{filter.label}</span>
          {filter.count > 0 && (
            <span className={`text-xs px-1.5 py-0.5 rounded-full
              ${activeFilter === filter.id
                ? 'bg-sonora-cream/20 text-sonora-cream'
                : 'bg-sonora-sand text-sonora-stone'
              }`}
            >
              {filter.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
