import React, { useMemo } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { getLyricsForTrack } from '../data/lyrics';
import { Mic2 } from 'lucide-react';

interface LyricsStripProps {
  onOpenLyrics?: () => void;
}

/**
 * Mini lyrics strip for the player bar
 * Shows the current lyric line with a subtle animation
 * Clicking opens the full lyrics view
 */
export function LyricsStrip({ onOpenLyrics }: LyricsStripProps) {
  const { state } = usePlayer();
  const { currentTrack, progress, isPlaying } = state;

  const lyricsData = currentTrack ? getLyricsForTrack(currentTrack.id) : null;

  // Calculate current line
  const currentLine = useMemo(() => {
    if (!lyricsData) return null;
    
    const nonEmptyLines = lyricsData.lines.filter(l => l.text.trim() !== '' && !l.pause);
    if (nonEmptyLines.length === 0) return null;
    
    const totalNonEmpty = nonEmptyLines.length;
    const activeIndex = Math.min(
      Math.floor((progress / 100) * totalNonEmpty),
      totalNonEmpty - 1
    );
    
    return nonEmptyLines[activeIndex]?.text || null;
  }, [lyricsData, progress]);

  if (!currentTrack || !currentLine || !isPlaying) return null;

  if (!onOpenLyrics) return null;

  return (
    <button
      onClick={onOpenLyrics}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-sonora-warm hover:bg-sonora-sand transition-calm group max-w-xs"
      aria-label="View lyrics"
      title="View lyrics"
    >
      <Mic2 size={12} className="text-sonora-accent flex-shrink-0" />
      <span className="text-xs text-sonora-earth truncate italic">
        {currentLine}
      </span>
    </button>
  );
}
