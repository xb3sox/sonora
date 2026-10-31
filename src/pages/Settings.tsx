import React, { useState } from 'react';
import { 
  Shield, Volume2, Download, Globe, 
  Eye, EyeOff, Music, Bell, BellOff,
  ChevronRight, Check
} from 'lucide-react';

export function SettingsPage() {
  const [audioQuality, setAudioQuality] = useState<'standard' | 'high' | 'lossless'>('lossless');
  const [offlineEnabled, setOfflineEnabled] = useState(true);
  const [dataCollection, setDataCollection] = useState(false);
  const [recommendations, setRecommendations] = useState(true);
  const [listeningHistory, setListeningHistory] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [showExpanded, setShowExpanded] = useState(false);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <header className="mb-8">
        <h1 className="font-display text-3xl font-semibold text-sonora-bark mb-2">Settings & Privacy</h1>
        <p className="text-sonora-stone text-sm">Your data stays yours. Configure how Sonora works for you.</p>
      </header>

      {/* Audio Quality */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-sonora-stone uppercase tracking-wider mb-4">
          <Volume2 size={14} /> Audio Quality
        </h2>
        <div className="bg-sonora-warm rounded-xl p-4 space-y-3">
          {[
            { id: 'standard' as const, label: 'Standard', desc: '128 kbps — saves data', icon: '📱' },
            { id: 'high' as const, label: 'High', desc: '320 kbps — balanced', icon: '🎵' },
            { id: 'lossless' as const, label: 'Lossless', desc: '24-bit/96kHz — studio quality', icon: '💎' },
          ].map(option => (
            <button
              key={option.id}
              onClick={() => setAudioQuality(option.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg transition-calm text-left
                ${audioQuality === option.id ? 'bg-sonora-cream border border-sonora-earth' : 'hover:bg-sonora-sand'}`}
            >
              <span className="text-lg">{option.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-sonora-bark">{option.label}</p>
                <p className="text-xs text-sonora-stone">{option.desc}</p>
              </div>
              {audioQuality === option.id && (
                <Check size={16} className="text-sonora-sage" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Downloads */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-sonora-stone uppercase tracking-wider mb-4">
          <Download size={14} /> Offline & Downloads
        </h2>
        <div className="bg-sonora-warm rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-sonora-bark">Offline Mode</p>
              <p className="text-xs text-sonora-stone">Cache your library for listening without internet</p>
            </div>
            <button
              onClick={() => setOfflineEnabled(!offlineEnabled)}
              className={`w-11 h-6 rounded-full transition-calm relative
                ${offlineEnabled ? 'bg-sonora-bark' : 'bg-sonora-sand'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-calm
                ${offlineEnabled ? 'left-5.5' : 'left-0.5'}`}
                style={{ left: offlineEnabled ? '22px' : '2px' }}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Privacy */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-sonora-stone uppercase tracking-wider mb-4">
          <Shield size={14} /> Privacy & Data
        </h2>
        <div className="bg-sonora-warm rounded-xl divide-y divide-sonora-sand">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {dataCollection ? <Eye size={16} className="text-sonora-stone" /> : <EyeOff size={16} className="text-sonora-stone" />}
              <div>
                <p className="text-sm font-medium text-sonora-bark">Data Collection</p>
                <p className="text-xs text-sonora-stone">Allow anonymous usage analytics</p>
              </div>
            </div>
            <button
              onClick={() => setDataCollection(!dataCollection)}
              className={`w-11 h-6 rounded-full transition-calm relative
                ${dataCollection ? 'bg-sonora-bark' : 'bg-sonora-sand'}`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-calm"
                style={{ left: dataCollection ? '22px' : '2px' }}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Music size={16} className="text-sonora-stone" />
              <div>
                <p className="text-sm font-medium text-sonora-bark">Personalized Recommendations</p>
                <p className="text-xs text-sonora-stone">Use listening history for suggestions</p>
              </div>
            </div>
            <button
              onClick={() => setRecommendations(!recommendations)}
              className={`w-11 h-6 rounded-full transition-calm relative
                ${recommendations ? 'bg-sonora-bark' : 'bg-sonora-sand'}`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-calm"
                style={{ left: recommendations ? '22px' : '2px' }}
              />
            </button>
          </div>
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <Globe size={16} className="text-sonora-stone" />
              <div>
                <p className="text-sm font-medium text-sonora-bark">Listening History</p>
                <p className="text-xs text-sonora-stone">Keep a record of what you've played</p>
              </div>
            </div>
            <button
              onClick={() => setListeningHistory(!listeningHistory)}
              className={`w-11 h-6 rounded-full transition-calm relative
                ${listeningHistory ? 'bg-sonora-bark' : 'bg-sonora-sand'}`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-calm"
                style={{ left: listeningHistory ? '22px' : '2px' }}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-sonora-stone uppercase tracking-wider mb-4">
          <Bell size={14} /> Notifications
        </h2>
        <div className="bg-sonora-warm rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {notifications ? <Bell size={16} className="text-sonora-stone" /> : <BellOff size={16} className="text-sonora-stone" />}
              <div>
                <p className="text-sm font-medium text-sonora-bark">Push Notifications</p>
                <p className="text-xs text-sonora-stone">New releases from artists you follow</p>
              </div>
            </div>
            <button
              onClick={() => setNotifications(!notifications)}
              className={`w-11 h-6 rounded-full transition-calm relative
                ${notifications ? 'bg-sonora-bark' : 'bg-sonora-sand'}`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-calm"
                style={{ left: notifications ? '22px' : '2px' }}
              />
            </button>
          </div>
        </div>
      </section>

      {/* Import / Export */}
      <section className="mb-8">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-sonora-stone uppercase tracking-wider mb-4">
          <ChevronRight size={14} /> Import & Export
        </h2>
        <div className="bg-sonora-warm rounded-xl divide-y divide-sonora-sand">
          <button className="w-full flex items-center justify-between p-4 hover:bg-sonora-sand transition-calm text-left">
            <div>
              <p className="text-sm font-medium text-sonora-bark">Import from other services</p>
              <p className="text-xs text-sonora-stone">Spotify, Apple Music, YouTube Music</p>
            </div>
            <ChevronRight size={16} className="text-sonora-stone" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-sonora-sand transition-calm text-left">
            <div>
              <p className="text-sm font-medium text-sonora-bark">Export your data</p>
              <p className="text-xs text-sonora-stone">Download playlists and listening history</p>
            </div>
            <ChevronRight size={16} className="text-sonora-stone" />
          </button>
        </div>
      </section>

      {/* About */}
      <section className="mb-8">
        <div className="bg-sonora-warm rounded-xl p-6 text-center">
          <div className="w-10 h-10 rounded-full bg-sonora-bark flex items-center justify-center mx-auto mb-3">
            <Music size={18} className="text-sonora-cream" />
          </div>
          <p className="font-display text-lg font-semibold text-sonora-bark mb-1">Sonora</p>
          <p className="text-xs text-sonora-stone mb-3">Discover less. Love more.</p>
          <p className="text-xs text-sonora-stone">Version 1.0.0 · Built with care</p>
        </div>
      </section>
    </div>
  );
}
