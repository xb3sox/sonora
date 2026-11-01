import React, { useMemo } from 'react';
import { View } from '../types';
import { TrackRow } from '../components/TrackRow';
import { EmptyState } from '../components/EmptyState';
import { usePlaybackHistory, PlaybackHistoryItem } from '../hooks/usePlaybackHistory';
import { Clock, Calendar, Trash2 } from 'lucide-react';

interface HistoryPageProps {
  onNavigate: (view: View, id?: string) => void;
}

function formatTimeAgo(timestamp: number): string {
  const now = Date.now();
  const diffMs = now - timestamp;
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function groupByDay(items: PlaybackHistoryItem[]) {
  const groups: { label: string; items: PlaybackHistoryItem[] }[] = [];
  let currentDay = '';

  items.forEach(item => {
    const day = new Date(item.playedAt).toDateString();
    if (day !== currentDay) {
      currentDay = day;
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24).toDateString();
      
      let label = new Date(item.playedAt).toLocaleDateString('en-US', { 
        weekday: 'long', 
        month: 'short', 
        day: 'numeric' 
      });
      if (day === today) label = 'Today';
      else if (day === yesterday) label = 'Yesterday';
      
      groups.push({ label, items: [] });
    }
    groups[groups.length - 1].items.push(item);
  });

  return groups;
}

export function HistoryPage({ onNavigate }: HistoryPageProps) {
  const { history, clearHistory } = usePlaybackHistory();

  const groupedHistory = useMemo(() => {
    return groupByDay(history);
  }, [history]);

  const totalPlays = history.length;
  const totalTime = history.reduce((sum, h) => sum + h.track.duration, 0);

  if (history.length === 0) {
    return (
      <EmptyState
        type="history"
        title="No listening history yet"
        description="Tracks you play will appear here, grouped by day"
      />
    );
  }

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      <header className="mb-8 pt-8 sm:pt-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-sonora-accent uppercase tracking-wider mb-2">
              <Clock size={14} /> Playback History
            </div>
            <h1 className="font-display text-3xl font-semibold text-sonora-bark mb-2">
              Recently Played
            </h1>
            <p className="text-sonora-stone text-sm">
              {totalPlays} tracks · {Math.floor(totalTime / 60)} minutes total
            </p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Clear all playback history? This cannot be undone.')) {
                clearHistory();
              }
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm text-sonora-stone hover:text-red-600 hover:bg-red-50 rounded-lg transition-calm"
            aria-label="Clear history"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Clear</span>
          </button>
        </div>
      </header>

      {/* Grouped History */}
      <div className="space-y-6">
        {groupedHistory.map((group, i) => (
          <section key={i}>
            <div className="flex items-center gap-2 mb-3">
              <Calendar size={14} className="text-sonora-stone" />
              <h2 className="text-xs font-semibold text-sonora-stone uppercase tracking-wider">
                {group.label}
              </h2>
              <span className="text-xs text-sonora-stone">
                ({group.items.length} {group.items.length === 1 ? 'track' : 'tracks'})
              </span>
            </div>
            <div className="space-y-0.5">
              {group.items.map((item, j) => (
                <div key={`${item.track.id}-${item.playedAt}`} className="flex items-center gap-2">
                  <div className="flex-1">
                    <TrackRow
                      track={item.track}
                      index={j}
                      onNavigate={onNavigate}
                    />
                  </div>
                  <span className="text-[10px] text-sonora-stone w-16 text-right flex-shrink-0">
                    {formatTimeAgo(item.playedAt)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Privacy note */}
      <div className="mt-8 bg-sonora-warm rounded-xl p-4 text-center">
        <p className="text-xs text-sonora-stone italic">
          History is stored locally on your device and never shared. You can clear it anytime.
        </p>
      </div>
    </div>
  );
}
