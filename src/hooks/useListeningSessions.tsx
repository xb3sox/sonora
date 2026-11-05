import React, { useState, useEffect, useCallback } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Clock, TrendingUp } from 'lucide-react';

interface ListeningSession {
  id: string;
  startTime: number;
  endTime?: number;
  duration?: number; // in seconds
  tracksPlayed: number;
}

interface ListeningStats {
  totalListeningTime: number; // in seconds
  totalSessions: number;
  totalTracksPlayed: number;
  currentStreak: number; // days
  longestStreak: number; // days
  lastListeningDate?: string; // ISO date string
}

export function useListeningSessions() {
  const { state } = usePlayer();
  const [sessions, setSessions] = useLocalStorage<ListeningSession[]>('sonora-listening-sessions', []);
  const [stats, setStats] = useLocalStorage<ListeningStats>('sonora-listening-stats', {
    totalListeningTime: 0,
    totalSessions: 0,
    totalTracksPlayed: 0,
    currentStreak: 0,
    longestStreak: 0,
  });
  const [currentSession, setCurrentSession] = useState<ListeningSession | null>(null);
  const [isSessionActive, setIsSessionActive] = useState(false);

  // Start a new listening session
  const startSession = useCallback(() => {
    if (isSessionActive) return;

    const newSession: ListeningSession = {
      id: `session-${Date.now()}`,
      startTime: Date.now(),
      tracksPlayed: 0,
    };

    setCurrentSession(newSession);
    setIsSessionActive(true);
  }, [isSessionActive]);

  // End the current session
  const endSession = useCallback(() => {
    if (!currentSession || !isSessionActive) return;

    const endTime = Date.now();
    const duration = Math.floor((endTime - currentSession.startTime) / 1000);

    const completedSession: ListeningSession = {
      ...currentSession,
      endTime,
      duration,
    };

    // Add to sessions history
    setSessions(prev => [completedSession, ...prev].slice(0, 50)); // Keep last 50 sessions

    // Update stats
    const today = new Date().toISOString().split('T')[0];
    const lastDate = stats.lastListeningDate;
    
    let newStreak = stats.currentStreak;
    if (lastDate) {
      const lastDateObj = new Date(lastDate);
      const todayObj = new Date(today);
      const daysDiff = Math.floor((todayObj.getTime() - lastDateObj.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        newStreak += 1;
      } else if (daysDiff > 1) {
        newStreak = 1;
      }
    } else {
      newStreak = 1;
    }

    setStats({
      totalListeningTime: stats.totalListeningTime + duration,
      totalSessions: stats.totalSessions + 1,
      totalTracksPlayed: stats.totalTracksPlayed + currentSession.tracksPlayed,
      currentStreak: newStreak,
      longestStreak: Math.max(stats.longestStreak, newStreak),
      lastListeningDate: today,
    });

    setCurrentSession(null);
    setIsSessionActive(false);
  }, [currentSession, isSessionActive, sessions, stats, setSessions, setStats]);

  // Track when a new song is played
  useEffect(() => {
    if (currentSession && state.currentTrack && isSessionActive) {
      setCurrentSession(prev => prev ? { ...prev, tracksPlayed: prev.tracksPlayed + 1 } : null);
    }
  }, [state.currentTrack?.id]);

  // Auto-start session when music starts playing
  useEffect(() => {
    if (state.isPlaying && !isSessionActive) {
      startSession();
    }
  }, [state.isPlaying]);

  // Auto-end session when music stops for more than 5 minutes
  useEffect(() => {
    if (!state.isPlaying && isSessionActive) {
      const timer = setTimeout(() => {
        endSession();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearTimeout(timer);
    }
  }, [state.isPlaying, isSessionActive]);

  // Format duration for display
  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  // Get current session duration (live update)
  const [liveDuration, setLiveDuration] = useState(0);

  useEffect(() => {
    if (!currentSession || !isSessionActive) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - currentSession.startTime) / 1000);
      setLiveDuration(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [currentSession, isSessionActive]);

  return {
    sessions,
    stats,
    currentSession,
    isSessionActive,
    liveDuration,
    startSession,
    endSession,
    formatDuration,
  };
}

// Component to display listening session info
export function ListeningSessionWidget() {
  const { isSessionActive, liveDuration, currentSession, formatDuration, stats } = useListeningSessions();

  if (!isSessionActive || !currentSession) return null;

  return (
    <div className="bg-sonora-warm rounded-xl p-4 border border-sonora-sand">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs font-semibold text-sonora-stone uppercase tracking-wider">
            Listening Session
          </span>
        </div>
        <Clock size={16} className="text-sonora-accent" />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <p className="text-2xl font-bold text-sonora-bark tabular-nums">
            {formatDuration(liveDuration)}
          </p>
          <p className="text-xs text-sonora-stone mt-1">
            {currentSession.tracksPlayed} {currentSession.tracksPlayed === 1 ? 'track' : 'tracks'} played
          </p>
        </div>
        
        <div className="text-right">
          <p className="text-xs text-sonora-stone">Today's total</p>
          <p className="text-sm font-semibold text-sonora-bark">
            {formatDuration(stats.totalListeningTime)}
          </p>
        </div>
      </div>
    </div>
  );
}

// Component to display listening stats
export function ListeningStatsCard() {
  const { stats, formatDuration } = useListeningSessions();

  return (
    <div className="bg-sonora-warm rounded-xl p-6 border border-sonora-sand">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp size={20} className="text-sonora-accent" />
        <h3 className="font-display text-lg font-semibold text-sonora-bark">
          Listening Stats
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-sonora-stone mb-1">Total Time</p>
          <p className="text-xl font-bold text-sonora-bark">
            {formatDuration(stats.totalListeningTime)}
          </p>
        </div>

        <div>
          <p className="text-xs text-sonora-stone mb-1">Sessions</p>
          <p className="text-xl font-bold text-sonora-bark">
            {stats.totalSessions}
          </p>
        </div>

        <div>
          <p className="text-xs text-sonora-stone mb-1">Tracks Played</p>
          <p className="text-xl font-bold text-sonora-bark">
            {stats.totalTracksPlayed}
          </p>
        </div>

        <div>
          <p className="text-xs text-sonora-stone mb-1">Current Streak</p>
          <p className="text-xl font-bold text-sonora-bark">
            {stats.currentStreak} {stats.currentStreak === 1 ? 'day' : 'days'}
          </p>
        </div>
      </div>

      {stats.longestStreak > 0 && (
        <div className="mt-4 pt-4 border-t border-sonora-sand">
          <p className="text-xs text-sonora-stone">
            Longest streak: <span className="font-semibold text-sonora-bark">{stats.longestStreak} days</span>
          </p>
        </div>
      )}
    </div>
  );
}
