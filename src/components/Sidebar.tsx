import React from 'react';
import { View } from '../types';
import { 
  Home, Compass, Library, Search, Settings, Headphones,
  Music2, Disc3, Heart, Menu, X, BarChart3, Clock
} from 'lucide-react';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ currentView, onNavigate, isOpen, onToggle }: SidebarProps) {
  const navItems: { view: View; icon: React.ReactNode; label: string }[] = [
    { view: 'home', icon: <Home size={20} />, label: 'Home' },
    { view: 'explore', icon: <Compass size={20} />, label: 'Explore' },
    { view: 'library', icon: <Library size={20} />, label: 'Library' },
    { view: 'search', icon: <Search size={20} />, label: 'Search' },
    { view: 'history', icon: <Clock size={20} />, label: 'History' },
    { view: 'stats', icon: <BarChart3 size={20} />, label: 'Your Stats' },
  ];

  const libraryItems = [
    { icon: <Heart size={16} />, label: 'Liked Tracks' },
    { icon: <Music2 size={16} />, label: 'Playlists' },
    { icon: <Disc3 size={16} />, label: 'Albums' },
  ];

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={onToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 rounded-lg bg-sonora-warm border border-sonora-sand text-sonora-bark shadow-sm"
        aria-label="Toggle navigation"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 z-30 bg-sonora-bark/20 backdrop-blur-sm"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative z-40 
        w-64 h-full bg-sonora-warm border-r border-sonora-sand flex flex-col
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="p-6 pb-4">
          <button 
            onClick={() => { onNavigate('home'); onToggle(); }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 rounded-full bg-sonora-bark flex items-center justify-center group-hover:scale-105 transition-transform">
              <Headphones size={16} className="text-sonora-cream" />
            </div>
            <span className="font-display text-xl font-semibold text-sonora-bark tracking-tight">
              Sonora
            </span>
          </button>
        </div>

        {/* Main Navigation */}
        <nav className="px-3 flex-1 overflow-y-auto">
          <div className="space-y-1">
            {navItems.map(item => (
              <button
                key={item.view}
                onClick={() => { onNavigate(item.view); onToggle(); }}
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
                  onClick={() => { onNavigate('library'); onToggle(); }}
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
                  onClick={() => { onNavigate('library'); onToggle(); }}
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
            onClick={() => { onNavigate('settings'); onToggle(); }}
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
    </>
  );
}
