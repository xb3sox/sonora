import React, { useState } from 'react';
import { X, Music2, Mic2 } from 'lucide-react';
import { Track } from '../types';

interface LyricsViewProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
  progress: number;
}

// Simulated lyrics for each track
const trackLyrics: Record<string, string[]> = {
  t1: [
    'Morning light through the window pane',
    'Dust motes dancing in golden rain',
    'The kettle hums a quiet tune',
    'Beneath the fading silver moon',
    '',
    'Time moves slow in quiet hours',
    'Counting seconds, counting flowers',
    'Every breath a gentle sound',
    'In this stillness I am found',
    '',
    'Let the morning hold you close',
    'Like a river, like a rose',
    'Nothing needs to be said',
    'Just the light above your head',
  ],
  t2: [
    'Where the river bends so slow',
    'Past the willows in a row',
    'Water whispers ancient tales',
    'Of the wind and sailing sails',
    '',
    'I have walked this path before',
    'Through the mist and through the door',
    'Every stone remembers me',
    'Every branch of every tree',
    '',
    'River bend and river song',
    'Carry me where I belong',
    'In the current, in the calm',
    'In the quiet, in the balm',
  ],
  t3: [
    'Still waters run so deep tonight',
    'Reflecting stars in silver light',
    'No wind to stir the surface glass',
    'No sound but time as it will pass',
    '',
    'I stand upon the quiet shore',
    'And ask the water nothing more',
    'For in its depth I find my peace',
    'A stillness that will never cease',
    '',
    'Let me be the water\'s friend',
    'From beginning unto end',
    'Still and silent, deep and true',
    'I am the stillness, you are too',
  ],
  t4: [
    'Golden hour on the fields of light',
    'Shadows stretching through the night',
    'We have walked so far from home',
    'Through the valleys, through the loam',
    '',
    'Every mile a memory made',
    'Every song a debt repaid',
    'To the earth that holds our feet',
    'To the sky that makes us complete',
    '',
    'Fields of light and fields of grain',
    'Sun and moon and sun again',
    'We are wanderers, we are home',
    'Wherever we may roam',
  ],
  t6: [
    'Paper boats on morning tide',
    'Carrying words we cannot hide',
    'Folded carefully, sent with care',
    'Into the ocean of the air',
    '',
    'Some will sink and some will sail',
    'Some will tell a perfect tale',
    'But each one carries something true',
    'A piece of me, a piece of you',
    '',
    'Let them float and let them fly',
    'Underneath the open sky',
    'Paper boats and paper dreams',
    'Nothing is quite what it seems',
  ],
  t8: [
    'Autumn letters, written slow',
    'In the amber evening glow',
    'Words I could not say aloud',
    'Folded in a paper cloud',
    '',
    'Dear friend, I hope this finds you well',
    'With stories that I long to tell',
    'The leaves are turning gold and red',
    'And I am thinking of you instead',
    '',
    'Autumn letters, sent with care',
    'Through the crisp and cooling air',
    'May they find you, may they stay',
    'Until I see you another day',
  ],
};

export function LyricsView({ isOpen, onClose, track, progress }: LyricsViewProps) {
  if (!isOpen || !track) return null;

  const lyrics = trackLyrics[track.id] || [
    'Instrumental piece',
    '',
    'This composition speaks through',
    'melody and texture alone.',
    '',
    'Let the sounds carry you.',
  ];

  // Calculate which line is "active" based on progress
  const totalLines = lyrics.filter(l => l.trim()).length;
  const activeLineIndex = Math.floor((progress / 100) * totalLines);
  let nonEmptyCount = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-sonora-bark/50 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full sm:w-[480px] max-h-[80vh] bg-sonora-cream rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-sonora-sand flex-shrink-0">
          <div className="flex items-center gap-2">
            <Mic2 size={18} className="text-sonora-bark" />
            <h2 className="font-display text-lg font-semibold text-sonora-bark">Lyrics</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-sonora-warm text-sonora-stone hover:text-sonora-bark transition-calm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Track Info */}
        <div className="px-5 py-3 border-b border-sonora-sand flex-shrink-0">
          <p className="text-sm font-medium text-sonora-bark truncate">{track.title}</p>
          <p className="text-xs text-sonora-stone truncate">{track.artist}</p>
        </div>

        {/* Lyrics */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-1">
            {lyrics.map((line, i) => {
              const isNonEmpty = line.trim() !== '';
              if (isNonEmpty) nonEmptyCount++;
              const currentNonEmpty = nonEmptyCount;
              const isActive = isNonEmpty && currentNonEmpty === activeLineIndex + 1;
              const isPast = isNonEmpty && currentNonEmpty <= activeLineIndex;
              
              return (
                <p
                  key={i}
                  className={`text-base leading-relaxed transition-all duration-500 ${
                    line.trim() === '' ? 'h-4' : ''
                  } ${
                    isActive
                      ? 'text-sonora-bark font-medium scale-105'
                      : isPast
                      ? 'text-sonora-stone'
                      : 'text-sonora-stone/50'
                  }`}
                >
                  {line || '\u00A0'}
                </p>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-sonora-sand text-center flex-shrink-0">
          <p className="text-[10px] text-sonora-stone italic">
            Lyrics provided by the artist. Sing along quietly.
          </p>
        </div>
      </div>
    </div>
  );
}
