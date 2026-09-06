import {
  getUserProfile,
  getAllDailyWorkouts,
  getAllWorkoutLogs,
  getAllRunningSessions,
  getAllBodyMetrics,
  getAllPersonalRecords,
  saveDailyWorkouts,
  updateUserProfile
} from './storageService';

export async function exportAllDataAsJSON(): Promise<string> {
  const profile = await getUserProfile();
  const workouts = await getAllDailyWorkouts();
  const logs = await getAllWorkoutLogs();
  const runs = await getAllRunningSessions();
  const bodyMetrics = await getAllBodyMetrics();
  const prs = await getAllPersonalRecords();

  const exportPayload = {
    exportVersion: '1.0',
    exportedAt: new Date().toISOString(),
    profile,
    workouts,
    logs,
    runs,
    bodyMetrics,
    prs
  };

  return JSON.stringify(exportPayload, null, 2);
}

export async function exportLogsAsCSV(): Promise<string> {
  const logs = await getAllWorkoutLogs();
  const headers = ['Date', 'Title', 'Location', 'Duration(min)', 'Distance(km)', 'AvgPace', 'RPE', 'Energy', 'Notes'];

  const rows = logs.map(log => [
    log.date,
    `"${log.title}"`,
    log.location,
    log.actualDurationMinutes,
    log.actualDistanceKm || 0,
    log.averagePaceFormatted || '',
    log.rpe,
    log.energyLevel,
    `"${log.notes || ''}"`
  ]);

  return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
}

export async function importDataFromJSON(jsonString: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonString);
    if (data.profile) {
      await updateUserProfile(data.profile);
    }
    if (data.workouts && Array.isArray(data.workouts)) {
      await saveDailyWorkouts(data.workouts);
    }
    return true;
  } catch (err) {
    console.error('Failed to import JSON data:', err);
    return false;
  }
}
