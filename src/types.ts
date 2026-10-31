export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  album: string;
  albumId: string;
  duration: number; // seconds
  cover: string;
  year: number;
  genre: string;
  lossless: boolean;
  credits: TrackCredits;
}

export interface TrackCredits {
  producer?: string;
  engineer?: string;
  songwriter?: string[];
  label?: string;
  recorded?: string;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  cover: string;
  year: number;
  tracks: string[];
  genre: string;
  description?: string;
}

export interface Artist {
  id: string;
  name: string;
  bio: string;
  image: string;
  albums: string[];
  genres: string[];
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: string[];
  cover: string;
  isUserCreated?: boolean;
}

export interface DiscoveryRecommendation {
  track: Track;
  reason: string;
  intent: string;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  queue: Track[];
  shuffle: boolean;
  repeat: 'off' | 'one' | 'all';
}

export type View = 'home' | 'explore' | 'library' | 'search' | 'artist' | 'album' | 'playlist' | 'deep-listening' | 'settings' | 'stats';
