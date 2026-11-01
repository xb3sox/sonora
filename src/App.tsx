import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { PlayerProvider, usePlayer } from './context/PlayerContext';
import { FollowProvider } from './context/FollowContext';
import { PlayCountProvider, usePlayCount } from './context/PlayCountContext';
import { PlaylistProvider } from './context/PlaylistContext';
import { useMediaSession } from './hooks/useMediaSession';
import { useDocumentTitle } from './hooks/useDocumentTitle';
import { usePlaybackHistory } from './hooks/usePlaybackHistory';
import { Sidebar } from './components/Sidebar';
import { PlayerBar } from './components/Player';
import { MobileNav } from './components/MobileNav';
import { ToastContainer } from './components/Toast';
import { QueueView } from './components/QueueView';
import { Welcome } from './components/Welcome';
import { SleepTimer } from './components/SleepTimer';
import { AudioSettings } from './components/AudioSettings';
import { ShareModal } from './components/ShareModal';
import { KeyboardShortcuts, useKeyboardShortcuts } from './components/KeyboardShortcuts';
import { LyricsView } from './components/LyricsView';
import { CreatePlaylistModal } from './components/CreatePlaylistModal';
import { NowPlayingView } from './components/NowPlayingView';
import { TipArtistModal } from './components/TipArtistModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { OfflineIndicator } from './components/OfflineIndicator';
import { ArtistRadio } from './components/ArtistRadio';
import { CreditsModal } from './components/CreditsModal';
import { ImportModal } from './components/ImportModal';
import { HomePage } from './pages/Home';
import { ExplorePage } from './pages/Explore';
import { LibraryPage } from './pages/Library';
import { SearchPage } from './pages/Search';
import { ArtistPage } from './pages/Artist';
import { ArtistStoryPage } from './pages/ArtistStory';
import { AlbumPage } from './pages/Album';
import { PlaylistPage } from './pages/Playlist';
import { DeepListeningPage } from './pages/DeepListening';
import { SettingsPage } from './pages/Settings';
import { StatsPage } from './pages/Stats';
import { HistoryPage } from './pages/History';
import { ProfilePage } from './pages/Profile';
import { HelpPage } from './pages/Help';
import { CommandPalette } from './components/CommandPalette';
import { View } from './types';
import { artists } from './data';

function AppContent() {
  const [hasOnboarded, setHasOnboarded] = useState(() => {
    try {
      return localStorage.getItem('sonora-onboarded') === 'true';
    } catch {
      return false;
    }
  });
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // Modals
  const [sleepTimerOpen, setSleepTimerOpen] = useState(false);
  const [audioSettingsOpen, setAudioSettingsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [createPlaylistOpen, setCreatePlaylistOpen] = useState(false);
  const [nowPlayingOpen, setNowPlayingOpen] = useState(false);
  const [tipArtistOpen, setTipArtistOpen] = useState(false);
  const [tipArtistId, setTipArtistId] = useState<string | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [artistRadioOpen, setArtistRadioOpen] = useState(false);
  const [artistRadioId, setArtistRadioId] = useState<string | null>(null);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  
  // Initialize Media Session API and document title updates
  useMediaSession();
  useDocumentTitle();
  
  const { 
    state, showQueue, setShowQueue, togglePlay, next, previous, 
    setVolume, toggleShuffle, toggleRepeat, toggleFavorite 
  } = usePlayer();
  const { incrementPlayCount } = usePlayCount();
  const { addToHistory } = usePlaybackHistory();

  // Increment play count and add to history when track changes
  useEffect(() => {
    if (state.currentTrack) {
      incrementPlayCount(state.currentTrack.id);
      addToHistory(state.currentTrack);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentTrack?.id]);

  const handleNavigate = useCallback((view: View, id?: string) => {
    setCurrentView(view);
    setSelectedId(id);
    setSidebarOpen(false);
  }, []);

  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);

  // Command palette shortcut (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Keyboard shortcuts
  const shortcutHandlers = useMemo(() => ({
    onTogglePlay: () => { if (state.currentTrack) togglePlay(); },
    onNext: () => next(),
    onPrevious: () => previous(),
    onVolumeUp: () => setVolume(Math.min(1, state.volume + 0.1)),
    onVolumeDown: () => setVolume(Math.max(0, state.volume - 0.1)),
    onMute: () => setVolume(state.volume === 0 ? 0.75 : 0),
    onLike: () => { if (state.currentTrack) toggleFavorite(state.currentTrack.id); },
    onShuffle: () => toggleShuffle(),
    onRepeat: () => toggleRepeat(),
    onQueue: () => setShowQueue(!showQueue),
    onDeepListening: () => handleNavigate('deep-listening'),
    onFocusSearch: () => handleNavigate('search'),
    onShowHelp: () => {},
    onClose: () => {
      setSleepTimerOpen(false);
      setAudioSettingsOpen(false);
      setShareOpen(false);
      setLyricsOpen(false);
      setCreatePlaylistOpen(false);
      setNowPlayingOpen(false);
      setTipArtistOpen(false);
      setCommandPaletteOpen(false);
      setShowQueue(false);
    },
  }), [state, showQueue, togglePlay, next, previous, setVolume, toggleShuffle, toggleRepeat, toggleFavorite, setShowQueue, handleNavigate]);

  const { showHelp, setShowHelp } = useKeyboardShortcuts(shortcutHandlers);

  const handleCompleteOnboarding = useCallback(() => {
    setHasOnboarded(true);
    try {
      localStorage.setItem('sonora-onboarded', 'true');
    } catch {
      // ignore
    }
  }, []);

  // Welcome screen
  if (!hasOnboarded) {
    return <Welcome onComplete={handleCompleteOnboarding} />;
  }

  const renderPage = () => {
    switch (currentView) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'explore':
        return <ExplorePage onNavigate={handleNavigate} />;
      case 'library':
        return <LibraryPage onNavigate={handleNavigate} onOpenCreatePlaylist={() => setCreatePlaylistOpen(true)} />;
      case 'search':
        return <SearchPage onNavigate={handleNavigate} />;
      case 'artist':
        return <ArtistPage 
          artistId={selectedId || ''} 
          onNavigate={handleNavigate}
          onTipArtist={(id) => { setTipArtistId(id); setTipArtistOpen(true); }}
          onOpenArtistRadio={(id) => { setArtistRadioId(id); setArtistRadioOpen(true); }}
        />;
      case 'artist-story':
        return <ArtistStoryPage artistId={selectedId || ''} onNavigate={handleNavigate} />;
      case 'album':
        return <AlbumPage albumId={selectedId || ''} onNavigate={handleNavigate} />;
      case 'playlist':
        return <PlaylistPage playlistId={selectedId || ''} onNavigate={handleNavigate} />;
      case 'deep-listening':
        return <DeepListeningPage onNavigate={handleNavigate} onOpenLyrics={() => setLyricsOpen(true)} />;
      case 'settings':
        return <SettingsPage onOpenImport={() => setImportOpen(true)} />;
      case 'stats':
        return <StatsPage />;
      case 'history':
        return <HistoryPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage />;
      case 'help':
        return <HelpPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  // Deep Listening has its own full-screen layout
  if (currentView === 'deep-listening') {
    return (
      <div className="h-screen flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <DeepListeningPage onNavigate={handleNavigate} onOpenLyrics={() => setLyricsOpen(true)} />
        </div>
        <ToastContainer />
        <KeyboardShortcuts isOpen={showHelp} onClose={() => setShowHelp(false)} />
        <LyricsView 
          isOpen={lyricsOpen} 
          onClose={() => setLyricsOpen(false)} 
          track={state.currentTrack}
          progress={state.progress}
        />
      </div>
    );
  }

  return (
    <>
      {/* Accessibility: Skip to content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-sonora-bark focus:text-sonora-cream focus:rounded-lg focus:text-sm"
      >
        Skip to content
      </a>
      <div className="h-screen flex flex-col overflow-hidden bg-sonora-cream">
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar (desktop) */}
          <Sidebar 
            currentView={currentView} 
            onNavigate={handleNavigate}
            isOpen={sidebarOpen}
            onToggle={toggleSidebar}
          />
          
          {/* Main Content */}
          <main id="main-content" className="flex-1 overflow-y-auto pb-16 lg:pb-0">
            {renderPage()}
          </main>
        </div>
        
        {/* Mobile Bottom Nav */}
        <MobileNav currentView={currentView} onNavigate={handleNavigate} />
        
        {/* Player Bar */}
        <PlayerBar 
          onDeepListening={() => handleNavigate('deep-listening')}
          onOpenSleepTimer={() => setSleepTimerOpen(true)}
          onOpenAudioSettings={() => setAudioSettingsOpen(true)}
          onOpenShare={() => setShareOpen(true)}
          onOpenNowPlaying={() => setNowPlayingOpen(true)}
          onOpenLyrics={() => setLyricsOpen(true)}
        />
        
        {/* Modals & Overlays */}
        <ToastContainer />
        {showQueue && <QueueView onClose={() => setShowQueue(false)} />}
        <SleepTimer isOpen={sleepTimerOpen} onClose={() => setSleepTimerOpen(false)} />
        <AudioSettings isOpen={audioSettingsOpen} onClose={() => setAudioSettingsOpen(false)} />
        <ShareModal 
          isOpen={shareOpen} 
          onClose={() => setShareOpen(false)} 
          track={state.currentTrack} 
        />
        <LyricsView 
          isOpen={lyricsOpen} 
          onClose={() => setLyricsOpen(false)} 
          track={state.currentTrack}
          progress={state.progress}
        />
        <CreatePlaylistModal 
          isOpen={createPlaylistOpen}
          onClose={() => setCreatePlaylistOpen(false)}
        />
        <NowPlayingView 
          isOpen={nowPlayingOpen}
          onClose={() => setNowPlayingOpen(false)}
          onOpenQueue={() => { setNowPlayingOpen(false); setShowQueue(true); }}
          onOpenLyrics={() => { setNowPlayingOpen(false); setLyricsOpen(true); }}
          onOpenCredits={() => { setNowPlayingOpen(false); setCreditsOpen(true); }}
        />
        <CreditsModal
          isOpen={creditsOpen}
          onClose={() => setCreditsOpen(false)}
          track={state.currentTrack}
        />
        <ImportModal
          isOpen={importOpen}
          onClose={() => setImportOpen(false)}
        />
        <TipArtistModal
          isOpen={tipArtistOpen}
          onClose={() => setTipArtistOpen(false)}
          artist={tipArtistId ? artists.find(a => a.id === tipArtistId) || null : null}
        />
        <KeyboardShortcuts isOpen={showHelp} onClose={() => setShowHelp(false)} />
        <CommandPalette 
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
          onNavigate={handleNavigate}
        />
        {artistRadioOpen && artistRadioId && (
          <ArtistRadio
            artistId={artistRadioId}
            onClose={() => setArtistRadioOpen(false)}
          />
        )}
        <OfflineIndicator />
      </div>
    </>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <PlayerProvider>
        <FollowProvider>
          <PlayCountProvider>
            <PlaylistProvider>
              <AppContent />
            </PlaylistProvider>
          </PlayCountProvider>
        </FollowProvider>
      </PlayerProvider>
    </ErrorBoundary>
  );
}
