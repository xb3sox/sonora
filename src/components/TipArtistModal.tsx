import React, { useState } from 'react';
import { X, Heart, Coffee, Music, DollarSign } from 'lucide-react';
import { Artist } from '../types';
import { usePlayer } from '../context/PlayerContext';

interface TipArtistModalProps {
  isOpen: boolean;
  onClose: () => void;
  artist: Artist | null;
}

const tipAmounts = [3, 5, 10, 25, 50];

export function TipArtistModal({ isOpen, onClose, artist }: TipArtistModalProps) {
  const { addToast } = usePlayer();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(5);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [message, setMessage] = useState('');

  if (!isOpen || !artist) return null;

  const handleTip = () => {
    const amount = isCustom ? parseFloat(customAmount) : selectedAmount;
    if (!amount || amount <= 0) return;
    
    addToast(`Thank you! $${amount} sent to ${artist.name}`, 'success');
    setSelectedAmount(5);
    setCustomAmount('');
    setIsCustom(false);
    setMessage('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-sonora-bark/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:w-[440px] max-h-[85vh] bg-sonora-cream rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-sonora-sand flex-shrink-0">
          <div className="flex items-center gap-2">
            <Heart size={18} className="text-sonora-accent" fill="currentColor" />
            <h2 className="font-display text-lg font-semibold text-sonora-bark">Support {artist.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-sonora-warm text-sonora-stone hover:text-sonora-bark transition-calm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          <p className="text-sm text-sonora-earth mb-6">
            Your support goes directly to the artist. 100% of tips reach them, minus processing fees.
          </p>

          {/* Amount Selection */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-sonora-stone uppercase tracking-wider mb-3">
              Choose an amount
            </label>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {tipAmounts.map(amount => (
                <button
                  key={amount}
                  onClick={() => { setSelectedAmount(amount); setIsCustom(false); }}
                  className={`py-3 rounded-lg text-sm font-medium transition-calm
                    ${!isCustom && selectedAmount === amount
                      ? 'bg-sonora-bark text-sonora-cream'
                      : 'bg-sonora-warm text-sonora-earth hover:bg-sonora-sand'
                    }`}
                >
                  ${amount}
                </button>
              ))}
              <button
                onClick={() => setIsCustom(true)}
                className={`py-3 rounded-lg text-sm font-medium transition-calm
                  ${isCustom
                    ? 'bg-sonora-bark text-sonora-cream'
                    : 'bg-sonora-warm text-sonora-earth hover:bg-sonora-sand'
                  }`}
              >
                Custom
              </button>
            </div>
            {isCustom && (
              <div className="relative">
                <DollarSign size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-sonora-stone" />
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="Enter amount"
                  min="1"
                  step="1"
                  className="w-full pl-9 pr-4 py-2.5 bg-sonora-warm border border-sonora-sand rounded-lg text-sm text-sonora-bark placeholder:text-sonora-stone focus:outline-none focus:border-sonora-earth"
                  autoFocus
                />
              </div>
            )}
          </div>

          {/* Message (optional) */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-sonora-stone uppercase tracking-wider mb-2">
              Leave a message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Say something nice..."
              rows={3}
              maxLength={200}
              className="w-full px-4 py-2.5 bg-sonora-warm border border-sonora-sand rounded-lg text-sm text-sonora-bark placeholder:text-sonora-stone focus:outline-none focus:border-sonora-earth resize-none"
            />
            <p className="text-xs text-sonora-stone mt-1 text-right">{message.length}/200</p>
          </div>

          {/* Info */}
          <div className="bg-sonora-warm rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Coffee size={18} className="text-sonora-accent flex-shrink-0 mt-0.5" />
              <div className="text-xs text-sonora-earth leading-relaxed">
                <p className="font-medium text-sonora-bark mb-1">How it works</p>
                <p>Tips are processed securely and sent directly to the artist's account. You'll receive a receipt via email.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-sonora-sand flex-shrink-0">
          <button
            onClick={handleTip}
            disabled={isCustom ? !customAmount || parseFloat(customAmount) <= 0 : !selectedAmount}
            className="w-full py-3 bg-sonora-bark text-sonora-cream rounded-lg text-sm font-medium hover:bg-sonora-night transition-calm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Heart size={16} fill="currentColor" />
            Send ${isCustom ? customAmount || '0' : selectedAmount} to {artist.name}
          </button>
        </div>
      </div>
    </div>
  );
}
