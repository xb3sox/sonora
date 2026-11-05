import React from 'react';
import { View } from '../types';
import { Home, Compass, Library, Search, Clock } from 'lucide-react';

interface MobileNavProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

export function MobileNav({ currentView, onNavigate }: MobileNavProps) {
  const items = [
    { view: 'home' as View, icon: <Home size={20} />, label: 'Home' },
    { view: 'explore' as View, icon: <Compass size={20} />, label: 'Explore' },
    { view: 'search' as View, icon: <Search size={20} />, label: 'Search' },
    { view: 'library' as View, icon: <Library size={20} />, label: 'Library' },
    { view: 'history' as View, icon: <Clock size={20} />, label: 'History' },
  ];

  return (
    <nav className="lg:hidden fixed bottom-20 left-0 right-0 bg-sonora-warm border-t border-sonora-sand z-30">
      <div className="flex items-center justify-around px-2 py-1">
        {items.map(item => {
          const isActive = currentView === item.view || 
            (item.view === 'home' && ['artist', 'album', 'playlist', 'deep-listening', 'settings'].includes(currentView));
          return (
            <button
              key={item.view}
              onClick={() => onNavigate(item.view)}
              className={`flex flex-col items-center gap-0.5 px-3 py-2 rounded-lg transition-calm min-w-[56px]
                ${isActive ? 'text-sonora-bark' : 'text-sonora-stone'}`}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
