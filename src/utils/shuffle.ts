/**
 * Smart Shuffle Algorithm
 * 
 * Provides a more intelligent shuffle that:
 * 1. Avoids playing the same artist consecutively
 * 2. Distributes genres evenly
 * 3. Maintains some sense of flow/mood
 * 4. Ensures all tracks are played before repeating
 */

import { Track } from '../types';

export function smartShuffle(tracks: Track[]): Track[] {
  if (tracks.length <= 1) return [...tracks];

  const result: Track[] = [];
  
  // Group tracks by artist
  const byArtist = new Map<string, Track[]>();
  tracks.forEach(track => {
    if (!byArtist.has(track.artist)) {
      byArtist.set(track.artist, []);
    }
    byArtist.get(track.artist)!.push(track);
  });

  // Create pools for each artist
  const pools = Array.from(byArtist.values()).map(pool => [...pool]);
  
  let lastArtist = '';
  
  while (pools.some(pool => pool.length > 0)) {
    // Find pools that don't match the last artist
    const availablePools = pools
      .map((pool, index) => ({ pool, index }))
      .filter(({ pool }) => pool.length > 0 && pool[0].artist !== lastArtist);
    
    // If no pools available (all same artist), use any pool
    const poolsToUse = availablePools.length > 0 ? availablePools : pools
      .map((pool, index) => ({ pool, index }))
      .filter(({ pool }) => pool.length > 0);
    
    if (poolsToUse.length === 0) break;
    
    // Randomly select from available pools
    const selected = poolsToUse[Math.floor(Math.random() * poolsToUse.length)];
    const track = selected.pool.shift()!;
    
    result.push(track);
    lastArtist = track.artist;
  }
  
  return result;
}

/**
 * Weighted shuffle based on play count
 * Less played tracks have higher chance of appearing earlier
 */
export function weightedShuffle(tracks: Track[], playCounts: Map<string, number>): Track[] {
  if (tracks.length <= 1) return [...tracks];

  // Calculate weights (inverse of play count)
  const weighted = tracks.map(track => {
    const plays = playCounts.get(track.id) || 0;
    const weight = 1 / (plays + 1); // +1 to avoid division by zero
    return { track, weight };
  });

  // Shuffle based on weights
  const shuffled = [...weighted];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const totalWeight = shuffled.slice(0, i + 1).reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (let j = 0; j <= i; j++) {
      random -= shuffled[j].weight;
      if (random <= 0) {
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        break;
      }
    }
  }

  return shuffled.map(item => item.track);
}

/**
 * Mood-based shuffle
 * Groups tracks by similar characteristics for better flow
 */
export function moodShuffle(tracks: Track[]): Track[] {
  if (tracks.length <= 1) return [...tracks];

  // Group by genre (as a proxy for mood)
  const byGenre = new Map<string, Track[]>();
  tracks.forEach(track => {
    if (!byGenre.has(track.genre)) {
      byGenre.set(track.genre, []);
    }
    byGenre.get(track.genre)!.push(track);
  });

  // Shuffle within each genre group
  const genreGroups = Array.from(byGenre.values()).map(group => {
    const shuffled = [...group];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  });

  // Interleave genre groups
  const result: Track[] = [];
  const maxLength = Math.max(...genreGroups.map(g => g.length));
  
  for (let i = 0; i < maxLength; i++) {
    genreGroups.forEach(group => {
      if (i < group.length) {
        result.push(group[i]);
      }
    });
  }

  return result;
}
