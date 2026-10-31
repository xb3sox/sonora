import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useFollow } from '../context/FollowContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { 
  User, Mail, Globe, Music2, Heart, Disc3, 
  ListMusic, Download, Upload, Trash2, Check
} from 'lucide-react';

export function ProfilePage() {
  const { favorites } = usePlayer();
  const { followedArtists } = useFollow();
  
  const [displayName, setDisplayName] = useLocalStorage('sonora-display-name', 'Music Lover');
  const [email, setEmail] = useLocalStorage('sonora-email', '');
  const [bio, setBio] = useLocalStorage('sonora-bio', '');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(displayName);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempBio, setTempBio] = useState(bio);

  const handleSave = () => {
    setDisplayName(tempName);
    setEmail(tempEmail);
    setBio(tempBio);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempName(displayName);
    setTempEmail(email);
    setTempBio(bio);
    setIsEditing(false);
  };

  const handleExportData = () => {
    const data = {
      displayName,
      email,
      bio,
      favorites: Array.from(favorites),
      followedArtists: Array.from(followedArtists),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sonora-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (confirm('Are you sure? This will clear all your local data including favorites, history, and preferences.')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="p-6 sm:p-8 max-w-3xl mx-auto">
      <header className="mb-8 pt-8 sm:pt-0">
        <h1 className="font-display text-3xl font-semibold text-sonora-bark mb-2">Your Profile</h1>
        <p className="text-sonora-stone text-sm">Manage your account and data</p>
      </header>

      {/* Profile Card */}
      <section className="mb-8">
        <div className="bg-sonora-warm rounded-2xl p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-sonora-accent to-sonora-clay flex items-center justify-center flex-shrink-0">
              <User size={28} className="text-white" />
            </div>
            <div className="flex-1">
              {!isEditing ? (
                <>
                  <h2 className="font-display text-xl font-semibold text-sonora-bark mb-1">{displayName}</h2>
                  {email && <p className="text-sm text-sonora-stone mb-2">{email}</p>}
                  {bio && <p className="text-sm text-sonora-earth">{bio}</p>}
                </>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    placeholder="Display name"
                    className="w-full px-3 py-2 bg-sonora-cream border border-sonora-sand rounded-lg text-sm focus:outline-none focus:border-sonora-earth"
                  />
                  <input
                    type="email"
                    value={tempEmail}
                    onChange={(e) => setTempEmail(e.target.value)}
                    placeholder="Email (optional)"
                    className="w-full px-3 py-2 bg-sonora-cream border border-sonora-sand rounded-lg text-sm focus:outline-none focus:border-sonora-earth"
                  />
                  <textarea
                    value={tempBio}
                    onChange={(e) => setTempBio(e.target.value)}
                    placeholder="Short bio (optional)"
                    rows={2}
                    className="w-full px-3 py-2 bg-sonora-cream border border-sonora-sand rounded-lg text-sm focus:outline-none focus:border-sonora-earth resize-none"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-sonora-bark text-sonora-cream rounded-lg text-sm font-medium hover:bg-sonora-night transition-calm"
                    >
                      <Check size={14} /> Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 text-sm text-sonora-stone hover:text-sonora-bark transition-calm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1.5 text-sm text-sonora-earth hover:text-sonora-bark hover:bg-sonora-sand rounded-lg transition-calm"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-sonora-stone uppercase tracking-wider mb-4">Your Activity</h2>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-sonora-warm rounded-xl p-4 text-center">
            <Heart size={20} className="text-sonora-accent mx-auto mb-2" />
            <p className="text-2xl font-semibold text-sonora-bark">{favorites.size}</p>
            <p className="text-xs text-sonora-stone">Liked tracks</p>
          </div>
          <div className="bg-sonora-warm rounded-xl p-4 text-center">
            <User size={20} className="text-sonora-accent mx-auto mb-2" />
            <p className="text-2xl font-semibold text-sonora-bark">{followedArtists.size}</p>
            <p className="text-xs text-sonora-stone">Following</p>
          </div>
          <div className="bg-sonora-warm rounded-xl p-4 text-center">
            <ListMusic size={20} className="text-sonora-accent mx-auto mb-2" />
            <p className="text-2xl font-semibold text-sonora-bark">4</p>
            <p className="text-xs text-sonora-stone">Playlists</p>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-sonora-stone uppercase tracking-wider mb-4">Data Management</h2>
        <div className="bg-sonora-warm rounded-xl divide-y divide-sonora-sand">
          <button
            onClick={handleExportData}
            className="w-full flex items-center gap-3 p-4 hover:bg-sonora-sand transition-calm text-left"
          >
            <Download size={18} className="text-sonora-earth" />
            <div className="flex-1">
              <p className="text-sm font-medium text-sonora-bark">Export your data</p>
              <p className="text-xs text-sonora-stone">Download your favorites, playlists, and preferences</p>
            </div>
          </button>
          <button className="w-full flex items-center gap-3 p-4 hover:bg-sonora-sand transition-calm text-left">
            <Upload size={18} className="text-sonora-earth" />
            <div className="flex-1">
              <p className="text-sm font-medium text-sonora-bark">Import data</p>
              <p className="text-xs text-sonora-stone">Restore from a previous export</p>
            </div>
          </button>
          <button
            onClick={handleClearData}
            className="w-full flex items-center gap-3 p-4 hover:bg-red-50 transition-calm text-left"
          >
            <Trash2 size={18} className="text-red-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-700">Clear all data</p>
              <p className="text-xs text-sonora-stone">Remove all local data and start fresh</p>
            </div>
          </button>
        </div>
      </section>

      {/* About */}
      <section>
        <div className="bg-sonora-warm rounded-xl p-6 text-center">
          <p className="text-xs text-sonora-stone">
            All your data is stored locally on your device. Nothing is sent to our servers.
          </p>
        </div>
      </section>
    </div>
  );
}
