import React, { useState } from 'react';
import { 
  Shield, Volume2, Download, Globe, 
  Eye, EyeOff, Music, Bell, BellOff,
  ChevronRight, Check, ArrowRight,
  Upload, ExternalLink
} from 'lucide-react';

export function SettingsPage() {
  const [audioQuality, setAudioQuality] = useState<'standard' | 'high' | 'lossless'>('lossless');
  const [offlineEnabled, setOfflineEnabled] = useState(true);
  const [dataCollection, setDataCollection] = useState(false);
  const [recommendations, setRecommendations] = useState(true);
  const [listeningHistory, setListeningHistory] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importStep, setImportStep] = useState<'select' | 'processing' | 'done'>('select');

  const importServices = [
    { id: 'spotify', name: 'Spotify', icon: '🟢', desc: 'Import playlists, liked songs, and followed artists' },
    { id: 'apple', name: 'Apple Music', icon: '🍎', desc: 'Import your library and playlists' },
    { id: 'youtube', name: 'YouTube Music', icon: '🔴', desc: 'Import playlists and liked tracks' },
    { id: 'tidal', name: 'Tidal', icon: '🌊', desc: 'Import playlists and favorites' },
  ];

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <header className="mb-8 pt-8 sm:pt-0">
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
              <div className="w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-calm"
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
        <p className="mt-3 text-xs text-sonora-stone/70 italic">
          Your listening data is never shared with third parties. All recommendations run locally.
        </p>
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
          <Upload size={14} /> Import & Export
        </h2>
        
        {!showImport ? (
          <div className="bg-sonora-warm rounded-xl divide-y divide-sonora-sand">
            <button 
              onClick={() => setShowImport(true)}
              className="w-full flex items-center justify-between p-4 hover:bg-sonora-sand transition-calm text-left"
            >
              <div>
                <p className="text-sm font-medium text-sonora-bark">Import from other services</p>
                <p className="text-xs text-sonora-stone">Spotify, Apple Music, YouTube Music, Tidal</p>
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
        ) : (
          <div className="bg-sonora-warm rounded-xl p-5">
            {importStep === 'select' && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-sonora-bark">Choose a service to import from</h3>
                  <button 
                    onClick={() => setShowImport(false)}
                    className="text-xs text-sonora-stone hover:text-sonora-bark"
                  >
                    Cancel
                  </button>
                </div>
                <div className="space-y-2">
                  {importServices.map(service => (
                    <button
                      key={service.id}
                      onClick={() => setImportStep('processing')}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-sonora-sand transition-calm text-left"
                    >
                      <span className="text-2xl">{service.icon}</span>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-sonora-bark">{service.name}</p>
                        <p className="text-xs text-sonora-stone">{service.desc}</p>
                      </div>
                      <ArrowRight size={14} className="text-sonora-stone" />
                    </button>
                  ))}
                </div>
                <p className="mt-4 text-xs text-sonora-stone/70">
                  We'll match your music and preserve your playlists. No data is stored on our servers.
                </p>
              </>
            )}
            {importStep === 'processing' && (
              <div className="text-center py-8">
                <div className="w-10 h-10 border-2 border-sonora-sand border-t-sonora-bark rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm font-medium text-sonora-bark mb-1">Importing your library...</p>
                <p className="text-xs text-sonora-stone">Matching tracks and preserving playlists</p>
                <button
                  onClick={() => setImportStep('done')}
                  className="mt-4 text-xs text-sonora-accent hover:underline"
                >
                  Skip (demo)
                </button>
              </div>
            )}
            {importStep === 'done' && (
              <div className="text-center py-8">
                <div className="w-12 h-12 rounded-full bg-sonora-sage/20 flex items-center justify-center mx-auto mb-4">
                  <Check size={24} className="text-sonora-sage" />
                </div>
                <p className="text-sm font-medium text-sonora-bark mb-1">Import complete!</p>
                <p className="text-xs text-sonora-stone mb-4">142 tracks matched · 8 playlists imported</p>
                <button
                  onClick={() => { setShowImport(false); setImportStep('select'); }}
                  className="text-sm text-sonora-accent font-medium hover:underline"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {/* About */}
      <section className="mb-8">
        <div className="bg-sonora-warm rounded-xl p-6 text-center">
          <div className="w-10 h-10 rounded-full bg-sonora-bark flex items-center justify-center mx-auto mb-3">
            <Music size={18} className="text-sonora-cream" />
          </div>
          <p className="font-display text-lg font-semibold text-sonora-bark mb-1">Sonora</p>
          <p className="text-xs text-sonora-stone mb-3">Discover less. Love more.</p>
          <div className="flex items-center justify-center gap-4 text-xs text-sonora-stone">
            <span>Version 1.0.0</span>
            <span>·</span>
            <a href="#" className="hover:text-sonora-bark transition-calm">Privacy Policy</a>
            <span>·</span>
            <a href="#" className="hover:text-sonora-bark transition-calm">Terms</a>
          </div>
        </div>
      </section>
    </div>
  );
}
