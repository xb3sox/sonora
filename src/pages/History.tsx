import React, { useMemo } from 'react';
import { tracks } from '../data';
import { View } from '../types';
import { TrackRow } from '../components/TrackRow';
import { Clock, Calendar, Music2 } from 'lucide-react';

interface HistoryPageProps {
  onNavigate: (view: View, id?: string) => void;
}

// Simulated playback history with timestamps
const historyData = [
  { trackId: 't1', playedAt: new Date(Date.now() - 1000 * 60 * 5) }, // 5 min ago
  { trackId: 't6', playedAt: new Date(Date.now() - 1000 * 60 * 25) }, // 25 min ago
  { trackId: 't8', playedAt: new Date(Date.now() - 1000 * 60 * 60) }, // 1 hour ago
  { trackId: 't4', playedAt: new Date(Date.now() - 1000 * 60 * 60 * 3) }, // 3 hours ago
  { trackId: 't2', playedAt: new Date(Date.now() - 1000 * 60 * 60 * 5) }, // 5 hours ago
  { trackId: 't9', playedAt: new Date(Date.now() - 1000 * 60 * 60 * 24) }, // 1 day ago
  { trackId: 't7', playedAt: new Date(Date.now() - 1000 * 60 * 60 * 24) }, // 1 day ago
  { trackId: 't3', playedAt: new Date(Date.now() - 1000 * 60 * 60 * 25) }, // Yesterday
  { trackId: 't10', playedAt: new Date(Date.now() - 1000 * 60 * 60 * 48) }, // 2 days ago
  { trackId: 't5', playedAt: new Date(Date.now() - 1000 * 60 * 60 * 48) }, // 2 days ago
  { trackId: 't11', playedAt: new Date(Date.now() - 1000 * 60 * 60 * 72) }, // 3 days ago
  { trackId: 't12', playedAt: new Date(Date.now() - 1000 * 60 * 60 * 96) }, // 4 days ago
];

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function groupByDay(items: (typeof historyData[0] & { track: typeof tracks[0] })[]) {
  const groups: { label: string; items: (typeof historyData[0] & { track: typeof tracks[0] })[] }[] = [];
  let currentDay = '';

  items.forEach(item => {
    const day = item.playedAt.toDateString();
    if (day !== currentDay) {
      currentDay = day;
      const today = new Date().toDateString();
      const yesterday = new Date(Date.now() - 1000 * 60 * 60 * 24).toDateString();
      
      let label = item.playedAt.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
      if (day === today) label = 'Today';
      else if (day === yesterday) label = 'Yesterday';
      
      groups.push({ label, items: [] });
    }
    groups[groups.length - 1].items.push(item);
  });

  return groups;
}

export function HistoryPage({ onNavigate }: HistoryPageProps) {
  const groupedHistory = useMemo(() => {
    const fullHistory = historyData.map(h => ({
      ...h,
      track: tracks.find(t => t.id === h.trackId)!
    })).filter(h => h.track);
    
    return groupByDay(fullHistory);
  }, []);

  const totalPlays = historyData.length;
  const totalTime = historyData.reduce((sum, h) => {
    const track = tracks.find(t => t.id === h.trackId);
    return sum + (track?.duration || 0);
  }, 0);

  return (
    <div className="p-6 sm:p-8 max-w-4xl mx-auto">
      <header className="mb-8 pt-8 sm:pt-0">
        <div className="flex items-center gap-2 text-xs font-semibold text-sonora-accent uppercase tracking-wider mb-2">
          <Clock size={14} /> Playback History
        </div>
        <h1 className="font-display text-3xl font-semibold text-sonora-bark mb-2">
          Recently Played
        </h1>
        <p className="text-sonora-stone text-sm">
          {totalPlays} tracks · {Math.floor(totalTime / 60)} minutes this week
        </p>
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
            </div>
            <div className="space-y-0.5">
              {group.items.map((item, j) => (
                <div key={j} className="flex items-center gap-2">
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
          History is stored locally and never shared. You can clear it anytime in Settings.
        </p>
      </div>
    </div>
  );
}
