import React, { useState, useRef } from 'react';
import { Upload, FileText, Check, AlertCircle, X } from 'lucide-react';
import { usePlayer } from '../context/PlayerContext';

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type ImportStatus = 'idle' | 'processing' | 'success' | 'error';

interface ImportResult {
  tracksFound: number;
  tracksMatched: number;
  playlistsCreated: number;
  errors: string[];
}

export function ImportModal({ isOpen, onClose }: ImportModalProps) {
  const { addToast } = usePlayer();
  const [status, setStatus] = useState<ImportStatus>('idle');
  const [result, setResult] = useState<ImportResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = async (file: File) => {
    setStatus('processing');
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Parse file based on extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    
    try {
      let importResult: ImportResult;

      if (extension === 'json') {
        // Parse JSON file (Spotify/Apple Music export format)
        const content = await file.text();
        const data = JSON.parse(content);
        
        // Simulate matching logic
        importResult = {
          tracksFound: data.tracks?.length || 0,
          tracksMatched: Math.floor((data.tracks?.length || 0) * 0.85), // 85% match rate
          playlistsCreated: data.playlists?.length || 0,
          errors: []
        };
      } else if (extension === 'csv') {
        // Parse CSV file
        const content = await file.text();
        const lines = content.split('\n').filter(line => line.trim());
        
        importResult = {
          tracksFound: lines.length - 1, // Exclude header
          tracksMatched: Math.floor((lines.length - 1) * 0.80), // 80% match rate
          playlistsCreated: 1,
          errors: []
        };
      } else if (extension === 'txt') {
        // Parse plain text file (one track per line)
        const content = await file.text();
        const lines = content.split('\n').filter(line => line.trim());
        
        importResult = {
          tracksFound: lines.length,
          tracksMatched: Math.floor(lines.length * 0.75), // 75% match rate
          playlistsCreated: 1,
          errors: []
        };
      } else {
        throw new Error('Unsupported file format. Please use JSON, CSV, or TXT files.');
      }

      setResult(importResult);
      setStatus('success');
      addToast(`Imported ${importResult.tracksMatched} tracks`, 'success');
    } catch (error) {
      setStatus('error');
      setResult({
        tracksFound: 0,
        tracksMatched: 0,
        playlistsCreated: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error occurred']
      });
      addToast('Import failed', 'error');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleClose = () => {
    setStatus('idle');
    setResult(null);
    setDragActive(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-sonora-bark/30 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative w-full sm:w-[500px] max-h-[80vh] bg-sonora-cream rounded-t-2xl sm:rounded-2xl shadow-2xl animate-slide-up flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-sonora-sand flex-shrink-0">
          <div className="flex items-center gap-2">
            <Upload size={18} className="text-sonora-bark" />
            <h2 className="font-display text-lg font-semibold text-sonora-bark">Import Music</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-full hover:bg-sonora-warm text-sonora-stone hover:text-sonora-bark transition-calm"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {status === 'idle' && (
            <>
              {/* Drop Zone */}
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-calm
                  ${dragActive 
                    ? 'border-sonora-accent bg-sonora-accent/5' 
                    : 'border-sonora-sand hover:border-sonora-earth hover:bg-sonora-warm/50'
                  }`}
              >
                <Upload size={48} className={`mx-auto mb-4 ${dragActive ? 'text-sonora-accent' : 'text-sonora-stone'}`} />
                <p className="text-sm font-medium text-sonora-bark mb-2">
                  {dragActive ? 'Drop file here' : 'Drag & drop your file here'}
                </p>
                <p className="text-xs text-sonora-stone mb-4">
                  or click to browse
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-sonora-stone">
                  <FileText size={14} />
                  <span>Supported: JSON, CSV, TXT</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json,.csv,.txt"
                  onChange={handleFileInput}
                  className="hidden"
                />
              </div>

              {/* Instructions */}
              <div className="mt-6 bg-sonora-warm rounded-lg p-4">
                <h3 className="text-sm font-semibold text-sonora-bark mb-2">How to export your library</h3>
                <ul className="space-y-2 text-xs text-sonora-earth">
                  <li className="flex items-start gap-2">
                    <span className="text-sonora-accent font-bold">•</span>
                    <span><strong>Spotify:</strong> Use a third-party exporter like TuneMyMusic or Soundiiz</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sonora-accent font-bold">•</span>
                    <span><strong>Apple Music:</strong> Use Library Export or similar tools</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-sonora-accent font-bold">•</span>
                    <span><strong>YouTube Music:</strong> Export via Google Takeout</span>
                  </li>
                </ul>
              </div>

              {/* Privacy Note */}
              <div className="mt-4 text-center">
                <p className="text-xs text-sonora-stone italic">
                  Your data is processed locally and never sent to our servers
                </p>
              </div>
            </>
          )}

          {status === 'processing' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-sonora-sand border-t-sonora-accent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-lg font-medium text-sonora-bark mb-2">Importing your library...</p>
              <p className="text-sm text-sonora-stone">Matching tracks and creating playlists</p>
            </div>
          )}

          {status === 'success' && result && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-sonora-sage/20 flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-sonora-sage" />
              </div>
              <p className="text-lg font-medium text-sonora-bark mb-2">Import complete!</p>
              
              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between p-3 bg-sonora-warm rounded-lg">
                  <span className="text-sm text-sonora-stone">Tracks found</span>
                  <span className="text-sm font-semibold text-sonora-bark">{result.tracksFound}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-sonora-warm rounded-lg">
                  <span className="text-sm text-sonora-stone">Tracks matched</span>
                  <span className="text-sm font-semibold text-sonora-sage">{result.tracksMatched}</span>
                </div>
                {result.playlistsCreated > 0 && (
                  <div className="flex items-center justify-between p-3 bg-sonora-warm rounded-lg">
                    <span className="text-sm text-sonora-stone">Playlists created</span>
                    <span className="text-sm font-semibold text-sonora-bark">{result.playlistsCreated}</span>
                  </div>
                )}
              </div>

              <button
                onClick={handleClose}
                className="mt-6 px-6 py-2.5 bg-sonora-bark text-sonora-cream rounded-full text-sm font-medium hover:bg-sonora-night transition-calm"
              >
                Done
              </button>
            </div>
          )}

          {status === 'error' && result && (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-600" />
              </div>
              <p className="text-lg font-medium text-sonora-bark mb-2">Import failed</p>
              
              <div className="mt-6 space-y-2">
                {result.errors.map((error, i) => (
                  <div key={i} className="p-3 bg-red-50 rounded-lg text-sm text-red-700 text-left">
                    {error}
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setStatus('idle');
                  setResult(null);
                }}
                className="mt-6 px-6 py-2.5 bg-sonora-bark text-sonora-cream rounded-full text-sm font-medium hover:bg-sonora-night transition-calm"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
