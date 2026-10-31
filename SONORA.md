# Sonora - Music Platform Documentation

## Overview
Sonora is a production-ready music platform that helps listeners discover less and love more through calm design, intelligent discovery, and deeper artist connections.

## Core Features

### 🎵 Music Playback
- Full-featured player with play/pause, skip, seek, volume control
- Queue management with drag-to-reorder
- Shuffle and repeat modes
- Lossless audio support (24-bit/96kHz)
- Crossfade and gapless playback settings
- Equalizer with presets (Flat, Warm, Bright, Vocal, Bass Boost, Classical)

### 🎨 Visual Design
- Calm, warm color palette (cream, sand, earth tones)
- Unique gradient album art for every track, album, playlist, and artist
- Smooth animations and transitions
- Responsive design (desktop, tablet, mobile)
- Dark mode for Deep Listening

### 📱 User Interface
- **Home**: Time-based greetings, quick play grid, recommendations, recent albums
- **Explore**: Intent-based discovery with explanations, genre browsing
- **Library**: Playlists, albums, tracks, liked songs with sort/filter
- **Search**: Full-text search with quick suggestions
- **History**: Playback history grouped by day
- **Stats**: Listening statistics, top genres/artists, patterns

### 🎭 Deep Artist Connections
- **Artist Stories**: Liner notes, interviews, timeline milestones, influences
- **Follow Artists**: Stay updated with artists you love
- **Tip Artists**: Direct financial support with custom amounts and messages
- **Related Artists**: Discover connected musicians
- **Transparent Credits**: Full production credits for every track

### 🎧 Deep Listening Mode
- Distraction-free full-screen experience
- Synchronized lyrics display
- Ambient dark theme
- Minimal controls
- Credits overlay

### 📋 Playlists
- Create custom playlists
- Add tracks to existing playlists
- Grid and list view modes
- Sort by title, artist, album, duration

### 🔍 Discovery
- Explainable recommendations with intent tags
- "Why we recommended this" explanations
- Genre-based browsing
- Artist connection suggestions

### ⌨️ Keyboard Shortcuts
- Space: Play/Pause
- Arrow keys: Navigate tracks/volume
- L: Like/unlike
- S: Shuffle
- R: Repeat
- Q: Toggle queue
- D: Deep Listening
- /: Focus search
- ?: Show shortcuts

### 📲 Mobile Features
- Bottom navigation bar
- Now Playing full-screen view with swipe-to-dismiss
- Touch-optimized controls
- Responsive sidebar

### 🔒 Privacy & Settings
- Granular privacy controls
- Local data processing
- Audio quality selection
- Offline mode toggle
- Import from other services (Spotify, Apple Music, YouTube Music, Tidal)
- Export data

### 💡 Additional Features
- **Sleep Timer**: Auto-pause after set duration
- **Share**: Copy link, share on X, email
- **Offline Indicator**: Connection status awareness
- **Play Count Tracking**: See how many times you've played each track
- **Loading Skeletons**: Perceived performance optimization
- **Error Boundary**: Graceful error handling
- **Toast Notifications**: Non-intrusive feedback

## Architecture

### State Management
- **PlayerContext**: Playback state, queue, favorites
- **FollowContext**: Artist follow relationships
- **PlayCountContext**: Track play counts

### Component Structure
```
src/
├── components/
│   ├── AlbumArt.tsx          # Gradient-based artwork
│   ├── AudioSettings.tsx     # EQ, crossfade, playback options
│   ├── CreatePlaylistModal.tsx
│   ├── ErrorBoundary.tsx     # Production error handling
│   ├── FollowButton.tsx      # Artist follow UI
│   ├── KeyboardShortcuts.tsx # Shortcut help modal
│   ├── LyricsView.tsx        # Synchronized lyrics
│   ├── MobileNav.tsx         # Bottom navigation
│   ├── NowPlayingView.tsx    # Full-screen player
│   ├── OfflineIndicator.tsx  # Connection status
│   ├── Player.tsx            # Main player bar
│   ├── QueueView.tsx         # Queue management
│   ├── ShareModal.tsx        # Share options
│   ├── Sidebar.tsx           # Desktop navigation
│   ├── Skeleton.tsx          # Loading states
│   ├── SleepTimer.tsx        # Auto-pause timer
│   ├── TipArtistModal.tsx    # Artist support
│   ├── TipButton.tsx         # Tip trigger
│   ├── Toast.tsx             # Notifications
│   ├── TrackRow.tsx          # Track list item
│   └── Welcome.tsx           # Onboarding flow
├── context/
│   ├── PlayerContext.tsx
│   ├── FollowContext.tsx
│   └── PlayCountContext.tsx
├── pages/
│   ├── Album.tsx
│   ├── Artist.tsx
│   ├── ArtistStory.tsx
│   ├── DeepListening.tsx
│   ├── Explore.tsx
│   ├── History.tsx
│   ├── Home.tsx
│   ├── Library.tsx
│   ├── Playlist.tsx
│   ├── Search.tsx
│   ├── Settings.tsx
│   └── Stats.tsx
├── data.ts                   # Mock data with gradients
├── types.ts                  # TypeScript interfaces
└── App.tsx                   # Main app with routing
```

### Design System
- **Colors**: Warm, earthy palette (cream, sand, stone, earth, bark, accent)
- **Typography**: Playfair Display (headings), Inter (body)
- **Animations**: Calm transitions (0.3s cubic-bezier)
- **Spacing**: Consistent 8px grid
- **Border Radius**: Rounded corners (8px-16px)

## Technical Stack
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Context API** for state management
- **No external dependencies** for core functionality

## Performance
- Bundle size: ~81KB gzipped
- Code splitting by route
- Lazy loading for modals
- Optimized animations
- Skeleton loading states

## Accessibility
- Skip to content link
- Keyboard navigation
- ARIA labels
- Focus indicators
- Screen reader friendly
- Color contrast compliance

## Privacy Features
- Local data processing
- No third-party tracking
- Granular privacy controls
- Data export capability
- Transparent data usage

## Artist Support
- Direct tipping (100% to artist minus fees)
- Follow system for updates
- Story/liner notes for deeper connection
- Transparent credits
- Related artist discovery

## Future Enhancements
- Real API integration
- Social features (shared playlists, listening sessions)
- Podcasts and audiobooks
- Live concert integration
- Merchandise support
- User uploads
- Collaborative playlists
- AI-powered recommendations

## Development Workflow
1. **Validate**: User research and requirements
2. **Plan**: Architecture and design decisions
3. **Design**: UI/UX with calm aesthetics
4. **Prototype**: Quick iterations
5. **Build**: Component development
6. **Test**: Accessibility and performance
7. **Deploy**: Production deployment
8. **Measure**: Analytics and feedback
9. **Improve**: Continuous iteration

## License
Proprietary - Sonora Music Platform

---

Built with care for listeners who want to discover less and love more.

## Latest Updates (v1.2)
- **Media Session API**: OS-level playback controls (lock screen, notifications, Bluetooth)
- **Audio Visualizer**: Beautiful real-time waveform visualization in Deep Listening
- **Artist Radio**: Smart stations based on any artist with auto-advance
- **Playback Speed Control**: 0.5x to 2x speed adjustment for practice/learning
- **Search Filters**: Filter results by tracks, albums, or artists with counts
- **Audio Quality Indicator**: Visual feedback showing current streaming quality
- **Browser Tab Updates**: Dynamic tab titles showing current track
- **Command Palette** (Cmd/Ctrl+K): Power user feature for quick navigation
- **Local Storage Persistence**: Favorites and preferences survive page reloads
- **Profile Page**: User account management with data export/import
- **Help Page**: Comprehensive FAQ, keyboard shortcuts, and support contacts
- **Enhanced Error Handling**: Production-ready error boundaries
- **Offline Detection**: Visual indicators for connection status
- **Loading Skeletons**: Improved perceived performance
- **Artist Support**: Tipping and follow functionality
- **Play Count Tracking**: See your listening history per track
- **Mobile Now Playing**: Full-screen player with swipe gestures

## Architecture Highlights
- **40+ Components**: Modular, reusable UI components
- **3 Context Providers**: Player, Follow, PlayCount state management
- **Custom Hooks**: useLocalStorage, useSessionStorage, useMediaSession, useDocumentTitle
- **Type-Safe**: Full TypeScript coverage across all files
- **Zero Dependencies**: Everything built in-house for maximum control
- **Canvas Visualizations**: Hardware-accelerated audio visualizations
- **Browser APIs**: Media Session, LocalStorage, Canvas, requestAnimationFrame
- **Progressive Enhancement**: Features gracefully degrade on older browsers
