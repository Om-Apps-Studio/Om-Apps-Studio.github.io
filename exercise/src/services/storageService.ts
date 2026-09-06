import { openDB, DBSchema, IDBPDatabase } from 'idb';
import {
  UserProfile,
  DailyWorkout,
  WorkoutLog,
  TCXRunningSession,
  BodyMetricsHistory,
  PersonalRecord,
  SmartCoachInsight,
  ExerciseItem
} from '../types';
import { EXERCISE_DATABASE } from '../data/exerciseDatabase';

interface CoachDB extends DBSchema {
  user_profile: {
    key: string;
    value: UserProfile;
  };
  daily_workouts: {
    key: string; // ISO date "YYYY-MM-DD"
    value: DailyWorkout;
    indexes: { 'by-date': string; 'by-status': string };
  };
  workout_logs: {
    key: string;
    value: WorkoutLog;
    indexes: { 'by-date': string };
  };
  running_sessions: {
    key: string;
    value: TCXRunningSession;
    indexes: { 'by-date': string };
  };
  body_metrics: {
    key: string;
    value: BodyMetricsHistory;
    indexes: { 'by-date': string };
  };
  personal_records: {
    key: string;
    value: PersonalRecord;
  };
  insights: {
    key: string;
    value: SmartCoachInsight;
  };
}

const DB_NAME = 'runfit_coach_db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<CoachDB>> | null = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<CoachDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('user_profile')) {
          db.createObjectStore('user_profile', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('daily_workouts')) {
          const workoutStore = db.createObjectStore('daily_workouts', { keyPath: 'date' });
          workoutStore.createIndex('by-date', 'date');
          workoutStore.createIndex('by-status', 'status');
        }
        if (!db.objectStoreNames.contains('workout_logs')) {
          const logStore = db.createObjectStore('workout_logs', { keyPath: 'id' });
          logStore.createIndex('by-date', 'date');
        }
        if (!db.objectStoreNames.contains('running_sessions')) {
          const runStore = db.createObjectStore('running_sessions', { keyPath: 'id' });
          runStore.createIndex('by-date', 'startTime');
        }
        if (!db.objectStoreNames.contains('body_metrics')) {
          const bodyStore = db.createObjectStore('body_metrics', { keyPath: 'id' });
          bodyStore.createIndex('by-date', 'date');
        }
        if (!db.objectStoreNames.contains('personal_records')) {
          db.createObjectStore('personal_records', { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains('insights')) {
          db.createObjectStore('insights', { keyPath: 'id' });
        }
      }
    });
  }
  return dbPromise;
}

// DEFAULT INITIAL STATE SEEDING
export async function seedInitialDataIfNeeded(): Promise<UserProfile> {
  const db = await getDB();
  let profile = await db.get('user_profile', 'default_user');

  if (!profile) {
    profile = {
      id: 'default_user',
      name: 'Om',
      avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCDexm1sT4WUT_yxc95zuRpByeFFnGbRDFTK1FRd9kg76jJmOA4JUTOgU_m3guBWxmSIQvP-Ep6UEM0d0lq3um_cgO4i6UlcjBAKS6pTATZYQ6fGPPepvOYdOyCy-cgdV5RFocp_wdP2Hk38DzPhBnvISIuVwgOxJa_WoJNX4XAwq0rBGfM5lDwizopMk9ifA0REY2EqoB95FEeeV4--39ZV8tIFqjcbth8nyCCJzLZGUqn-Ae1-CfS',
      targetDistanceKm: 1.6,
      targetTimeFormatted: '8:00',
      targetPaceFormatted: '5:00/km',
      targetSpeedKmh: 12.0,
      currentBest16kSeconds: 532, // 8:52
      currentBest1kSeconds: 315, // 5:15
      weightKg: 75.5,
      heightCm: 178,
      waistCm: 82.0,
      bodyFatPercentage: 16.5,
      maxPushUps: 25,
      maxSquats: 40,
      maxPlankSeconds: 60,
      weeklyAvailableDays: {
        Monday: 'FIELD',
        Tuesday: 'HOME',
        Wednesday: 'FIELD',
        Thursday: 'HOME',
        Friday: 'FIELD',
        Saturday: 'FIELD',
        Sunday: 'REST'
      },
      availableDurationMinutes: 45,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await db.put('user_profile', profile);

    // Initial Body metric record
    await db.put('body_metrics', {
      id: 'metric-init',
      date: new Date().toISOString().split('T')[0],
      weightKg: 75.5,
      waistCm: 82.0,
      bodyFatPercentage: 16.5
    });

    // Initial PRs
    const initialPRs: PersonalRecord[] = [
      { id: 'pr-16k', metricName: 'Best 1.6 KM Time', formattedValue: '8:52', rawNumericValue: 532, unit: 'min', achievedAt: '2026-08-01' },
      { id: 'pr-1k', metricName: 'Best 1 KM Time', formattedValue: '5:15', rawNumericValue: 315, unit: 'min', achievedAt: '2026-08-02' },
      { id: 'pr-pushups', metricName: 'Max Push-Ups', formattedValue: '25 reps', rawNumericValue: 25, unit: 'reps', achievedAt: '2026-08-01' },
      { id: 'pr-squats', metricName: 'Max Squats', formattedValue: '40 reps', rawNumericValue: 40, unit: 'reps', achievedAt: '2026-08-01' },
      { id: 'pr-plank', metricName: 'Longest Plank', formattedValue: '60 sec', rawNumericValue: 60, unit: 'sec', achievedAt: '2026-08-01' }
    ];
    for (const pr of initialPRs) {
      await db.put('personal_records', pr);
    }
  }

  return profile;
}

// PROFILE METHODS
export async function getUserProfile(): Promise<UserProfile> {
  return seedInitialDataIfNeeded();
}

export async function updateUserProfile(profile: UserProfile): Promise<void> {
  const db = await getDB();
  profile.updatedAt = new Date().toISOString();
  await db.put('user_profile', profile);
}

// DAILY WORKOUTS / MONTHLY CALENDAR METHODS
export async function getAllDailyWorkouts(): Promise<DailyWorkout[]> {
  const db = await getDB();
  return db.getAll('daily_workouts');
}

export async function getDailyWorkoutByDate(dateStr: string): Promise<DailyWorkout | undefined> {
  const db = await getDB();
  return db.get('daily_workouts', dateStr);
}

export async function saveDailyWorkouts(workouts: DailyWorkout[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('daily_workouts', 'readwrite');
  for (const w of workouts) {
    await tx.store.put(w);
  }
  await tx.done;
}

export async function updateDailyWorkout(workout: DailyWorkout): Promise<void> {
  const db = await getDB();
  await db.put('daily_workouts', workout);
}

// WORKOUT LOGS
export async function getAllWorkoutLogs(): Promise<WorkoutLog[]> {
  const db = await getDB();
  return db.getAll('workout_logs');
}

export async function saveWorkoutLog(log: WorkoutLog): Promise<void> {
  const db = await getDB();
  await db.put('workout_logs', log);

  // Mark the corresponding DailyWorkout as completed
  const workout = await db.get('daily_workouts', log.date);
  if (workout) {
    workout.status = 'completed';
    await db.put('daily_workouts', workout);
  }
}

// RUNNING SESSIONS & TCX
export async function getAllRunningSessions(): Promise<TCXRunningSession[]> {
  const db = await getDB();
  return db.getAll('running_sessions');
}

export async function saveRunningSession(session: TCXRunningSession): Promise<void> {
  const db = await getDB();
  await db.put('running_sessions', session);
}

// BODY METRICS
export async function getAllBodyMetrics(): Promise<BodyMetricsHistory[]> {
  const db = await getDB();
  return db.getAll('body_metrics');
}

export async function addBodyMetrics(metric: BodyMetricsHistory): Promise<void> {
  const db = await getDB();
  await db.put('body_metrics', metric);
}

// PRS
export async function getAllPersonalRecords(): Promise<PersonalRecord[]> {
  const db = await getDB();
  return db.getAll('personal_records');
}

export async function savePersonalRecord(pr: PersonalRecord): Promise<void> {
  const db = await getDB();
  await db.put('personal_records', pr);
}

// INSIGHTS
export async function getSmartCoachInsight(): Promise<SmartCoachInsight | null> {
  const db = await getDB();
  const insights = await db.getAll('insights');
  if (insights.length > 0) {
    return insights[insights.length - 1];
  }
  return {
    id: 'insight-default',
    type: 'progress',
    title: 'Smart Coach Insight',
    message: 'Your 1.6 km best time is 8:52. With consistent interval work and strength training, reaching 8:00 is within 3-4 monthly cycles.',
    actionableRecommendation: 'Stick to today\'s scheduled interval pacing for optimal aerobic adaptation.',
    createdAt: new Date().toISOString()
  };
}

export async function saveSmartCoachInsight(insight: SmartCoachInsight): Promise<void> {
  const db = await getDB();
  await db.put('insights', insight);
}
