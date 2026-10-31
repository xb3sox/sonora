import React, { useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import { Sidebar } from './components/Sidebar';
import { PlayerBar } from './components/Player';
import { HomePage } from './pages/Home';
import { ExplorePage } from './pages/Explore';
import { LibraryPage } from './pages/Library';
import { SearchPage } from './pages/Search';
import { ArtistPage } from './pages/Artist';
import { AlbumPage } from './pages/Album';
import { PlaylistPage } from './pages/Playlist';
import { DeepListeningPage } from './pages/DeepListening';
import { SettingsPage } from './pages/Settings';
import { View } from './types';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const handleNavigate = (view: View, id?: string) => {
    setCurrentView(view);
    setSelectedId(id);
  };

  const renderPage = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'explore':
        return <ExplorePage onNavigate={handleNavigate} />;
      case 'library':
        return <LibraryPage onNavigate={handleNavigate} />;
      case 'search':
        return <SearchPage onNavigate={handleNavigate} />;
      case 'artist':
        return <ArtistPage artistId={selectedId || ''} onNavigate={handleNavigate} />;
      case 'album':
        return <AlbumPage albumId={selectedId || ''} onNavigate={handleNavigate} />;
      case 'playlist':
        return <PlaylistPage playlistId={selectedId || ''} onNavigate={handleNavigate} />;
      case 'deep-listening':
        return <DeepListeningPage onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  // Deep Listening has its own full-screen layout
  if (currentView === 'deep-listening') {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <DeepListeningPage onNavigate={handleNavigate} />
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-sonora-cream">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar currentView={currentView} onNavigate={handleNavigate} />
        
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
      
      {/* Player Bar */}
      <PlayerBar onDeepListening={() => handleNavigate('deep-listening')} />
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
}
