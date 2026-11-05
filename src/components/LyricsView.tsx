import React, { useEffect, useRef, useMemo, useState } from 'react';
import { X, Share2, Quote, Music2, Languages } from 'lucide-react';
import { Track } from '../types';
import { getLyricsForTrack, getAlbumPalette, LyricLine } from '../data/lyrics';
import { LyricCardModal } from './LyricCard';

interface LyricsViewProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
  progress: number;
}

/**
 * Immersive lyrics view with kinetic typography, auto-scroll, and album-colored background
 * Design inspired by Apple Music's lyrics experience and editorial typography
 */
export function LyricsView({ isOpen, onClose, track, progress }: LyricsViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [showCardModal, setShowCardModal] = useState(false);
  const [activeLineIndex, setActiveLineIndex] = useState(0);

  const lyricsData = track ? getLyricsForTrack(track.id) : null;
  const palette = track ? getAlbumPalette(track.albumId) : null;

  // Calculate active line based on progress
  const nonEmptyLineIndices = useMemo(() => {
    if (!lyricsData) return [];
    return lyricsData.lines.reduce<number[]>((acc, line, index) => {
      if (line.text.trim() !== '' && !line.pause) {
        acc.push(index);
      }
      return acc;
    }, []);
  }, [lyricsData]);

  // Update active line when progress changes
  useEffect(() => {
    if (nonEmptyLineIndices.length === 0) return;
    const totalNonEmpty = nonEmptyLineIndices.length;
    const activeNonEmptyIndex = Math.min(
      Math.floor((progress / 100) * totalNonEmpty),
      totalNonEmpty - 1
    );
    setActiveLineIndex(nonEmptyLineIndices[activeNonEmptyIndex] ?? 0);
  }, [progress, nonEmptyLineIndices]);

  // Auto-scroll to active line
  useEffect(() => {
    if (!scrollRef.current || !lineRefs.current[activeLineIndex]) return;
    
    const container = scrollRef.current;
    const activeElement = lineRefs.current[activeLineIndex];
    if (!activeElement) return;

    // Position active line at 40% from top for better visual balance
    const containerHeight = container.clientHeight;
    const elementTop = activeElement.offsetTop;
    const elementHeight = activeElement.offsetHeight;
    const targetScroll = elementTop - (containerHeight * 0.4) + (elementHeight / 2);

    container.scrollTo({
      top: Math.max(0, targetScroll),
      behavior: 'smooth',
    });
  }, [activeLineIndex]);

  // Close card modal when lyrics view closes
  useEffect(() => {
    if (!isOpen) setShowCardModal(false);
  }, [isOpen]);

  if (!isOpen || !track || !lyricsData || !palette) return null;

  const activeLine = lyricsData.lines[activeLineIndex];
  const progressPercent = progress;

  // Mood-based background intensity
  const moodIntensity = {
    contemplative: 0.85,
    hopeful: 0.75,
    melancholic: 0.9,
    ethereal: 0.8,
    warm: 0.7,
  }[lyricsData.mood] || 0.85;

  return (
    <>
      <div className="fixed inset-0 z-50 flex flex-col overflow-hidden">
        {/* Immersive background - blurred gradient from album colors */}
        <div 
          className="absolute inset-0 animate-gradient-shift"
          style={{
            background: `
              radial-gradient(ellipse at 20% 30%, ${palette.primary}${Math.round(moodIntensity * 255).toString(16).padStart(2, '0')} 0%, transparent 50%),
              radial-gradient(ellipse at 80% 70%, ${palette.secondary}${Math.round(moodIntensity * 255).toString(16).padStart(2, '0')} 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, ${palette.accent}40 0%, transparent 70%),
              linear-gradient(180deg, #1A1612 0%, #2A2218 50%, #1A1612 100%)
            `,
          }}
        />
        
        {/* Noise texture overlay for depth */}
        <div 
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />

        {/* Top gradient fade */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-sonora-night/80 to-transparent pointer-events-none z-10" />
        
        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-sonora-night/80 to-transparent pointer-events-none z-10" />

        {/* Header */}
        <div className="relative z-20 flex items-center justify-between p-5 sm:p-6">
          <div className="flex items-center gap-3 min-w-0">
            <Quote size={18} className="text-sonora-cream/60 flex-shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-sonora-cream/50 uppercase tracking-wider">Lyrics</p>
              <p className="text-sm text-sonora-cream font-medium truncate">{track.title}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCardModal(true)}
              className="p-2 rounded-full bg-sonora-cream/10 hover:bg-sonora-cream/20 text-sonora-cream/80 transition-calm backdrop-blur-sm"
              aria-label="Share lyric"
              title="Share this lyric"
            >
              <Share2 size={16} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-sonora-cream/10 hover:bg-sonora-cream/20 text-sonora-cream/80 transition-calm backdrop-blur-sm"
              aria-label="Close lyrics"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="relative z-20 px-6 sm:px-8">
          <div className="h-0.5 bg-sonora-cream/10 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full animate-progress-pulse"
              style={{
                width: `${progressPercent}%`,
                background: `linear-gradient(90deg, ${palette.accent}, ${palette.primary})`,
                transition: 'width 1s linear',
              }}
            />
          </div>
        </div>

        {/* Lyrics content - scrollable */}
        <div
          ref={scrollRef}
          className="relative z-20 flex-1 overflow-y-auto lyrics-scroll-container px-6 sm:px-12 md:px-20 py-12"
        >
          <div className="max-w-2xl mx-auto space-y-2">
            {lyricsData.lines.map((line, index) => {
              const isActive = index === activeLineIndex;
              const activeIndexInNonEmpty = nonEmptyLineIndices.indexOf(activeLineIndex);
              const lineIndexInNonEmpty = nonEmptyLineIndices.indexOf(index);
              const isPast = lineIndexInNonEmpty !== -1 && lineIndexInNonEmpty < activeIndexInNonEmpty;
              const isFuture = lineIndexInNonEmpty !== -1 && lineIndexInNonEmpty > activeIndexInNonEmpty;
              const isEmpty = line.text.trim() === '' || line.pause;
              const isSectionStart = line.section && index > 0 && lyricsData.lines[index - 1].section !== line.section;

              // Opacity based on state
              let opacity = 1;
              if (isActive) opacity = 1;
              else if (isPast) opacity = 0.25;
              else if (isFuture) opacity = 0.45;
              else if (isEmpty) opacity = 0;

              // Emphasis class
              const emphasisClass = 
                line.emphasis === 'strong' ? 'lyric-line-strong' :
                line.emphasis === 'medium' ? 'lyric-line-medium' :
                'lyric-line-subtle';

              return (
                <React.Fragment key={index}>
                  {/* Section marker */}
                  {isSectionStart && !isEmpty && (
                    <div className="flex items-center gap-3 py-4 opacity-40">
                      <div className="h-px flex-1 bg-sonora-cream/20" />
                      <span className="text-[10px] uppercase tracking-[0.2em] text-sonora-cream/60 font-medium">
                        {line.section}
                      </span>
                      <div className="h-px flex-1 bg-sonora-cream/20" />
                    </div>
                  )}
                  
                  <div
                    ref={(el) => { lineRefs.current[index] = el; }}
                    className={`lyric-line ${emphasisClass} font-display ${
                      isEmpty ? 'h-6' : 'py-1'
                    } ${
                      isActive ? 'animate-lyric-glow' : ''
                    }`}
                    style={{
                      color: isActive 
                        ? palette.accent 
                        : isPast 
                        ? `rgba(250, 248, 245, ${opacity})`
                        : `rgba(250, 248, 245, ${opacity})`,
                      transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                      transform: isActive ? 'scale(1.02)' : 'scale(1)',
                      filter: isPast ? 'blur(0.5px)' : 'blur(0)',
                    }}
                  >
                    {!isEmpty && line.text}
                  </div>
                </React.Fragment>
              );
            })}
            
            {/* End spacer */}
            <div className="h-40" />
          </div>
        </div>

        {/* Footer with credits */}
        <div className="relative z-20 px-6 pb-6 pt-2">
          <div className="max-w-2xl mx-auto flex items-center justify-between text-xs text-sonora-cream/40">
            <div className="flex items-center gap-2">
              <Music2 size={12} />
              <span>Written by {lyricsData.writer}</span>
            </div>
            <div className="flex items-center gap-2">
              <Languages size={12} />
              <span className="uppercase tracking-wider">{lyricsData.language}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Lyric Card Modal */}
      {showCardModal && activeLine && (
        <LyricCardModal
          isOpen={showCardModal}
          onClose={() => setShowCardModal(false)}
          track={track}
          lyricLine={activeLine.text}
          palette={palette}
        />
      )}
    </>
  );
}
