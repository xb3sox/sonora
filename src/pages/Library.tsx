import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { playlists, albums, tracks } from '../data';
import { View } from '../types';
import { 
  Play, Music2, Disc3, Heart, Clock, 
  ListMusic, Grid3X3, List
} from 'lucide-react';

interface LibraryPageProps {
  onNavigate: (view: View, id?: string) => void;
}

export function LibraryPage({ onNavigate }: LibraryPageProps) {
  const { play, playAlbum } = usePlayer();
  const [tab, setTab] = useState<'playlists' | 'albums' | 'tracks' | 'liked'>('playlists');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const tabs = [
    { id: 'playlists' as const, label: 'Playlists', icon: <ListMusic size={16} /> },
    { id: 'albums' as const, label: 'Albums', icon: <Disc3 size={16} /> },
    { id: 'tracks' as const, label: 'Tracks', icon: <Music2 size={16} /> },
    { id: 'liked' as const, label: 'Liked', icon: <Heart size={16} /> },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-semibold text-sonora-bark mb-1">Your Library</h1>
          <p className="text-sonora-stone text-sm">Your music, organized your way.</p>
        </div>
        <div className="flex items-center gap-1 bg-sonora-warm rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-calm ${viewMode === 'grid' ? 'bg-sonora-bark text-sonora-cream' : 'text-sonora-stone'}`}
          >
            <Grid3X3 size={16} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-md transition-calm ${viewMode === 'list' ? 'bg-sonora-bark text-sonora-cream' : 'text-sonora-stone'}`}
          >
            <List size={16} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 border-b border-sonora-sand pb-3">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-calm
              ${tab === t.id
                ? 'bg-sonora-warm text-sonora-bark'
                : 'text-sonora-stone hover:text-sonora-earth'
              }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === 'playlists' && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
          {playlists.map(playlist => (
            <button
              key={playlist.id}
              onClick={() => onNavigate('playlist', playlist.id)}
              className={viewMode === 'grid' 
                ? 'group text-left' 
                : 'flex items-center gap-3 p-3 rounded-lg hover:bg-sonora-warm transition-calm w-full text-left'
              }
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-sonora-accent/20 to-sonora-sage/20 mb-3 flex items-center justify-center relative overflow-hidden">
                    <Music2 size={28} className="text-sonora-earth" />
                    <div className="absolute inset-0 bg-sonora-bark/0 group-hover:bg-sonora-bark/10 transition-calm flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-sonora-bark text-sonora-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-calm">
                        <Play size={16} className="ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-sonora-bark truncate">{playlist.name}</p>
                  <p className="text-xs text-sonora-stone">{playlist.tracks.length} tracks</p>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded bg-sonora-sand flex-shrink-0 flex items-center justify-center">
                    <Music2 size={16} className="text-sonora-earth" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sonora-bark truncate">{playlist.name}</p>
                    <p className="text-xs text-sonora-stone">{playlist.tracks.length} tracks</p>
                  </div>
                  <Play size={14} className="text-sonora-stone opacity-0 group-hover:opacity-100 transition-calm" />
                </>
              )}
            </button>
          ))}
        </div>
      )}

      {tab === 'albums' && (
        <div className={viewMode === 'grid' ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4' : 'space-y-2'}>
          {albums.map(album => (
            <button
              key={album.id}
              onClick={() => onNavigate('album', album.id)}
              className={viewMode === 'grid'
                ? 'group text-left'
                : 'flex items-center gap-3 p-3 rounded-lg hover:bg-sonora-warm transition-calm w-full text-left'
              }
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-sonora-sand to-sonora-mist mb-3 flex items-center justify-center relative overflow-hidden">
                    <Disc3 size={28} className="text-sonora-stone" />
                    <div className="absolute inset-0 bg-sonora-bark/0 group-hover:bg-sonora-bark/10 transition-calm flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-sonora-bark text-sonora-cream flex items-center justify-center opacity-0 group-hover:opacity-100 transition-calm">
                        <Play size={16} className="ml-0.5" />
                      </div>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-sonora-bark truncate">{album.title}</p>
                  <p className="text-xs text-sonora-stone">{album.artist} · {album.year}</p>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 rounded bg-sonora-sand flex-shrink-0 flex items-center justify-center">
                    <Disc3 size={16} className="text-sonora-earth" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-sonora-bark truncate">{album.title}</p>
                    <p className="text-xs text-sonora-stone">{album.artist} · {album.year}</p>
                  </div>
                  <Play size={14} className="text-sonora-stone opacity-0 group-hover:opacity-100 transition-calm" />
                </>
              )}
            </button>
          ))}
        </div>
      )}

      {tab === 'tracks' && (
        <div className="space-y-1">
          {tracks.map((track, i) => (
            <button
              key={track.id}
              onClick={() => play(track)}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-sonora-warm transition-calm group text-left"
            >
              <span className="w-6 text-center text-xs text-sonora-stone group-hover:hidden">{i + 1}</span>
              <Play size={14} className="w-6 text-center text-sonora-bark hidden group-hover:block" />
              <div className="w-9 h-9 rounded bg-sonora-sand flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-sonora-bark truncate">{track.title}</p>
                <p className="text-xs text-sonora-stone truncate">{track.artist}</p>
              </div>
              <span className="text-xs text-sonora-stone hidden md:block">{track.album}</span>
              <span className="text-xs text-sonora-stone flex items-center gap-1">
                <Clock size={12} />
                {Math.floor(track.duration / 60)}:{(track.duration % 60).toString().padStart(2, '0')}
              </span>
            </button>
          ))}
        </div>
      )}

      {tab === 'liked' && (
        <div className="text-center py-16">
          <Heart size={40} className="text-sonora-sand mx-auto mb-4" />
          <p className="text-sonora-stone text-sm">Tracks you love will appear here.</p>
          <p className="text-sonora-stone text-xs mt-1">Tap the heart icon on any track to save it.</p>
        </div>
      )}
    </div>
  );
}
