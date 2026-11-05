import React, { useState } from 'react';
import { X, Link2, Copy, Check, Twitter, Mail, Share2 } from 'lucide-react';
import { Track } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  track: Track | null;
}

export function ShareModal({ isOpen, onClose, track }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !track) return null;

  const shareUrl = `https://sonora.app/track/${track.id}`;
  const shareText = `Listening to "${track.title}" by ${track.artist} on Sonora`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareOptions = [
    {
      id: 'copy',
      label: 'Copy link',
      icon: copied ? <Check size={18} className="text-sonora-sage" /> : <Copy size={18} />,
      action: handleCopy,
      state: copied ? 'Copied!' : 'Copy link',
    },
    {
      id: 'twitter',
      label: 'Share on X',
      icon: <Twitter size={18} />,
      action: () => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank'),
      state: 'Share on X',
    },
    {
      id: 'email',
      label: 'Send via email',
      icon: <Mail size={18} />,
      action: () => window.open(`mailto:?subject=${encodeURIComponent(shareText)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`, '_blank'),
      state: 'Email',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-sonora-bark/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:w-96 bg-sonora-cream rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-sonora-sand">
          <div className="flex items-center gap-2">
            <Share2 size={18} className="text-sonora-bark" />
            <h2 className="font-display text-lg font-semibold text-sonora-bark">Share</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-sonora-warm text-sonora-stone hover:text-sonora-bark transition-calm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Track Info */}
        <div className="p-5 border-b border-sonora-sand">
          <p className="text-sm font-medium text-sonora-bark truncate">{track.title}</p>
          <p className="text-xs text-sonora-stone truncate">{track.artist} · {track.album}</p>
        </div>

        {/* Share Options */}
        <div className="p-5 space-y-1">
          {shareOptions.map(option => (
            <button
              key={option.id}
              onClick={option.action}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-sonora-warm transition-calm text-left"
            >
              <div className="w-9 h-9 rounded-full bg-sonora-warm flex items-center justify-center text-sonora-earth">
                {option.icon}
              </div>
              <span className="text-sm font-medium text-sonora-bark">{option.state}</span>
            </button>
          ))}
        </div>

        {/* Link Preview */}
        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 p-3 bg-sonora-warm rounded-lg">
            <Link2 size={14} className="text-sonora-stone flex-shrink-0" />
            <span className="text-xs text-sonora-stone truncate flex-1">{shareUrl}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
