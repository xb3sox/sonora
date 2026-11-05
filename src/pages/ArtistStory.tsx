import React, { useState } from 'react';
import { artists, albums, tracks } from '../data';
import { View } from '../types';
import { AlbumArt } from '../components/AlbumArt';
import { 
  ArrowLeft, Quote, BookOpen, Users, Music2, 
  Calendar, MapPin, ExternalLink, Play, Disc3
} from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

interface ArtistStoryPageProps {
  artistId: string;
  onNavigate: (view: View, id?: string) => void;
}

// Simulated artist stories/interviews
const artistStories: Record<string, {
  interview: { question: string; answer: string }[];
  linerNotes: string;
  influences: string[];
  milestones: { year: number; event: string }[];
}> = {
  a1: {
    interview: [
      { question: 'What inspired Quiet Hours?', answer: 'Three winters in Portland where the rain never stopped. I started recording the sounds of my apartment — the hum of the fridge, the creak of floorboards — and realized there was music in the quiet.' },
      { question: 'How do you approach composition?', answer: 'I begin with silence. I sit for an hour, listening. Whatever emerges from that silence becomes the seed of a piece. The rest is subtraction.' },
    ],
    linerNotes: 'Quiet Hours was recorded in a single room over three winters. No overdubs, no edits. What you hear is the room, the instruments, and the weather outside.',
    influences: ['Brian Eno', 'Harold Budd', 'Erik Satie', 'Ryuichi Sakamoto'],
    milestones: [
      { year: 2018, event: 'First public performance at Portland Art Museum' },
      { year: 2020, event: 'Residency at Banff Centre' },
      { year: 2023, event: 'Began recording Quiet Hours' },
      { year: 2024, event: 'Released Quiet Hours on Stillwater Records' },
    ]
  },
  a2: {
    interview: [
      { question: 'How did The Wandering Collective form?', answer: 'We met on the road. Five musicians from different countries, all traveling, all playing. We decided to stop traveling separately and start traveling together.' },
      { question: 'What does "wandering" mean to you?', answer: 'It\'s not about being lost. It\'s about being open. Every place we\'ve been has taught us something about home.' },
    ],
    linerNotes: 'Fields of Light was written in Copenhagen, rehearsed in Gothenburg, and recorded in a converted barn outside Aarhus. The album cover is a photograph taken at 4am during a break in the sessions.',
    influences: ['Nick Drake', 'Joni Mitchell', 'Traditional Scandinavian folk', 'Pentangle'],
    milestones: [
      { year: 2019, event: 'First gig at a Copenhagen folk club' },
      { year: 2021, event: 'Toured 12 countries in 6 months' },
      { year: 2022, event: 'Recorded Fields of Light' },
      { year: 2023, event: 'Released Fields of Light to critical acclaim' },
    ]
  },
  a3: {
    interview: [
      { question: 'What draws you to ocean sounds?', answer: 'The ocean is the original synthesizer. It\'s been generating complex patterns for billions of years. I\'m just trying to listen and translate.' },
      { question: 'How do you blend field recordings with synthesis?', answer: 'I don\'t blend them — I let them converse. The recordings ask questions, the synthesis answers. Sometimes they argue.' },
    ],
    linerNotes: 'Tidal Patterns uses recordings from Tokyo Bay, the Seto Inland Sea, and the Pacific off Shikoku. Each track maps to a specific tidal pattern recorded at a specific moment.',
    influences: ['Aphex Twin', 'Ryoji Ikeda', 'Bernie Krause', 'Traditional Gagaku'],
    milestones: [
      { year: 2017, event: 'First installation at TeamLab Borderless' },
      { year: 2020, event: 'Began field recording practice' },
      { year: 2023, event: 'Residency at Sony CSL' },
      { year: 2024, event: 'Released Tidal Patterns' },
    ]
  },
  a4: {
    interview: [
      { question: 'Why letters as a songwriting form?', answer: 'When you write a letter, you\'re writing to one person. That intimacy changes everything. These songs are addressed to specific people in specific moments.' },
      { question: 'How do you decide what to include?', answer: 'If I wouldn\'t write it in a letter, I don\'t sing it. The form keeps me honest.' },
    ],
    linerNotes: 'Correspondence is a year of letters set to music. Each song is a real letter to a real person. Some were sent, some were never meant to be sent.',
    influences: ['Laura Marling', 'Aldo van Oosterum', 'Traditional Norwegian folk', 'Elizabeth Bishop'],
    milestones: [
      { year: 2020, event: 'Began writing letters during lockdown' },
      { year: 2022, event: 'First Oslo performance' },
      { year: 2023, event: 'Recorded Correspondence in 5 days' },
      { year: 2023, event: 'Released Correspondence on North Light' },
    ]
  }
};

export function ArtistStoryPage({ artistId, onNavigate }: ArtistStoryPageProps) {
  const { play } = usePlayer();
  const artist = artists.find(a => a.id === artistId);
  const [activeSection, setActiveSection] = useState<'story' | 'interview' | 'timeline'>('story');

  if (!artist) {
    return (
      <div className="p-8 text-center">
        <p className="text-sonora-stone">Artist not found</p>
      </div>
    );
  }

  const story = artistStories[artistId];
  const artistAlbums = albums.filter(a => a.artistId === artistId);
  const artistTracks = tracks.filter(t => t.artistId === artistId);

  // Find related artists (shared genres or collaborators)
  const relatedArtists = artists.filter(a => 
    a.id !== artistId && 
    a.genres.some(g => artist.genres.includes(g))
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 sm:p-8 pb-0">
        <button
          onClick={() => onNavigate('artist', artistId)}
          className="flex items-center gap-2 text-sm text-sonora-stone hover:text-sonora-bark transition-calm mb-6"
        >
          <ArrowLeft size={16} /> Back to artist
        </button>
      </div>

      {/* Hero */}
      <div className="px-6 sm:px-8 pb-8">
        <div className="flex items-start gap-6 mb-6">
          <div className="w-24 h-24 rounded-full flex-shrink-0 shadow-lg overflow-hidden">
            <AlbumArt type="artist" id={artist.id} size="xl" className="w-full h-full" />
          </div>
          <div>
            <p className="text-xs font-semibold text-sonora-accent uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <BookOpen size={12} /> The Story
            </p>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold text-sonora-bark mb-2">
              {artist.name}
            </h1>
            <p className="text-sm text-sonora-stone">{artist.genres.join(' · ')}</p>
          </div>
        </div>

        {/* Section Tabs */}
        <div className="flex items-center gap-1 border-b border-sonora-sand mb-6">
          {[
            { id: 'story' as const, label: 'Liner Notes', icon: <BookOpen size={14} /> },
            { id: 'interview' as const, label: 'In Their Words', icon: <Quote size={14} /> },
            { id: 'timeline' as const, label: 'Journey', icon: <Calendar size={14} /> },
          ].map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-calm border-b-2 -mb-px
                ${activeSection === section.id
                  ? 'border-sonora-bark text-sonora-bark'
                  : 'border-transparent text-sonora-stone hover:text-sonora-earth'
                }`}
            >
              {section.icon}
              {section.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-6 sm:px-8 pb-8">
        {activeSection === 'story' && (
          <div className="animate-fade-in">
            <div className="bg-sonora-warm rounded-2xl p-6 sm:p-8 mb-6">
              <Quote size={24} className="text-sonora-accent/30 mb-4" />
              <p className="text-base text-sonora-earth leading-relaxed font-serif italic">
                {story.linerNotes}
              </p>
            </div>

            {/* Influences */}
            <div className="mb-8">
              <h3 className="text-sm font-semibold text-sonora-stone uppercase tracking-wider mb-3">
                Influences & Connections
              </h3>
              <div className="flex flex-wrap gap-2">
                {story.influences.map(influence => (
                  <span
                    key={influence}
                    className="px-3 py-1.5 bg-sonora-warm rounded-full text-sm text-sonora-earth"
                  >
                    {influence}
                  </span>
                ))}
              </div>
            </div>

            {/* Featured Tracks */}
            <div>
              <h3 className="text-sm font-semibold text-sonora-stone uppercase tracking-wider mb-3">
                Essential Listening
              </h3>
              <div className="space-y-2">
                {artistTracks.slice(0, 3).map((track, i) => (
                  <button
                    key={track.id}
                    onClick={() => play(track)}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-sonora-warm transition-calm group text-left"
                  >
                    <span className="text-xs text-sonora-stone w-4">{i + 1}</span>
                    <AlbumArt type="track" id={track.id} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-sonora-bark truncate">{track.title}</p>
                      <p className="text-xs text-sonora-stone truncate">{track.album}</p>
                    </div>
                    <Play size={14} className="text-sonora-stone opacity-0 group-hover:opacity-100 transition-calm" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'interview' && (
          <div className="space-y-6 animate-fade-in">
            {story.interview.map((qa, i) => (
              <div key={i} className="bg-sonora-warm rounded-2xl p-6">
                <p className="text-sm font-semibold text-sonora-accent mb-3 flex items-center gap-2">
                  <Quote size={14} /> {qa.question}
                </p>
                <p className="text-base text-sonora-earth leading-relaxed">
                  {qa.answer}
                </p>
              </div>
            ))}
          </div>
        )}

        {activeSection === 'timeline' && (
          <div className="animate-fade-in">
            <div className="relative pl-8 border-l-2 border-sonora-sand space-y-6">
              {story.milestones.map((milestone, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-[33px] top-1 w-4 h-4 rounded-full bg-sonora-cream border-2 border-sonora-bark" />
                  <p className="text-xs font-semibold text-sonora-accent mb-1">{milestone.year}</p>
                  <p className="text-sm text-sonora-earth">{milestone.event}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Related Artists */}
      {relatedArtists.length > 0 && (
        <div className="px-6 sm:px-8 pb-8">
          <h3 className="text-sm font-semibold text-sonora-stone uppercase tracking-wider mb-4 flex items-center gap-2">
            <Users size={14} /> Connected Artists
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {relatedArtists.map(related => (
              <button
                key={related.id}
                onClick={() => onNavigate('artist', related.id)}
                className="flex items-center gap-3 p-3 rounded-xl bg-sonora-warm hover:bg-sonora-sand transition-calm text-left"
              >
                <AlbumArt type="artist" id={related.id} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sonora-bark truncate">{related.name}</p>
                  <p className="text-xs text-sonora-stone truncate">{related.genres[0]}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
