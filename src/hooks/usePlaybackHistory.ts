import { useState, useEffect } from 'react';
import { Track } from '../types';

export interface PlaybackHistoryItem {
  track: Track;
  playedAt: number; // timestamp
}

const STORAGE_KEY = 'sonora-playback-history';
const MAX_HISTORY_ITEMS = 100;

export function usePlaybackHistory() {
  const [history, setHistory] = useState<PlaybackHistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load playback history:', error);
      return [];
    }
  });

  // Persist to localStorage whenever history changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save playback history:', error);
    }
  }, [history]);

  const addToHistory = (track: Track) => {
    setHistory(prev => {
      const newItem: PlaybackHistoryItem = {
        track,
        playedAt: Date.now(),
      };
      
      // Add to beginning and limit to MAX_HISTORY_ITEMS
      const newHistory = [newItem, ...prev].slice(0, MAX_HISTORY_ITEMS);
      return newHistory;
    });
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getRecentHistory = (limit: number = 20) => {
    return history.slice(0, limit);
  };

  const getHistoryByDate = (date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return history.filter(item => 
      item.playedAt >= startOfDay.getTime() && 
      item.playedAt <= endOfDay.getTime()
    );
  };

  return {
    history,
    addToHistory,
    clearHistory,
    getRecentHistory,
    getHistoryByDate,
  };
}
