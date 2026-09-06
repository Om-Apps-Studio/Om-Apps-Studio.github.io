export const GOAL_CONFIG = {
  TARGET_DISTANCE_KM: 1.6,
  TARGET_TIME_SECONDS: 480, // 8:00
  TARGET_TIME_FORMATTED: '8:00',
  TARGET_PACE_FORMATTED: '5:00/km',
  TARGET_SPEED_KMH: 12.0,
  SPLITS: {
    '400m': '2:00',
    '800m': '4:00',
    '1200m': '6:00',
    '1600m': '8:00'
  }
};

/**
 * Converts seconds into MM:SS format.
 */
export function formatSecondsToMMSS(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * Converts MM:SS string into total seconds.
 */
export function parseMMSSToSeconds(mmss: string): number {
  const parts = mmss.trim().split(':');
  if (parts.length === 2) {
    const mins = parseInt(parts[0], 10) || 0;
    const secs = parseInt(parts[1], 10) || 0;
    return mins * 60 + secs;
  }
  return parseInt(mmss, 10) || 0;
}

/**
 * Calculates pace per km from distance in km and duration in seconds.
 */
export function calculatePace(distanceKm: number, durationSeconds: number): { paceFormatted: string; speedKmh: number } {
  if (!distanceKm || distanceKm <= 0 || !durationSeconds || durationSeconds <= 0) {
    return { paceFormatted: '0:00', speedKmh: 0 };
  }
  const paceSecondsPerKm = durationSeconds / distanceKm;
  const speedKmh = Number(((distanceKm / (durationSeconds / 3600))).toFixed(1));
  return {
    paceFormatted: formatSecondsToMMSS(paceSecondsPerKm),
    speedKmh
  };
}
