import { Track, Album, Artist, Playlist, DiscoveryRecommendation } from './types';

// Unique gradient palettes for each album
const albumGradients: Record<string, string> = {
  al1: 'from-[#C4B5A0] via-[#A89888] to-[#8B7D6B]',   // Warm taupe
  al2: 'from-[#B8C5A0] via-[#96A87A] to-[#7A8B60]',   // Sage green
  al3: 'from-[#7A9BB5] via-[#5A7D96] to-[#3D5F78]',   // Deep ocean
  al4: 'from-[#D4A88C] via-[#C49070] to-[#A87050]',   // Warm terracotta
};

// Unique gradient palettes for each track (derived from album but with variation)
const trackGradients: Record<string, string> = {
  t1: 'from-[#D4C5B0] via-[#C4B5A0] to-[#B8A890]',
  t2: 'from-[#C4B5A0] via-[#B0A090] to-[#9B8B78]',
  t3: 'from-[#B8A890] via-[#A89888] to-[#988878]',
  t4: 'from-[#C8D5B0] via-[#B8C5A0] to-[#A0B088]',
  t5: 'from-[#B8C5A0] via-[#A0B088] to-[#889870]',
  t6: 'from-[#8AABC5] via-[#7A9BB5] to-[#6A8BA5]',
  t7: 'from-[#7A9BB5] via-[#6A8BA5] to-[#5A7B95]',
  t8: 'from-[#E4B89C] via-[#D4A88C] to-[#C4987C]',
  t9: 'from-[#D4A88C] via-[#C4987C] to-[#B4886C]',
  t10: 'from-[#C4B5A0] via-[#A89888] to-[#8B7D6B]',
  t11: 'from-[#A0B088] via-[#96A87A] to-[#7A8B60]',
  t12: 'from-[#6A8BA5] via-[#5A7D96] to-[#3D5F78]',
};

// Playlist gradients
const playlistGradients: Record<string, string> = {
  p1: 'from-[#E8D5C0] via-[#D4C0A8] to-[#C0AB90]',  // Morning warmth
  p2: 'from-[#A0B8C0] via-[#88A0A8] to-[#708890]',  // Cool focus
  p3: 'from-[#C0A8D0] via-[#A890B8] to-[#9078A0]',  // Evening purple
  p4: 'from-[#B8D0A0] via-[#A0B888] to-[#88A070]',  // Fresh discovery
};

// Artist gradients
const artistGradients: Record<string, string> = {
  a1: 'from-[#C4B5A0] via-[#A89888] to-[#8B7D6B]',
  a2: 'from-[#B8C5A0] via-[#96A87A] to-[#7A8B60]',
  a3: 'from-[#7A9BB5] via-[#5A7D96] to-[#3D5F78]',
  a4: 'from-[#D4A88C] via-[#C49070] to-[#A87050]',
};

export function getAlbumGradient(albumId: string): string {
  return albumGradients[albumId] || 'from-sonora-sand to-sonora-mist';
}

export function getTrackGradient(trackId: string): string {
  return trackGradients[trackId] || 'from-sonora-sand to-sonora-mist';
}

export function getPlaylistGradient(playlistId: string): string {
  return playlistGradients[playlistId] || 'from-sonora-sand to-sonora-mist';
}

export function getArtistGradient(artistId: string): string {
  return artistGradients[artistId] || 'from-sonora-sand to-sonora-mist';
}

export const tracks: Track[] = [
  {
    id: 't1',
    title: 'Morning Light',
    artist: 'Elena Voss',
    artistId: 'a1',
    album: 'Quiet Hours',
    albumId: 'al1',
    duration: 245,
    cover: '',
    year: 2024,
    genre: 'Ambient',
    lossless: true,
    credits: {
      producer: 'Elena Voss',
      engineer: 'Marcus Chen',
      songwriter: ['Elena Voss'],
      label: 'Stillwater Records',
      recorded: 'Portland, OR — 2023'
    }
  },
  {
    id: 't2',
    title: 'River Bend',
    artist: 'Elena Voss',
    artistId: 'a1',
    album: 'Quiet Hours',
    albumId: 'al1',
    duration: 312,
    cover: '',
    year: 2024,
    genre: 'Ambient',
    lossless: true,
    credits: {
      producer: 'Elena Voss',
      engineer: 'Marcus Chen',
      songwriter: ['Elena Voss', 'James Okafor'],
      label: 'Stillwater Records',
      recorded: 'Portland, OR — 2023'
    }
  },
  {
    id: 't3',
    title: 'Still Waters',
    artist: 'Elena Voss',
    artistId: 'a1',
    album: 'Quiet Hours',
    albumId: 'al1',
    duration: 198,
    cover: '',
    year: 2024,
    genre: 'Ambient',
    lossless: true,
    credits: {
      producer: 'Elena Voss',
      engineer: 'Marcus Chen',
      songwriter: ['Elena Voss'],
      label: 'Stillwater Records',
      recorded: 'Portland, OR — 2023'
    }
  },
  {
    id: 't4',
    title: 'Golden Hour',
    artist: 'The Wandering Collective',
    artistId: 'a2',
    album: 'Fields of Light',
    albumId: 'al2',
    duration: 278,
    cover: '',
    year: 2023,
    genre: 'Folk',
    lossless: true,
    credits: {
      producer: 'Sarah Lindqvist',
      engineer: 'Tom Reeves',
      songwriter: ['The Wandering Collective'],
      label: 'Meadow Music',
      recorded: 'Copenhagen — 2022'
    }
  },
  {
    id: 't5',
    title: 'Harvest Moon Rising',
    artist: 'The Wandering Collective',
    artistId: 'a2',
    album: 'Fields of Light',
    albumId: 'al2',
    duration: 345,
    cover: '',
    year: 2023,
    genre: 'Folk',
    lossless: true,
    credits: {
      producer: 'Sarah Lindqvist',
      engineer: 'Tom Reeves',
      songwriter: ['The Wandering Collective', 'Nina Kowalski'],
      label: 'Meadow Music',
      recorded: 'Copenhagen — 2022'
    }
  },
  {
    id: 't6',
    title: 'Paper Boats',
    artist: 'Kai Nomura',
    artistId: 'a3',
    album: 'Tidal Patterns',
    albumId: 'al3',
    duration: 267,
    cover: '',
    year: 2024,
    genre: 'Electronic',
    lossless: true,
    credits: {
      producer: 'Kai Nomura',
      engineer: 'Kai Nomura',
      songwriter: ['Kai Nomura'],
      label: 'Wave Theory',
      recorded: 'Tokyo — 2024'
    }
  },
  {
    id: 't7',
    title: 'Deep Current',
    artist: 'Kai Nomura',
    artistId: 'a3',
    album: 'Tidal Patterns',
    albumId: 'al3',
    duration: 389,
    cover: '',
    year: 2024,
    genre: 'Electronic',
    lossless: true,
    credits: {
      producer: 'Kai Nomura',
      engineer: 'Kai Nomura',
      songwriter: ['Kai Nomura', 'Yuki Tanaka'],
      label: 'Wave Theory',
      recorded: 'Tokyo — 2024'
    }
  },
  {
    id: 't8',
    title: 'Autumn Letters',
    artist: 'Maren Solberg',
    artistId: 'a4',
    album: 'Correspondence',
    albumId: 'al4',
    duration: 223,
    cover: '',
    year: 2023,
    genre: 'Indie Folk',
    lossless: true,
    credits: {
      producer: 'Maren Solberg',
      engineer: 'Erik Johansson',
      songwriter: ['Maren Solberg'],
      label: 'North Light',
      recorded: 'Oslo — 2023'
    }
  },
  {
    id: 't9',
    title: 'Winter Garden',
    artist: 'Maren Solberg',
    artistId: 'a4',
    album: 'Correspondence',
    albumId: 'al4',
    duration: 298,
    cover: '',
    year: 2023,
    genre: 'Indie Folk',
    lossless: true,
    credits: {
      producer: 'Maren Solberg',
      engineer: 'Erik Johansson',
      songwriter: ['Maren Solberg'],
      label: 'North Light',
      recorded: 'Oslo — 2023'
    }
  },
  {
    id: 't10',
    title: 'Slow Dance',
    artist: 'Elena Voss',
    artistId: 'a1',
    album: 'Quiet Hours',
    albumId: 'al1',
    duration: 356,
    cover: '',
    year: 2024,
    genre: 'Ambient',
    lossless: true,
    credits: {
      producer: 'Elena Voss',
      engineer: 'Marcus Chen',
      songwriter: ['Elena Voss'],
      label: 'Stillwater Records',
      recorded: 'Portland, OR — 2023'
    }
  },
  {
    id: 't11',
    title: 'Open Road',
    artist: 'The Wandering Collective',
    artistId: 'a2',
    album: 'Fields of Light',
    albumId: 'al2',
    duration: 301,
    cover: '',
    year: 2023,
    genre: 'Folk',
    lossless: true,
    credits: {
      producer: 'Sarah Lindqvist',
      engineer: 'Tom Reeves',
      songwriter: ['The Wandering Collective'],
      label: 'Meadow Music',
      recorded: 'Copenhagen — 2022'
    }
  },
  {
    id: 't12',
    title: 'Night Tides',
    artist: 'Kai Nomura',
    artistId: 'a3',
    album: 'Tidal Patterns',
    albumId: 'al3',
    duration: 412,
    cover: '',
    year: 2024,
    genre: 'Electronic',
    lossless: true,
    credits: {
      producer: 'Kai Nomura',
      engineer: 'Kai Nomura',
      songwriter: ['Kai Nomura'],
      label: 'Wave Theory',
      recorded: 'Tokyo — 2024'
    }
  }
];

export const albums: Album[] = [
  {
    id: 'al1',
    title: 'Quiet Hours',
    artist: 'Elena Voss',
    artistId: 'a1',
    cover: '',
    year: 2024,
    tracks: ['t1', 't2', 't3', 't10'],
    genre: 'Ambient',
    description: 'A meditation on stillness and the spaces between sounds. Recorded over three quiet winters in Portland.'
  },
  {
    id: 'al2',
    title: 'Fields of Light',
    artist: 'The Wandering Collective',
    artistId: 'a2',
    cover: '',
    year: 2023,
    tracks: ['t4', 't5', 't11'],
    genre: 'Folk',
    description: 'Stories of movement and belonging, woven from five years of travel across Northern Europe.'
  },
  {
    id: 'al3',
    title: 'Tidal Patterns',
    artist: 'Kai Nomura',
    artistId: 'a3',
    cover: '',
    year: 2024,
    tracks: ['t6', 't7', 't12'],
    genre: 'Electronic',
    description: 'Electronic compositions inspired by ocean rhythms and the mathematics of waves.'
  },
  {
    id: 'al4',
    title: 'Correspondence',
    artist: 'Maren Solberg',
    artistId: 'a4',
    cover: '',
    year: 2023,
    tracks: ['t8', 't9'],
    genre: 'Indie Folk',
    description: 'Intimate songs written as letters to friends near and far during a year of distance.'
  }
];

export const artists: Artist[] = [
  {
    id: 'a1',
    name: 'Elena Voss',
    bio: 'Ambient composer and sound artist from Portland, Oregon. Her work explores the intersection of silence and sound, creating immersive environments that invite deep listening. Each piece is crafted to create a space for presence and reflection.',
    image: '',
    albums: ['al1'],
    genres: ['Ambient', 'Experimental']
  },
  {
    id: 'a2',
    name: 'The Wandering Collective',
    bio: 'A folk ensemble formed in Copenhagen, bringing together musicians from across Scandinavia. Their music draws from traditional storytelling and the landscapes they traverse, creating songs that feel both ancient and immediate.',
    image: '',
    albums: ['al2'],
    genres: ['Folk', 'Indie Folk']
  },
  {
    id: 'a3',
    name: 'Kai Nomura',
    bio: 'Electronic producer and sound designer based in Tokyo. Nomura creates compositions that blend field recordings with synthesized textures, exploring natural patterns through digital means. His work has been featured in galleries and installations worldwide.',
    image: '',
    albums: ['al3'],
    genres: ['Electronic', 'Ambient']
  },
  {
    id: 'a4',
    name: 'Maren Solberg',
    bio: 'Singer-songwriter from Oslo whose intimate folk compositions explore themes of distance, memory, and connection through correspondence. Her sparse arrangements let every word and note breathe.',
    image: '',
    albums: ['al4'],
    genres: ['Indie Folk', 'Singer-Songwriter']
  }
];

export const playlists: Playlist[] = [
  {
    id: 'p1',
    name: 'Morning Calm',
    description: 'Gentle tracks to start your day with intention',
    tracks: ['t1', 't8', 't3', 't6'],
    cover: '',
    isUserCreated: true
  },
  {
    id: 'p2',
    name: 'Deep Focus',
    description: 'Instrumental compositions for sustained concentration',
    tracks: ['t6', 't7', 't12', 't2', 't10'],
    cover: '',
    isUserCreated: true
  },
  {
    id: 'p3',
    name: 'Evening Wind-Down',
    description: 'Soft endings for a peaceful night',
    tracks: ['t9', 't3', 't8', 't1'],
    cover: '',
    isUserCreated: true
  },
  {
    id: 'p4',
    name: 'New Discoveries',
    description: 'Fresh music matched to your listening patterns',
    tracks: ['t4', 't5', 't11', 't7'],
    cover: ''
  }
];

export const recommendations: DiscoveryRecommendation[] = [
  {
    track: tracks[3],
    reason: 'You\'ve been listening to ambient music this week. This folk piece shares its meditative quality and slow build.',
    intent: 'Calm and reflection'
  },
  {
    track: tracks[5],
    reason: 'Similar tempo and mood to your recent favorites. You tend to return to electronic textures with natural motifs.',
    intent: 'Focused listening'
  },
  {
    track: tracks[7],
    reason: 'This artist shares a collaborator with Elena Voss (Marcus Chen engineered both). Intimate songwriting you may connect with.',
    intent: 'Deeper artist connection'
  },
  {
    track: tracks[10],
    reason: 'You\'ve explored The Wandering Collective\'s earlier work. This track continues their narrative arc of movement and home.',
    intent: 'Complete the journey'
  }
];

export const genres = ['All', 'Ambient', 'Folk', 'Electronic', 'Indie Folk', 'Experimental', 'Singer-Songwriter'];
