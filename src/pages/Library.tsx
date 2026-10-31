import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { playlists, albums, tracks } from '../data';
import { View } from '../types';
import { AlbumArt } from '../components/AlbumArt';
import { TrackRow } from '../components/TrackRow';
import { 
  Play, Music2, Disc3, Heart, 
  ListMusic, Grid3X3, List
} from 'lucide-react';

interface LibraryPageProps {
  onNavigate: (view: View, id?: string) => void;
}

export function LibraryPage({ onNavigate }: LibraryPageProps) {
  const { play, playAlbum, favorites } = usePlayer();
  const [tab, setTab] = useState<'playlists' | 'albums' | 'tracks' | 'liked'>('playlists');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const tabs = [
    { id: 'playlists' as const, label: 'Playlists', icon: <ListMusic size={16} /> },
    { id: 'albums' as const, label: 'Albums', icon: <Disc3 size={16} /> },
    { id: 'tracks' as const, label: 'Tracks', icon: <Music2 size={16} /> },
    { id: 'liked' as const, label: 'Liked', icon: <Heart size={16} /> },
  ];

  const likedTracks = tracks.filter(t => favorites.has(t.id));

  return (
    <div className="p-6 sm:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 pt-8 sm:pt-0">
        <div>
          <h1 className="font-display text-3xl font-semibold text-sonora-bark mb-1">Your Library</h1>
          <p className="text-sonora-stone text-sm">Your music, organized your way.</p>
        </div>
        <div className="hidden sm:flex items-center gap-1 bg-sonora-warm rounded-lg p-1">
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
      <div className="flex items-center gap-1 mb-6 border-b border-sonora-sand pb-3 overflow-x-auto">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-calm whitespace-nowrap
              ${tab === t.id
                ? 'bg-sonora-warm text-sonora-bark'
                : 'text-sonora-stone hover:text-sonora-earth'
              }`}
          >
            {t.icon}
            {t.label}
            {t.id === 'liked' && favorites.size > 0 && (
              <span className="text-[10px] bg-sonora-accent/20 text-sonora-accent px-1.5 py-0.5 rounded-full">
                {favorites.size}
              </span>
            )}
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
                  <div className="aspect-square rounded-xl mb-3 relative overflow-hidden shadow-md">
                    <AlbumArt type="playlist" id={playlist.id} size="xl" className="w-full h-full" />
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
                  <AlbumArt type="playlist" id={playlist.id} size="md" />
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
                  <div className="aspect-square rounded-xl mb-3 relative overflow-hidden shadow-md">
                    <AlbumArt type="album" id={album.id} size="xl" className="w-full h-full" />
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
                  <AlbumArt type="album" id={album.id} size="md" />
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
        <div className="space-y-0.5">
          {tracks.map((track, i) => (
            <TrackRow 
              key={track.id} 
              track={track} 
              index={i}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}

      {tab === 'liked' && (
        likedTracks.length > 0 ? (
          <div className="space-y-0.5">
            {likedTracks.map((track, i) => (
              <TrackRow 
                key={track.id} 
                track={track} 
                index={i}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart size={40} className="text-sonora-sand mx-auto mb-4" />
            <p className="text-sonora-stone text-sm">Tracks you love will appear here.</p>
            <p className="text-sonora-stone/60 text-xs mt-1">Tap the heart icon on any track to save it.</p>
          </div>
        )
      )}
    </div>
  );
}
