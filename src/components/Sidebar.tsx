import React from 'react';
import { View } from '../types';
import { 
  Home, Compass, Library, Search, Settings, Headphones,
  Music2, Disc3, Heart
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const navItems: { view: View; icon: React.ReactNode; label: string }[] = [
    { view: 'home', icon: <Home size={20} />, label: 'Home' },
    { view: 'explore', icon: <Compass size={20} />, label: 'Explore' },
    { view: 'library', icon: <Library size={20} />, label: 'Library' },
    { view: 'search', icon: <Search size={20} />, label: 'Search' },
  ];

  const libraryItems = [
    { icon: <Heart size={16} />, label: 'Liked Tracks' },
    { icon: <Music2 size={16} />, label: 'Playlists' },
    { icon: <Disc3 size={16} />, label: 'Albums' },
  ];

  return (
    <aside className="w-64 h-full bg-sonora-warm border-r border-sonora-sand flex flex-col">
      {/* Logo */}
      <div className="p-6 pb-4">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 group"
        >
          <div className="w-8 h-8 rounded-full bg-sonora-bark flex items-center justify-center">
            <Headphones size={16} className="text-sonora-cream" />
          </div>
          <span className="font-display text-xl font-semibold text-sonora-bark tracking-tight">
            Sonora
          </span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 flex-1">
        <div className="space-y-1">
          {navItems.map(item => (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-calm
                ${currentView === item.view 
                  ? 'bg-sonora-bark text-sonora-cream' 
                  : 'text-sonora-earth hover:bg-sonora-sand hover:text-sonora-bark'
                }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>

        {/* Library Shortcuts */}
        <div className="mt-8">
          <p className="px-3 text-xs font-semibold text-sonora-stone uppercase tracking-wider mb-2">
            Your Library
          </p>
          <div className="space-y-1">
            {libraryItems.map(item => (
              <button
                key={item.label}
                onClick={() => onNavigate('library')}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-sonora-earth hover:bg-sonora-sand hover:text-sonora-bark transition-calm"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Playlists */}
        <div className="mt-6">
          <p className="px-3 text-xs font-semibold text-sonora-stone uppercase tracking-wider mb-2">
            Playlists
          </p>
          <div className="space-y-1">
            {['Morning Calm', 'Deep Focus', 'Evening Wind-Down', 'New Discoveries'].map(name => (
              <button
                key={name}
                onClick={() => onNavigate('library')}
                className="w-full text-left px-3 py-1.5 rounded-lg text-sm text-sonora-earth hover:bg-sonora-sand hover:text-sonora-bark transition-calm truncate"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Settings */}
      <div className="p-3 border-t border-sonora-sand">
        <button
          onClick={() => onNavigate('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-calm
            ${currentView === 'settings'
              ? 'bg-sonora-bark text-sonora-cream'
              : 'text-sonora-earth hover:bg-sonora-sand hover:text-sonora-bark'
            }`}
        >
          <Settings size={20} />
          Settings & Privacy
        </button>
      </div>
    </aside>
  );
}
