import React, { createContext, useContext, useState, useCallback } from 'react';

interface PlayCountContextType {
  playCounts: Map<string, number>;
  incrementPlayCount: (trackId: string) => void;
  getPlayCount: (trackId: string) => number;
}

const PlayCountContext = createContext<PlayCountContextType | null>(null);

export function PlayCountProvider({ children }: { children: React.ReactNode }) {
  const [playCounts, setPlayCounts] = useState<Map<string, number>>(new Map([
    ['t1', 12],
    ['t6', 8],
    ['t8', 15],
    ['t4', 6],
    ['t2', 9],
  ]));

  const incrementPlayCount = useCallback((trackId: string) => {
    setPlayCounts(prev => {
      const next = new Map(prev);
      next.set(trackId, (next.get(trackId) || 0) + 1);
      return next;
    });
  }, []);

  const getPlayCount = useCallback((trackId: string) => {
    return playCounts.get(trackId) || 0;
  }, [playCounts]);

  return (
    <PlayCountContext.Provider value={{
      playCounts,
      incrementPlayCount,
      getPlayCount,
    }}>
      {children}
    </PlayCountContext.Provider>
  );
}

export function usePlayCount() {
  const context = useContext(PlayCountContext);
  if (!context) throw new Error('usePlayCount must be used within PlayCountProvider');
  return context;
}
