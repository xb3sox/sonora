import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { AlbumArt } from './AlbumArt';
import { X, Music2, ListMusic, GripVertical } from 'lucide-react';

interface QueueViewProps {
  onClose: () => void;
}

export function QueueView({ onClose }: QueueViewProps) {
  const { state, removeFromQueue, reorderQueue, play, addToast } = usePlayer();
  const { currentTrack, queue } = state;
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.outerHTML);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIndex(index);
  };

  const handleDragLeave = () => {
    setDragOverIndex(null);
  };

  const handleDrop = (e: React.DragEvent, toIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === toIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }
    reorderQueue(draggedIndex, toIndex);
    addToast('Queue reordered', 'success');
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center sm:items-center sm:justify-end sm:pr-4">
      <div className="absolute inset-0 bg-sonora-bark/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:w-96 max-h-[70vh] bg-sonora-cream rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-sonora-sand">
          <div className="flex items-center gap-2">
            <ListMusic size={18} className="text-sonora-bark" />
            <h2 className="font-display text-lg font-semibold text-sonora-bark">Queue</h2>
            <span className="text-xs text-sonora-stone bg-sonora-sand px-2 py-0.5 rounded-full">
              {queue.length} upcoming
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-sonora-warm text-sonora-stone hover:text-sonora-bark transition-calm"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Now Playing */}
          {currentTrack && (
            <div className="mb-6">
              <p className="text-xs font-semibold text-sonora-stone uppercase tracking-wider mb-2">Now Playing</p>
              <div className="flex items-center gap-3 p-3 bg-sonora-warm rounded-lg">
                <AlbumArt type="track" id={currentTrack.id} size="md" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sonora-bark truncate">{currentTrack.title}</p>
                  <p className="text-xs text-sonora-stone truncate">{currentTrack.artist}</p>
                </div>
                <div className="flex items-end gap-0.5 h-4">
                  <span className="w-0.5 bg-sonora-bark animate-pulse" style={{ height: '60%', animationDelay: '0ms' }} />
                  <span className="w-0.5 bg-sonora-bark animate-pulse" style={{ height: '100%', animationDelay: '150ms' }} />
                  <span className="w-0.5 bg-sonora-bark animate-pulse" style={{ height: '40%', animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          {/* Up Next */}
          {queue.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-sonora-stone uppercase tracking-wider">Up Next</p>
                <button 
                  onClick={() => {
                    // Clear queue
                    for (let i = queue.length - 1; i >= 0; i--) {
                      removeFromQueue(i);
                    }
                    addToast('Queue cleared', 'info');
                  }}
                  className="text-xs text-sonora-stone hover:text-sonora-bark transition-calm"
                >
                  Clear all
                </button>
              </div>
              <div className="space-y-1">
                {queue.map((track, i) => (
                  <div
                    key={`${track.id}-${i}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, i)}
                    onDragOver={(e) => handleDragOver(e, i)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, i)}
                    onDragEnd={handleDragEnd}
                    className={`flex items-center gap-2 p-2.5 rounded-lg transition-calm group cursor-move
                      ${draggedIndex === i ? 'opacity-50' : ''}
                      ${dragOverIndex === i ? 'bg-sonora-sand border-2 border-sonora-earth border-dashed' : 'hover:bg-sonora-warm'}
                    `}
                  >
                    <GripVertical size={14} className="text-sonora-sand flex-shrink-0 group-hover:text-sonora-earth transition-calm" />
                    <span className="w-5 text-center text-xs text-sonora-stone tabular-nums">{i + 1}</span>
                    <AlbumArt type="track" id={track.id} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-sonora-bark truncate">{track.title}</p>
                      <p className="text-xs text-sonora-stone truncate">{track.artist}</p>
                    </div>
                    <button
                      onClick={() => {
                        removeFromQueue(i);
                        addToast(`Removed "${track.title}" from queue`, 'info');
                      }}
                      className="p-1.5 rounded-full text-sonora-stone opacity-0 group-hover:opacity-100 hover:text-sonora-bark transition-calm"
                      aria-label="Remove from queue"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {queue.length === 0 && (
            <div className="text-center py-8">
              <Music2 size={32} className="text-sonora-sand mx-auto mb-3" />
              <p className="text-sm text-sonora-stone">Queue is empty</p>
              <p className="text-xs text-sonora-stone/60 mt-1">Right-click a track to add it to queue</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
