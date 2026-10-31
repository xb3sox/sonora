import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Compass, Library, Search, Headphones, Settings, 
  BarChart3, Clock, Music2, Disc3, Users, Play,
  Command
} from 'lucide-react';
import { tracks, albums, artists } from '../data';
import { usePlayer } from '../context/PlayerContext';
import { View } from '../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: View, id?: string) => void;
}

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'navigation' | 'playback' | 'content';
}

export function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { play, togglePlay, toggleShuffle, toggleRepeat } = usePlayer();

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const commands: CommandItem[] = [
    // Navigation
    { id: 'home', label: 'Go to Home', icon: <Home size={16} />, action: () => onNavigate('home'), category: 'navigation' },
    { id: 'explore', label: 'Go to Explore', icon: <Compass size={16} />, action: () => onNavigate('explore'), category: 'navigation' },
    { id: 'library', label: 'Go to Library', icon: <Library size={16} />, action: () => onNavigate('library'), category: 'navigation' },
    { id: 'search', label: 'Go to Search', icon: <Search size={16} />, action: () => onNavigate('search'), category: 'navigation' },
    { id: 'history', label: 'Go to History', icon: <Clock size={16} />, action: () => onNavigate('history'), category: 'navigation' },
    { id: 'stats', label: 'Go to Stats', icon: <BarChart3 size={16} />, action: () => onNavigate('stats'), category: 'navigation' },
    { id: 'settings', label: 'Go to Settings', icon: <Settings size={16} />, action: () => onNavigate('settings'), category: 'navigation' },
    { id: 'deep', label: 'Deep Listening Mode', icon: <Headphones size={16} />, action: () => onNavigate('deep-listening'), category: 'navigation' },
    
    // Playback
    { id: 'play-pause', label: 'Play/Pause', icon: <Play size={16} />, action: () => togglePlay(), category: 'playback' },
    { id: 'shuffle', label: 'Toggle Shuffle', icon: <Music2 size={16} />, action: () => toggleShuffle(), category: 'playback' },
    { id: 'repeat', label: 'Toggle Repeat', icon: <Music2 size={16} />, action: () => toggleRepeat(), category: 'playback' },
    
    // Content - Tracks
    ...tracks.slice(0, 5).map(track => ({
      id: `track-${track.id}`,
      label: track.title,
      description: track.artist,
      icon: <Music2 size={16} />,
      action: () => play(track),
      category: 'content' as const
    })),
    
    // Content - Albums
    ...albums.slice(0, 3).map(album => ({
      id: `album-${album.id}`,
      label: album.title,
      description: album.artist,
      icon: <Disc3 size={16} />,
      action: () => onNavigate('album', album.id),
      category: 'content' as const
    })),
    
    // Content - Artists
    ...artists.slice(0, 3).map(artist => ({
      id: `artist-${artist.id}`,
      label: artist.name,
      description: artist.genres.join(', '),
      icon: <Users size={16} />,
      action: () => onNavigate('artist', artist.id),
      category: 'content' as const
    })),
  ];

  const filteredCommands = query.trim() === ''
    ? commands
    : commands.filter(cmd => 
        cmd.label.toLowerCase().includes(query.toLowerCase()) ||
        cmd.description?.toLowerCase().includes(query.toLowerCase())
      );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const groupedCommands = {
    navigation: filteredCommands.filter(c => c.category === 'navigation'),
    playback: filteredCommands.filter(c => c.category === 'playback'),
    content: filteredCommands.filter(c => c.category === 'content'),
  };

  let globalIndex = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div className="absolute inset-0 bg-sonora-bark/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-sonora-cream rounded-2xl shadow-2xl overflow-hidden animate-fade-in">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-sonora-sand">
          <Command size={20} className="text-sonora-stone flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-sonora-bark placeholder:text-sonora-stone focus:outline-none text-sm"
          />
          <kbd className="px-2 py-1 bg-sonora-warm border border-sonora-sand rounded text-xs text-sonora-stone">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto p-2">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-8 text-sm text-sonora-stone">
              No results found
            </div>
          ) : (
            <>
              {groupedCommands.navigation.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1.5 text-xs font-semibold text-sonora-stone uppercase tracking-wider">
                    Navigation
                  </div>
                  {groupedCommands.navigation.map(cmd => {
                    const index = globalIndex++;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => { cmd.action(); onClose(); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-calm
                          ${index === selectedIndex ? 'bg-sonora-warm' : 'hover:bg-sonora-warm/50'}`}
                      >
                        <div className="text-sonora-earth">{cmd.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-sonora-bark">{cmd.label}</div>
                          {cmd.description && (
                            <div className="text-xs text-sonora-stone truncate">{cmd.description}</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {groupedCommands.playback.length > 0 && (
                <div className="mb-2">
                  <div className="px-3 py-1.5 text-xs font-semibold text-sonora-stone uppercase tracking-wider">
                    Playback
                  </div>
                  {groupedCommands.playback.map(cmd => {
                    const index = globalIndex++;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => { cmd.action(); onClose(); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-calm
                          ${index === selectedIndex ? 'bg-sonora-warm' : 'hover:bg-sonora-warm/50'}`}
                      >
                        <div className="text-sonora-earth">{cmd.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-sonora-bark">{cmd.label}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {groupedCommands.content.length > 0 && (
                <div>
                  <div className="px-3 py-1.5 text-xs font-semibold text-sonora-stone uppercase tracking-wider">
                    Content
                  </div>
                  {groupedCommands.content.map(cmd => {
                    const index = globalIndex++;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => { cmd.action(); onClose(); }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-calm
                          ${index === selectedIndex ? 'bg-sonora-warm' : 'hover:bg-sonora-warm/50'}`}
                      >
                        <div className="text-sonora-earth">{cmd.icon}</div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm text-sonora-bark">{cmd.label}</div>
                          {cmd.description && (
                            <div className="text-xs text-sonora-stone truncate">{cmd.description}</div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-sonora-sand bg-sonora-warm/50 text-xs text-sonora-stone">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-sonora-cream border border-sonora-sand rounded">↑↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-sonora-cream border border-sonora-sand rounded">↵</kbd>
              Select
            </span>
          </div>
          <span>{filteredCommands.length} results</span>
        </div>
      </div>
    </div>
  );
}
